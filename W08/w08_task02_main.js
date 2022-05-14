d3.csv("https://watanabekeita1875040t.github.io/InfoVis2022/W08/w08_task02.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:50, right:100, bottom:150, left:100}
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
        console.log( data );
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:30, bottom:30, left:30}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

    }

    update() {
        let self = this;

        self.render();
    }

    render() {
        let self = this;

        self.line = d3.line()
            .x( d => d.x )
            .y( d => d.y );

        self.svg.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');
    }
}