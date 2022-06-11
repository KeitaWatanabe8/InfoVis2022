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

        self.yscale1 = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.yscale2 = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5);

        self.yaxis1 = d3.axisLeft( self.yscale1 )
            .ticks(5);

        self.yaxis2 = d3.axisLeft( self.yscale2 )
            .ticks(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group1 = self.chart.append('g')
            .attr('transform', `translate(0, 0)`)
            .attr( "id","yaxis1" );

        self.yaxis_group2 = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width}, 0)`)
            .attr( "id","yaxis2" );
    }

    update() {
        let self = this;

        const space = 3;

        self.xvalue = d => d.date;
        self.yvalue1 = d => d.patients;
        self.yvalue2 = d => d.Tmin;

        const xmin = d3.min( self.data, self.xvalue ) - space;
        const xmax = d3.max( self.data, self.xvalue ) + space;
        self.xscale.domain( [xmin, xmax] );

        const ymin1 = d3.min( self.data, self.yvalue1 ) ;
        const ymax1 = d3.max( self.data, self.yvalue1 ) + space;
        self.yscale1.domain( [ymax1, ymin1] );

        const ymin2 = d3.min( self.data, self.yvalue2 ) ;
        const ymax2 = d3.max( self.data, self.yvalue2 ) + space;
        self.yscale2.domain( [ymax2, ymin2] );

        self.line1 = d3.line()
            .x( d => self.xscale( self.xvalue(d) ) )
            .y( d => self.yscale1( self.yvalue1(d) ) );

        self.line2 = d3.line()
            .x( d => self.xscale( self.xvalue(d) ) )
            .y( d => self.yscale2( self.yvalue2(d) ) );

        self.area = d3.area()
            .x( d => self.xscale( self.xvalue(d) ) )
            .y1( d => self.yscale1( self.yvalue1(d) ) )
            .y0( self.inner_height );

        self.render();
    }

    render() {
        let self = this;

        self.chart.append('path')
            .attr('d', self.line1(self.data))
            .attr('stroke', 'green')
            .attr('fill', 'none');

        self.chart.append('path')
            .attr('d', self.line2(self.data))
            .attr('stroke', 'red')
            .attr('fill', 'none');

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group1
            .call( self.yaxis1 );

        self.yaxis_group2
            .call( self.yaxis2 );
    }
}