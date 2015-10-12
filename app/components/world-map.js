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
        Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
    },
    updateGraph: function() {
        let myThis = this;
        let elementId = this.get('elementId');
        let quake = this.get('event');
        let station = this.get('station');
        let topElement = d3.select('#'+elementId);
        let svgDiv = topElement.append("div");
        svgDiv.classed('map', true);
        let styleWidth = parseInt(svgDiv.style("width"));
        if (styleWidth < 100) { styleWidth = 100; }
        let styleHeight = parseInt(svgDiv.style("height"));
        if (styleHeight < 100) { styleHeight = 100; }
        let svg = svgDiv.append("svg")
            .attr("width", styleWidth)
            .attr("height", styleHeight);

// equirectangular is 640x360
        let internalMapWidth = 640;
        let internalMapHeight = 360;
        let projection = d3.geo.equirectangular()
            .scale(100*styleWidth/internalMapWidth)
            .translate([styleWidth / 2, styleHeight / 2])
            .precision(0.1);

        let path = d3.geo.path()
            .projection(projection);

        let graticule = d3.geo.graticule();


        let defs = svg.append("defs");
        defs.append("g").append("path")
            .datum({type: "Sphere"})
            .attr("id", "sphere")
            .attr("d", path);

        let g = svg.append("g");

        g.append("g")
            .classed("graticule", true)
            .append("path")
            .datum(graticule)
            .attr("d", path);

        let countryG = g.append("g").classed("country", true);

        // load and display the World
        d3.json("/assets/topojsonData/world-50m.json", function(error, world) {

          var countries = topojson.feature(world, world.objects.countries).features,
              neighbors = topojson.neighbors(world.objects.countries.geometries);

          countryG.selectAll(".country")
              .data(countries)
            .enter().insert("path", ".graticule")
              .attr("class", "country")
              .attr("d", path);

          g.insert("path", ".graticule")
              .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
              .attr("class", "boundary")
              .attr("d", path);
        });

        let eventG = g.append("g").classed("mapevents", true);
        let origins = [];
        let updateQuakes = function(quakes) {
          };
        Ember.RSVP.Promise.resolve(this.get('events')).then(function(elist) {
               myThis.updateEvents(elist, eventG, projection);
            });
        

        let stationG = g.append("g").classed("mapstation", true);
        Promise.resolve(this.get('stations')).then(function(stationList) {
            if( ! stationList) { return;}
            if ( ! (Array.isArray(stationList) || stationList.length)) {
                      stationList = [ stationList ];
            }
            stationG.selectAll("path")
               .data( stationList )
               .enter()
               .append("path")
                 .attr("transform", function(d) { return "translate(" +
                   projection([d.get('longitude'), d.get('latitude')])[0]+","+
                   projection([d.get('longitude'), d.get('latitude')])[1]+")";
                 })
                 .attr("d", d3.svg.symbol().type("triangle-up"))
               .style("fill", "blue");
        });
    },
    updateEvents(elist, eventG, projection) {
        let myThis = this;
        if ( ! elist) {return;}
        if ( ! (Array.isArray(elist) || elist.length)) {
                  elist = [ elist ];
        }
        let myElist = [];
        myElist = elist.map(function(item, index, enumerable) {
            return myThis.cleanEvent(item);
        });

        Ember.RSVP.all(myElist).then(function(locations) {

            eventG.selectAll("circle")
               .data( locations )
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
    },
    cleanEvent(myEvent) {
        if ('latitude' in myEvent && 'longitude' in myEvent) {
            // good to go
            return Promise.resolve(myEvent);
        } else {
            let subEvent = myEvent.get('event'); // for ecp
            if (subEvent) {
                return subEvent.then(function(eVal) {
                    return eVal.get('prefOrigin');
                });
            } else {
                subEvent = myEvent.get('prefOrigin');
                if (subEvent) {
                   return subEvent;
                } else {
                   throw Error("unknown type of event"+myEvent);
                }
            }
        }
    }
});
