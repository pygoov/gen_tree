(() => {

    window.treeManager = {
        peoples: [],
        links: [],
        currentPeope: null,
        km: 1,
        lastTransform: null,
        init() {

            this.pName = $('[data-controll-id="pName"]')
                .change(() => {
                    if (this.currentPeope == null) return
                    this.currentPeope.setName(this.pName.val())                    
                })
            this.pDescription = $('[data-controll-id="pDescription"]')
                .change(() => {
                    if (this.currentPeope == null) return
                    this.currentPeope.setDescription(this.pDescription.val())                    
                })

            // this.pDateOfBirth = $('[data-controll-id="pDateOfBirth"]')
            // this.pDateOfDeath = $('[data-controll-id="pDateOfDeath"]')

        },
        selectPeople(people) {
            for (let p of this.peoples) {
                p.unselect()
            }
            if (people != null) {
                people.select()
                this.pName.val(people.name)
                this.pDescription.val(people.description)                
            }
            this.currentPeope = people
        },
        addNewPeople(pos) {
            if (this.lastTransform != null) {
                pos.x = (pos.x - this.lastTransform.x) / this.km
                pos.y = (pos.y - this.lastTransform.y) / this.km
            }

            this.createPeople({
                uid: makeRandomKey(32),
                name: "Новый Человек",
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
                setDescription(val){
                    this.description = val 
                },
                transform(trnsf) {
                    _this.lastTransform = trnsf;
                    _this.km = trnsf.k;
                    this.rectObj.attr("transform", trnsf);
                    this.textObj.attr("transform", trnsf);
                },
                dragged() {
                    this.position.x += d3.event.dx / _this.km
                    this.position.y += d3.event.dy / _this.km

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
                    if (_this.lastTransform != null) {
                        this.transform(_this.lastTransform)
                        console.log(_this.lastTransform)
                    }
                }
            }
            people.buildObject()
            drawManager.addObject(people)

            this.peoples.push(people)
            return people
        },
        createLink(data) {

        }
    }

})()