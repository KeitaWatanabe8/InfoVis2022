d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:50, right:100, bottom:150, left:100}
        };

        const scatter_plot = new ScatterPlot( config, data );
        console.log( data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(15);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(15);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`)
            .attr( "id","yaxis" );

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(275, 30)`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "20pt")
            .attr("font-weight", "bold")
            .text("Scatter Plot");

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(250, ${self.inner_height + 90})`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("X Label");

        self.svg.append("g")
            .append("text")
            .attr('transform', `translate(60, ${self.inner_height / 2 + 50})rotate(-90)`)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("Y Label");
    }

    update() {
        let self = this;

        const space = 10;
        const xmin = d3.min( self.data, d => d.x ) - space;
        const xmax = d3.max( self.data, d => d.x ) + space;
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y ) - space;
        const ymax = d3.max( self.data, d => d.y ) + space;
        self.yscale.domain( [ymax, ymin] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`)
                    .attr("fill", 'pink');
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );

    }
}
