class ScatterPlotList {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || ''
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

        self.text = self.svg.append('g')

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.text.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text( self.config.xlabel );
    }

    update( i, flag1, flag2 ) {
        let self = this;

        if(flag2)
        {
            this.chart.remove();
            this.text.remove();
            this.init();
        }
        
        self.xvalue = d => d.patients;
        if( i == 1 )
        {
            self.yvalue = d => d.Tave;
        }
        if( i == 2 )
        {
            self.yvalue = d => d.Tmax;
        }
        if( i == 3 )
        {
            self.yvalue = d => d.Tmin;
        }
        if( i == 4 )
        {
            self.yvalue = d => d.wind;
        }
        if( i == 5 )
        {
            self.yvalue = d => d.suntime;
        }
        if( i == 6 )
        {
            self.yvalue = d => d.humidily;
        }
        if( i == 7 )
        {
            self.yvalue = d => d.rain;
        }

        const xmin = d3.min( self.data, self.xvalue );
        const xmax = d3.max( self.data, self.xvalue );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, self.yvalue );
        const ymax = d3.max( self.data, self.yvalue );
        self.yscale.domain( [ymin, ymax] );

        self.render( i, flag1 );
    }

    render( i, flag ) {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .join('circle');

        const circle_radius = 3;
        
        circles
            .attr("r", circle_radius )
            .attr("cx", d => self.xscale( self.xvalue(d) ) )
            .attr("cy", d => self.yscale( self.yvalue(d) ) )

        circles
            .attr('stroke', 'black')
            .attr('fill', 'black');

        if(flag)
        {
            circles
                .attr('stroke', 'green')
                .attr('fill', 'green');
        }
        
        circles
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">${self.config.ylabel}</div>(${self.xvalue(d)}, ${self.yvalue(d)})`);
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

        const value_name = [ "Tave","Tmax","Tmin","wind","suntime","humidily","rain"]
        const ylabel_space = 45;
        self.text.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( value_name[i-1] );

    }
}
