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

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`)
            .attr( "id","yaxis" );
    }

    update() {
        let self = this;

        const space = 3;

        self.xvalue = d => d.date;
        self.yvalue = d => d.patients;

        const xmin = d3.min( self.data, self.xvalue ) - space;
        const xmax = d3.max( self.data, self.xvalue ) + space;
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, self.xvalue ) - space;
        const ymax = d3.max( self.data, self.xvalue ) + space;
        self.yscale.domain( [ymax, ymin] );

        self.line = d3.line()
            .x( d => self.xscale( self.xvalue(d) ) )
            .y( d => self.yscale( self.yvalue(d) ) );

        self.area = d3.area()
            .x( d => self.xscale( self.xvalue(d) ) )
            .y1( d => self.yscale( self.yvalue(d) ) )
            .y0( self.inner_height );

        self.render();
    }

    render() {
        let self = this;

        self.chart.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'none');

        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black')
            .attr('fill', 'pink');

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}