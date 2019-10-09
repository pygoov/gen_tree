(() => {

    window.drawManager = {
        width: null,
        height: null,
        svg: null,
        zoom: null,
        view: null,
        objects: [],
        k: 1,
        lastMousePos: null,
        lastTransform: null,
        init() {
            let _this = this;

            let graph = $("#graph")
            this.width = graph.width();
            this.height = graph.height();

            this.svg = d3.select("#graph")
                .attr("width", this.width)
                .attr("height", this.height)

            this.view = this.svg.append("rect")
                .attr("class", "view")
                .attr("x", 0.5)
                .attr("y", 0.5)
                .attr("width", this.width - 1)
                .attr("height", this.height - 1)

            this.zoom = d3.zoom()
                .scaleExtent([0.1, 40])
                // .translateExtent([[-this.width, -this.width], [this.width + 90, this.height + 100]])
                .on("zoom", () => { this.zoomZoomed() })

            this.svg
                .on("mousedown", () => {
                    contextMenuController.clearing()
                    _this.lastMousePos = {
                        x: d3.event.x - graph.position().left,
                        y: d3.event.y - graph.position().top
                    }
                })
                .call(this.zoom)
            //.on("mousedown.zoom", null)

        },
        createObject(objType, isLower=false) {
            if(isLower){
                return this.svg.insert(objType,":first-child")
            }
            else{
                return this.svg.append(objType)
            }
            
        },
        addObject(obj) {
            this.objects.push(obj)
        },
        removeObject(obj) {
            this.objects.splice(this.objects.indexOf(obj), 1);
        },
        zoomZoomed() {
            this.lastTransform = d3.event.transform
            for (let obj of this.objects) {
                obj.transform(d3.event.transform);
            }
        },
        zoomResetted() {
            this.svg.transition()
                .duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        }

    }

})()