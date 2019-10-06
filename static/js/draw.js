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
        init() {
            let _this = this;

            this.width = $("#graph").width();
            this.height = $("#graph").height();            

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
                        x: d3.event.x,
                        y: d3.event.y
                    }
                })            
                .call(this.zoom)
                //.on("mousedown.zoom", null)
            
        },
        createObject(objType){
            return this.svg.append(objType)
        },
        addObject(obj){
            this.objects.push(obj)
        },
        zoomZoomed() {            
            for(let obj of this.objects){
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