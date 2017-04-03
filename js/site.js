function generatingComponent(vardata, vargeodata){

  var lookUp = genLookup(vargeodata) ;
  var trends = dc.compositeChart('#CompositeChart') ;
  var chCarte = dc.leafletChoroplethChart('#carte') ;
  var cf = crossfilter(vardata);
  var all = cf.groupAll();
  var chCarteDim = cf.dimension(function (d) { return d.country}) ;
  var chCarteGroup = chCarteDim.group().reduceSum( function (d) { return d.phase1+d.phase2+d.phase3to5+d.project_requirement}) ;
  var dateDimension = cf.dimension(function (d) { return d.date});
  var groupPhase1 = dateDimension.group().reduceSum(function (d){ return d.phase1});
  var groupPhase2 = dateDimension.group().reduceSum(function (d){ return d.phase2});
  var groupPhase3to5 = dateDimension.group().reduceSum(function (d){ return d.phase3to5});
  var groupRequirements = dateDimension.group().reduceSum(function (d){ return d.project_requirement});

 trends
      .width(550)
      .height(475)
      .dimension(dateDimension)
      .x(d3.scale.linear().domain([2014, 2016]))
      .elasticY(true)
      .compose([
        dc.lineChart(trends).group(groupPhase1, 'Phase 1'),
        dc.lineChart(trends).group(groupPhase2, 'Phase 2'),
        dc.lineChart(trends).group(groupPhase3to5, 'Phase 3 to 5'),
        dc.lineChart(trends).group(groupRequirements, 'Project Requirement')
        ])
      .brushOn(false)
      //.xAxis();
    
  dc.dataCount('count-info')
    .dimension(cf)
    .group(all);

//define the map

      chCarte.width(450)
             .dimension(chCarteDim)
             .group(chCarteGroup)
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
               return feature.properties['ISO3'];
             }).popup(function (d){
               return lookUp[d];
             })
             .renderPopup(true);
           
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
          lookup[e.properties['ISO3']] = String(e.properties['NAME']);
        });
        return lookup ;
      }
}

var dataCall = $.ajax({
    type: 'GET',
    url: 'data/datas.json',
    dataType: 'json',
});

var geomCall = $.ajax({
    type: 'GET',
    url: 'data/wa.geojson',
    dataType: 'json',
});


$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = geomArgs[0];
    geom.features.forEach(function(e){
        e.properties['ISO3'] = String(e.properties['NAME']);
    });
    generatingComponent(dataArgs[0],geom);
});
