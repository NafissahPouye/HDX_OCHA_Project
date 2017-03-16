

function generateringComponent(vardata, vargeodata){

  var lookUp = genLookup(vargeodata) ;


  var chPhase = dc.rowChart('#phase') ;
  var chTrend = dc.rowChart('#trend') ;
  var chCarte = dc.leafletChoroplethChart('#carte') ;

  var cf = crossfilter(vardata);
  var all = cf.groupAll();

  // graphe des phases
    var chPhaseDim = cf.dimension(function(d){ return d.country}) ;
    var chPhaseGroupe = chPhaseDim.group().reduceSum( function (d) { return d.phase1}) ;

  //graphe trend

    var chTrendDim = cf.dimension(function (d) { return d.rowcacode2}) ;
    var chTrendGroupe = chTrendDim.group().reduceSum( function (d) { return d.phase2}) ;

  // carte

    var chCarteDim = cf.dimension(function (d) { return d.rowcacode2}) ;
    var chCarteGroupe = chCarteDim.group().reduceSum( function (d) { return d.phase1}) ;

    // function graphePerLocation(code) {
    //   chCarteDim.filter(code);
    //
    //   var ndx = crossfilter(chCarteDim.top(Infinity));
    //
    //   var dimLoc = ndx.dimension(function(d){return  d.phase1});
    //   var groupeLoc = dimLoc.group().reduceSum(function(d) { return d.value});
    //
    //   chTrend.dimension(dimLoc)
    //         .group(groupeLoc);
    //   return null;
    // }

    chPhase.width(450)
              .height(230)
              .dimension(chPhaseDim)
              .group(chPhaseGroupe) ;

    chTrend.width(450)
           .height(230)
           .dimension(chTrendDim)
           .group(chTrendGroupe)
           .data(function (group) {
              return group.top(5) ;
            });
           //.x(d3.scale.linear().domain([1,9]));

  dc.dataCount('count-info')
    .dimension(cf)
    .group(all);


      chCarte.width(450)
             .dimension(chCarteDim)
             .group(chCarteGroupe)
             .center([0,0])
             .zoom(0)
             .geojson(vargeodata)
             .colors(['#CCCCCC','#03a9f4'])
             .colorDomain([0,1])
             .colorAccessor(function (d){
               if (d>0) {
                 return 1;
               } else {
                 return 0;
               }
             })
             .featureKeyAccessor(function (feature){
               return feature.properties['Rowcacode2'];
             }).popup(function (d){
               return lookUp[d];
             })
             .renderPopup(true);
            //  .on("filtered", function (chart) {
            //    dc.events.trigger(function () {
            //      if(chart.filter()) {
            //        console.log('valeur filtree : '+chart.filter());
            //        var cdm = chart.filter();
            //        graphePerLocation(cdm);
            //      }
            //    });
            //  });

      dc.renderAll();

      var map = chCarte.map();

      zoomToGeom(vargeodata);

      function zoomToGeom(geodata){
        var bounds = d3.geo.bounds(geodata) ;
        map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
      }

      function genLookup(geojson) {
        var lookup = {} ;
        geojson.features.forEach(function (e) {
          lookup[e.properties['Rowcacode2']] = String(e.properties['adm2']);
        });
        return lookup ;
      }


}

var dataCall = $.ajax({
    type: 'GET',
    url: 'data/ch.json',
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
    url: 'data/sahel.geojson',
    dataType: 'json',
});


$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties['Rowcacode2'] = String(e.properties['Rowcacode2']);
    });
    generateringComponent(dataArgs[0],geom);
});
