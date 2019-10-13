(() => {

    window.treeManager = {
        peoples: [],
        links: [],
        currentPeople: null,
        currentLink: null,
        init() {
            let _this = this

            this.pName = $('[data-control-id="pName"]')
                .keyup(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setName(this.pName.val())
                })
                .change(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setName(this.pName.val())
                })

            this.pDescription = $('[data-control-id="pDescription"]')
                .keyup(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setDescription(this.pDescription.val())
                })
                .change(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setDescription(this.pDescription.val())
                })

            contextMenuController.wrapContextMenu(
                $('#graph'),
                [
                    {
                        is_show: (e) => {
                            return true;
                        },
                        click: (e) => {
                            _this.addNewPeople(
                                drawManager.lastMousePos
                            )
                        },
                        click_is_close: true,
                        text: "Добавить человека",
                        icon_classes: "green add"
                    },
                    {
                        is_show: (e) => {
                            return _this.currentPeople != null;
                        },
                        click: (e) => {
                            _this.currentPeople.remove()
                            _this.selectPeople(null)
                        },
                        click_is_close: true,
                        text: "Удалить выбранного человека",
                        icon_classes: "red close"
                    },
                    {
                        is_show: (e) => {
                            return _this.currentLink != null;
                        },
                        click: (e) => {
                            _this.currentLink.remove()
                            _this.selectLink(null)
                        },
                        click_is_close: true,
                        text: "Удалить выбранную связь",
                        icon_classes: "red close"
                    }
                ]
            )
        },
        getJson() {
            links_data = []
            for (let link of this.links) {
                links_data.push(link.getJson())
            }

            peoples_data = []
            for (let people of this.peoples) {
                peoples_data.push(people.getJson())
            }

            return {
                "links": links_data,
                "peoples": peoples_data
            }
        },
        loadJson(data) {
            if(data.links == undefined || data.peoples == undefined){
                alert('Файл неправильного формата!')
                throw "ERROR: data not valid!"
            }

            for(let people of data.peoples){
                this.createPeople(people)
            }

            for(let link of data.links){

                this.createLink(
                    link.peoples[0],
                    link.peoples[1]
                )
            }

        },
        selectPeople(people) {
            for (let p of this.peoples) {
                p.unselect()
            }

            if (people != null) {

                if (this.currentPeople != null && app.isCtrlDown) {
                    if (people != this.currentPeople) {
                        this.createLink(this.currentPeople.uid, people.uid)
                    }
                }

                people.select()

                this.selectLink(null)
                this.pName.val(people.name)
                this.pDescription.val(people.description)
            }
            else {
                this.pName.val('')
                this.pDescription.val('')
            }
            this.currentPeople = people
        },
        selectLink(link) {
            for (let l of this.links) {
                l.unselect()
            }

            if (link != null) {
                link.select()
                this.selectPeople(null)
            }

            this.currentLink = link
        },
        addNewPeople(pos) {
            if (drawManager.lastTransform != null) {
                pos.x = (pos.x - drawManager.lastTransform.x) / drawManager.lastTransform.k
                pos.y = (pos.y - drawManager.lastTransform.y) / drawManager.lastTransform.k
            }

            this.createPeople({
                uid: app.makeRandomKey(32),
                name: "Новый человек",
                description: "Описание человека",
                position: {
                    x: pos.x,
                    y: pos.y
                },
                size: {
                    width: 200,
                    height: 40,
                }
            })
        },
        createPeople(data) {
            let _this = this
            let people = {
                uid: data.uid,
                name: data.name,
                description: data.description,
                position: data.position,
                size: data.size,
                rectObj: null,
                textObj: null,
                getJson() {
                    return {
                        "uid": this.uid,
                        "name": this.name,
                        "description": this.description,
                        "position": this.position,
                        "size": this.size
                    }
                },
                unselect() {
                    this.rectObj
                        .transition()
                        .duration(200)
                        .style("stroke-width", 4)
                        .style("stroke", "black")
                },
                select() {
                    this.rectObj
                        .transition()
                        .duration(200)
                        .style("stroke-width", 8)
                        .style("stroke", "red")
                },
                setName(val) {
                    this.name = val
                    this.textObj.text(this.name)
                    this.initPosition()
                },
                setDescription(val) {
                    this.description = val
                },
                transform(trnsf) {
                    drawManager.lastTransform = trnsf;
                    this.rectObj.attr("transform", trnsf);
                    this.textObj.attr("transform", trnsf);
                },
                dragged() {
                    if (drawManager.lastTransform != null) {
                        this.position.x += d3.event.dx / drawManager.lastTransform.k
                        this.position.y += d3.event.dy / drawManager.lastTransform.k
                    }
                    else {
                        this.position.x += d3.event.dx
                        this.position.y += d3.event.dy
                    }

                    this.initPosition()
                },
                initPosition() {
                    let box = this.textObj.node().getBBox()
                    this.size.width = box.width + 30
                    this.rectObj
                        .attr("x", this.position.x)
                        .attr("y", this.position.y)
                        .attr("width", this.size.width)

                    this.textObj
                        .attr("x", this.position.x + this.size.width / 2)
                        .attr("y", this.position.y + this.size.height / 2)


                    for (let link of _this.findLinks(this.uid)) {
                        link.initPosition()
                    }
                },
                remove() {
                    this.rectObj.remove()
                    this.textObj.remove()

                    drawManager.removeObject(this)
                    _this.peoples.splice(_this.peoples.indexOf(this), 1);

                    for (let link of _this.findLinks(this.uid)) {
                        link.remove()
                    }
                },
                buildObject() {
                    this.rectObj = drawManager.createObject("rect")
                        .attr("rx", 7)
                        .attr("ry", 7)
                        .attr("width", this.size.width)
                        .attr("height", this.size.height)
                        .style("stroke-width", 4)
                        .style("stroke", "black")
                        .style("fill", "white")
                        .on("mousedown", () => { _this.selectPeople(this) })
                        .call(
                            d3.drag().on("drag", (d) => {
                                people.dragged(d)
                            })
                        )

                    this.textObj = drawManager.createObject("text")
                        .text(this.name)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "red")
                        .on("mousedown", () => { _this.selectPeople(this) })
                        .call(
                            d3.drag().on("drag", (d) => {
                                people.dragged(d)
                            })
                        )

                    this.initPosition()
                    if (drawManager.lastTransform != null) {
                        this.transform(drawManager.lastTransform)
                    }
                }
            }
            people.buildObject()
            drawManager.addObject(people)

            this.peoples.push(people)
            return people
        },
        findPeople(p_uid){
            for(let people of this.peoples){
                if(people.uid == p_uid) return people
            }
            return null
        },
        findLinks(p1_uid, p2_uid = null) {
            let targetLinks = []
            for (let link of this.links) {
                if (p2_uid == null) {
                    if (link.peoples.includes(p1_uid)) {
                        targetLinks.push(link)
                    }
                }
                else {
                    if (link.peoples.includes(p1_uid) && link.peoples.includes(p2_uid)) {
                        targetLinks.push(link)
                    }
                }
            }
            return targetLinks
        },
        createLink(p1_uid, p2_uid) {
            if (this.findLinks(p1_uid, p2_uid).length != 0) return
            let _this = this
            let p1 = this.findPeople(p1_uid)
            let p2 = this.findPeople(p2_uid)

            let link = {
                peoples: [p1_uid, p2_uid],
                lineObj: null,
                getJson() {
                    return {
                        "peoples": this.peoples
                    }
                },
                unselect() {
                    this.lineObj
                        .transition()
                        .duration(200)
                        .style('stroke', 'black')

                        .attr('stroke-width', 4)
                },
                select() {
                    this.lineObj
                        .transition()
                        .duration(200)
                        .style("stroke", "red")
                        .attr('stroke-width', 8)
                },
                transform(trnsf) {
                    this.lineObj.attr("transform", trnsf);
                },
                remove() {
                    this.lineObj.remove()
                    drawManager.removeObject(this)
                    _this.links.splice(_this.links.indexOf(this), 1);
                },
                initPosition() {
                    this.lineObj
                        .attr('x1', p1.position.x + p1.size.width / 2)
                        .attr('x2', p2.position.x + p2.size.width / 2)
                        .attr('y1', p1.position.y + p1.size.height / 2)
                        .attr('y2', p2.position.y + p2.size.height / 2)
                },
                buildObject() {
                    this.lineObj = drawManager.createObject("line", true)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 4)
                        .on("mousedown", () => { _this.selectLink(this) })

                    this.initPosition()
                    if (drawManager.lastTransform != null) {
                        this.transform(drawManager.lastTransform)
                    }
                }
            }
            link.buildObject()
            this.links.push(link)
            drawManager.addObject(link)
        }
    }

})()