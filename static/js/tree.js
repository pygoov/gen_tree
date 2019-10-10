(() => {

    window.treeManager = {
        peoples: [],
        links: [],
        currentPeople: null,
        currentLink: null,
        init() {
            this.pName = $('[data-controll-id="pName"]')
                .change(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setName(this.pName.val())
                })
            this.pDescription = $('[data-controll-id="pDescription"]')
                .change(() => {
                    if (this.currentPeople == null) return
                    this.currentPeople.setDescription(this.pDescription.val())
                })
        },
        getJson(){

            links_data = []
            for(let link of this.links){
                links_data.push(link.getJson())
            }

            peoples_data = []
            for(let people of this.peoples){
                peoples_data.push(people.getJson())
            }

            return {
                "links": links_data,
                "peoples": peoples_data
            }
        },
        loadJson(data){
            
        },
        selectPeople(people) {
            for (let p of this.peoples) {
                p.unselect()
            }

            if (people != null) {

                if (this.currentPeople != null && window.isCtrlDown) {
                    if (people != this.currentPeople) {
                        this.createLink(this.currentPeople, people)
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
        selectLink(link){
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
                uid: makeRandomKey(32),
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


                    for (let link of _this.findLinks(this)) {
                        link.initPosition()
                    }
                },
                remove() {
                    this.rectObj.remove()
                    this.textObj.remove()

                    drawManager.removeObject(this)
                    _this.peoples.splice(_this.peoples.indexOf(this), 1);

                    for (let link of _this.findLinks(this)) {
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
        findLinks(p1, p2 = null) {
            let targetLinks = []
            for (let link of this.links) {
                if (p2 == null) {
                    if (link.peoples.includes(p1.uid)) {
                        targetLinks.push(link)
                    }
                }
                else {
                    if (link.peoples.includes(p1.uid) && link.peoples.includes(p2.uid)) {
                        targetLinks.push(link)
                    }
                }
            }
            return targetLinks
        },
        createLink(p1, p2) {
            if (this.findLinks(p1, p2).length != 0) return
            let _this = this

            let link = {
                peoples: [p1.uid, p2.uid],
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