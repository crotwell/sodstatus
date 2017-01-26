import Ember from 'ember';
import d3 from 'npm:d3';
import d3geo from 'npm:d3-geo';
import topojson from "npm:topojson";


export default Ember.Component.extend({

    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
    },
    updateGraph: function() {
        let myThis = this;
        let elementId = this.get('elementId');
        let quake = this.get('quake');
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
        let projection = d3geo.geoEquirectangular()
            .scale(100*styleWidth/internalMapWidth)
            .translate([styleWidth / 2, styleHeight / 2])
            .precision(0.1);

        let path = d3geo.geoPath()
            .projection(projection);

        let graticule = d3geo.geoGraticule();


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

        let quakeG = g.append("g").classed("mapquakes", true);
        let origins = [];
        let updateQuakes = function(quakes) {
          };
        Ember.RSVP.Promise.resolve(this.get('quakes')).then(function(elist) {
               myThis.updateEvents(elist, quakeG, projection);
            });
        

        let stationG = g.append("g").classed("mapstation", true);
        Ember.RSVP.Promise.resolve(this.get('stations')).then(function(stationList) {
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
                 .attr("d", d3.symbolTriangle())
               .style("fill", "blue");
        });
    },
    updateEvents(elist, quakeG, projection) {
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

            quakeG.selectAll("circle")
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
            return Ember.RSVP.Promise.resolve(myEvent);
        } else {
            let subEvent = myEvent.get('quake'); // for ecp
            if (subEvent) {
                return subEvent.then(function(eVal) {
                    return eVal.get('prefOrigin');
                });
            } else {
                subEvent = myEvent.get('prefOrigin');
                if (subEvent) {
                   return subEvent;
                } else {
                   throw Error("unknown type of quake"+myEvent);
                }
            }
        }
    }
});
