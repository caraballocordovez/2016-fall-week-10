console.log('10.1');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//Mapping specific functions
//Projection
var projection = d3.geoAlbersUsa() // This is one of the possibilities to project geo data. There are many more on d3 library.
    /* .center([-98.579455, 39.827995]) //this method says, I will take a particular coordinate of the map and line it up with the coordinate that we put on the next method (translate)
    .translate([w/2, h/2])
    .scale(300);*/ //This is how you did it before version 4 of D3. 

//Geopath
var pathGenerator = d3.geoPath() //this function won't do anything until we tell it how to project the geoemtry of a sphere (earth's coordinates) in a two dimension surface.
    .projection(projection);

d3.json('../data/gz_2010_us_040_00_5m.json',dataloaded);

function dataloaded(err, data){

    //See what the data looks like first
    console.log(data);

    //Update projection to fit all the data within the drawing extent
    projection
        .fitExtent([[0,0], [w,h]], data);


    //Represent a feature collection of polygons
    var states = plot.selectAll(".state") //why .state???
    .data(data.features)
    .enter()
    .append("path").attr("class", "state newengland")
    .attr("d", pathGenerator);

    plot.selectAll(".newengland")

    //Represent a collection of points
    var points = [
        {city:'Boston',location:[-71.0589,42.3601]},
        {city:'San Francisco',location:[-122.4194,37.7749]}
    ];

    var cities = plot.selectAll(".city") //why .city??
        .data(points) //why points
        .enter()
        .append("circle")
        .attr("transform", function(d){
            var xy = projection(d.location);
            return "translate("+xy[0]+","+xy[1]+")";
        })
        .attr("r", 5)
        .style("fill", "white");

    //Represent a line
    var lineData = {
        type:"Feature",
        geometry:{
            type:'LineString',
            coordinates:[[-71.0589,42.3601],[-122.4194,37.7749]]
        },
        properties:{}
    };

    plot.append("path")
        .datum(lineData) //why Datum??
        .attr("d", pathGenerator)
        .style ("fill", "none")
        .style("stroke", "blue")
        .style("stroke-width", "2px");

    /* plot.append("g")
        .append("path")
        .data(lineData.geometry.coordinates) //why Datum??
        .enter()
        .attr("d", pathGenerator)
        .style ("fill", "none")
        .style("stroke", "blue")
        .style("stroke-width", "2px"); */

}