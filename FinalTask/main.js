let input_data;
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
            console.log(a);
            scatter_plot = new ScatterPlot( {
                parent: a,
                width: 156,
                height: 156,
                margin: {top:10, right:10, bottom:50, left:50},
                xlabel: 'Heatstroke Patients',
                ylabel: value_name[i-1],
                cscale: color_scale
            }, input_data );
            console.log( d => d.Tmax );
            scatter_plot.update( i );
        }

        line_chart = new LineChart( {
            parent: '#drawing_region_linechart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Species',
            cscale: color_scale
        }, input_data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
