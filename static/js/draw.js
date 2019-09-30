(() => {

    window.drawManager = {
        width: null,
        height: null,
        svg: null,
        zoom: null,        
        view: null,        
        init() {
            this.width = $("#graph").width();
            this.height = $("#graph").height();
            console.log(`Width:${this.width} Height:${this.height}`)

            this.svg = d3.select("#graph")
                .attr("width", this.width)
                .attr("height", this.height)

            let rect = this.svg.append("rect")
                .attr("x", 100)
                .attr("y", 100)
                .attr("rx", 7)
                .attr("ry", 7)
                .attr("width", 200)
                .attr("height", 40)
                .style("stroke-width", 4)
                .style("stroke", "black")
                .style("fill", "none")                

            let text = this.svg.append("text")
                .attr("x", +rect.attr('x') + +rect.attr('width') / 2)
                .attr("y", +rect.attr('y') + +rect.attr('height') / 2)
                .text("My text")
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red")

            // this.circle = this.svg.append("circle")
            //     .attr("cx", 30)
            //     .attr("cy", 30)
            //     .attr("r", 20)

            // this.circle2 = this.svg.append("circle")
            //     .attr("cx", 65)
            //     .attr("cy", 65)
            //     .attr("r", 20)

            this.view = this.svg.append("rect")
                .attr("class", "view")
                .attr("x", 0.5)
                .attr("y", 0.5)
                .attr("width", this.width - 1)
                .attr("height", this.height - 1)

            this.zoom = d3.zoom()
                .scaleExtent([1, 40])
                // .translateExtent([[-this.width, -this.width], [this.width + 90, this.height + 100]])
                .on("zoom", () => { this.zoomZoomed() });

            this.svg.call(this.zoom);
        },
        zoomZoomed() {
            // this.circle.attr("transform", d3.event.transform);
            // this.circle2.attr("transform", d3.event.transform);
        },
        zoomResetted() {
            this.svg.transition()
                .duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        }

    }

})()