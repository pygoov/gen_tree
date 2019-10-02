(() => {

    window.treeManager = {
        peoples: [],
        links: [],
        currentPeope: null,
        init() {
            this.createPeople({
                uid: "1",
                name: "Вася Пупкин",
                description: "description",
                position: {
                    x: 100,
                    y: 100
                }
            })

            this.createPeople({
                uid: "2",
                name: "Веаника Кисиёва",
                description: "description",
                position: {
                    x: 400,
                    y: 100
                }
            })

        },
        selectPeople(people){
            for(let p of this.peoples){
                p.unselect()
            }

            people.select()
            this.currentPeope = people
        },
        createPeople(data) {
            let _this = this
            let people = {
                uid: data.uid,
                name: data.name,
                description: data.description,
                position: data.position,
                rectObj: null,
                textObj: null,
                unselect(){                    
                    this.rectObj
                        .transition()
                        .duration(750)                        
                        .style("stroke-width", 4)
                        .style("stroke", "black")
                },
                select(){
                    this.rectObj
                        .transition()
                        .duration(750)                        
                        .style("stroke-width", 8)
                        .style("stroke", "red")
                },
                transform(trnsf){
                    this.rectObj.attr("transform", trnsf);
                    this.textObj.attr("transform", trnsf);
                },
                buildObject() {
                    this.rectObj = drawManager.createObject("rect")
                        .attr("x", this.position.x)
                        .attr("y", this.position.y)
                        .attr("rx", 7)
                        .attr("ry", 7)
                        .attr("width", 200)
                        .attr("height", 40)
                        .style("stroke-width", 4)
                        .style("stroke", "black")
                        .style("fill", "white")
                        .on("mouseover", ()=>{this.handleMouseOver()})
                        .on("mouseout", ()=>{this.handleMouseOut()})
                        .on("mousedown", ()=>{_this.selectPeople(this)})

                    this.textObj = drawManager.createObject("text")
                        .attr("x", +this.rectObj.attr('x') + +this.rectObj.attr('width') / 2)
                        .attr("y", +this.rectObj.attr('y') + +this.rectObj.attr('height') / 2)                        
                        .text(this.name)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "red") 
                        .on("mouseover", ()=>{this.handleMouseOver()})
                        .on("mouseout", ()=>{this.handleMouseOut()})
                        .on("mousedown", ()=>{_this.selectPeople(this)})

                },
                handleMouseOver(){
                    // console.log('handleMouseOver')
                    // this.rectObj
                    //     .transition()
                    //     .duration(750)
                    //     .style("stroke", "red")
                },
                handleMouseOut(){
                    // console.log('handleMouseOut')
                    // this.rectObj
                    //     .transition()
                    //     .duration(750)
                    //     .style("stroke", "black")
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