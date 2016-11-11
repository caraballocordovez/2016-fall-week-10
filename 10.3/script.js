console.log('10.3');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//Color scale
var scaleColor = d3.scaleLinear().domain([0,.15]).range(['white','red']);

//Mapping
var projection = d3.geoAlbersUsa(),
    path = d3.geoPath().projection(projection);


//d3.map for data
var rate = d3.map();

d3.queue()
    .defer(d3.json, '../data/gz_2010_us_050_00_5m.json')
    .defer(d3.tsv, '../data/unemployment.tsv', parseData)
    .await(function(err, geo, data){
        console.log(geo);
        console.log(rate);

        projection
    .fitExtent ([[0,0], [w,h]], geo);

var counties = plot.selectAll(".county")
    .data(geo.features)
    .enter()
    .append("path").attr("class", "county")
    .attr("d", path)
    .style("fill", function(d){
        var id = (+d.properties.STATE) + d.properties.COUNTY;

        //Get unemployment from lookup
        var r = rate.get(id);

        //Use unemployment rate to set color


        //Return that color
        return scaleColor(r);
    });

    counties.on("click", function(d){
        console.log(d.properties.STATE + d.properties.COUNTY);
})

    });


function parseData(d){
    rate.set(d.id, +d.rate);

}
