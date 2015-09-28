import Ember from 'ember';

import d3 from 'npm:d3';
/*

 Dependency Hell!!!

d3 does UMD, so will appear as AMD if that works, or requirejs if that works
or global otherwise. But d3-geo-projection requires d3 to be global

There is a topojson in npm, but it is the server side half, we need the client
side half which is not in npm

Maybe I am just stupid, but imports from amd dependencies are hard. 
Putting this in ember-cli-build.js 

  app.import('bower_components/topojson/topojson.js', {
    exports: {
      'topojson': [ 'default']
    }
  });
doesn't work with 
import topojson from 'topojson'
in my component

Solved this by editing topojson.js to force a global (putting false && at 
beginning of both if statments). Seems to work but makes
me feel icky and unclean. Sigh...

Also, looks like a few projections are already in d3, so we don't need 
d3-geo-projection unless we want fancy projections. For now I am happy to
just see SOMETHING in the browser.

$0.02 javascript really, really needs to figure out a module system. Maybe ES6
will solve it, until then we live in dependency hell.

*/
//import d3geoprojection from 'd3-geo-projection';
//import topojson from 'npm:topojson';
//import topojson from 'topojson';


export default Ember.Component.extend({

    didInsertElement: function() {
console.log("didInsertElement "+this.get('elementId'));
        Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
    },
    updateGraph: function() {
        let elementId = this.get('elementId');
        let quake = this.get('event');
        let station = this.get('station');
        let svgDiv = d3.select('#'+elementId).append("div");
        svgDiv.classed('map', true);
        let styleWidth = parseInt(svgDiv.style("width"));
        if (styleWidth < 100) { styleWidth = 100; }
        let styleHeight = parseInt(svgDiv.style("height"));
        if (styleHeight < 100) { styleHeight = 100; }
        let svg = svgDiv.append("svg")
            .attr("width", styleWidth)
            .attr("height", styleHeight);

        let projection = d3.geo.equirectangular()
            .scale(60*styleWidth/360)
            .translate([styleWidth / 2, styleHeight / 2])
            .precision(0.1);

        let path = d3.geo.path()
            .projection(projection);

        let graticule = d3.geo.graticule();


        let defs = svg.append("defs")
        defs.append("path")
            .datum({type: "Sphere"})
            .attr("id", "sphere")
            .attr("d", path);

        svg.append("use")
            .attr("class", "stroke")
            .attr("xlink:href", "#sphere");

        svg.append("use")
            .attr("class", "fill")
            .attr("xlink:href", "#sphere");

        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);

        let g = svg.append("g");
        let countryG = g.append("g");

        // load and display the World
        d3.json("/assets/topojsonData/world-50m.json", function(error, world) {

          var countries = topojson.feature(world, world.objects.countries).features,
              neighbors = topojson.neighbors(world.objects.countries.geometries);

          countryG.selectAll(".country")
              .data(countries)
            .enter().insert("path", ".graticule")
              .attr("class", "country")
              .attr("d", path);

          svg.insert("path", ".graticule")
              .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
              .attr("class", "boundary")
              .attr("d", path);
        });

        let eventG = g.append("g");
        this.get('event').then(function(quake) {
          quake.get('prefOrigin').then(function(prefOrigin) {
console.log("######## event "+prefOrigin);
            eventG.selectAll("circle")
               .data([ prefOrigin ])
               .enter()
               .append("circle")
               .attr("cx", function(d) {
                   return projection([d.get('longitude'), d.get('latitude')])[0];
               })
               .attr("cy", function(d) {
                   return projection([d.get('longitude'), d.get('latitude')])[1];
               })
               .attr("r", 5)
               .style("fill", "red");
          });
        });

        let stationG = g.append("g");
        this.get('station').then(function(station) {
console.log("######## station "+station);
            stationG.selectAll("path")
               .data([ station ])
               .enter()
               .append("path")
                 .attr("transform", function(d) { return "translate(" +
                   projection([d.get('longitude'), d.get('latitude')])[0]+","+
                   projection([d.get('longitude'), d.get('latitude')])[1]+")";
                 })
                 .attr("d", d3.svg.symbol().type("triangle-up"))
               .style("fill", "blue");
        });
    }
});