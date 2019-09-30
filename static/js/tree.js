(() => {

    window.treeManager = {
        peoples: [],
        links: [],
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
        createPeople(data) {
            let people = {
                uid: data.uid,
                name: data.name,
                description: data.description,
                position: data.position,
                rectObj: null,
                textObj: null,
                buildObject() {
                    this.rectObj = drawManager.appendObject("rect")
                        .attr("x", this.position.x)
                        .attr("y", this.position.y)
                        .attr("rx", 7)
                        .attr("ry", 7)
                        .attr("width", 200)
                        .attr("height", 40)
                        .style("stroke-width", 4)
                        .style("stroke", "black")
                        .style("fill", "none")

                    this.textObj = drawManager.appendObject("text")
                        .attr("x", +this.rectObj.attr('x') + +this.rectObj.attr('width') / 2)
                        .attr("y", +this.rectObj.attr('y') + +this.rectObj.attr('height') / 2)
                        .text(this.name)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20px")
                        .attr("fill", "red")                    
                }
            }

            people.buildObject()

            this.peoples.push(people)
            return people
        },
        createLink(data) {

        }
    }

})()