let input_data;
let scatter_plot_list = [];
let scatter_plot;
let line_chart;
let filter = [];

d3.csv("https://WatanabeKeita1875040T.github.io/InfoVis2022/FinalTask/data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.date = +d.date;
            d.patients = +d.patients;
            d.Tave = +d.Tave;
            d.Tmax = +d.Tmax;
            d.Tmin = +d.Tmin;
            d.wind = +d.wind;
            d.suntime = +d.suntime;
            d.humidily = +d.humidily;
            d.rain = +d.rain;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['setosa','versicolor','virginica']);

        const value_name = [ "Tave","Tmax","Tmin","wind","suntime","humidily","rain"]

        for (let i = 1; i <= 7; i++) {
            let a = '#drawing_region_scatterplot' + i;
            scatter_plot_list[i] = new ScatterPlotList( {
                parent: a,
                width: 156,
                height: 156,
                margin: {top:10, right:10, bottom:50, left:50},
                xlabel: 'Heatstroke Patients',
                ylabel: value_name[i-1],
                cscale: color_scale
            }, input_data );
            if(i == 1)
            {
                scatter_plot_list[i].update( i, 1, 0 );
            }else{
                scatter_plot_list[i].update( i, 0 , 0);
            }
        }

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 356,
            height: 356,
            margin: {top:10, right:100, bottom:150, left:50},
            xlabel: 'Date',
            ylabel: 'Heatstroke Patients'
        }, input_data );
        line_chart.update( 1, 0 ); 

        let i = 1;
        d3.select('#aa')
        .on('click', d => {
            i++;
            if( i == 8 )
            {
                i = 1;
            }
            line_chart.update( i, 1 );
            scatter_plot_list[i].update( i, 1 )
            if( i >= 2 )
            {
                scatter_plot_list[i-1].update( i-1, 0, 1 )
            }
            if( i == 1 )
            {
                scatter_plot_list[7].update( 7, 0, 1)
            }
           
        });
        d3.select('#bb')
        .on('click', d => {
            i--;
            if( i == 0 )
            {
                i = 7;
            }
            line_chart.update( i, 1 ); 
            scatter_plot_list[i].update( i, 1 )
            if( i < 7 )
            {
                scatter_plot_list[i+1].update( i+1, 0, 1 )
            }
            if( i == 7 )
            {
                scatter_plot_list[1].update( 1, 0, 1 )
            }
        });
    })
    .catch( error => {
        console.log( error );
    });
