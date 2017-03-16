//
// function cadreHarmonise(donnees) {
//
//
//
//       var phaseG = dc.barChart('#phase') ;
//
//       var cf = crossfilter(donnees) ;
//
//       function filtrerDim(dim,code) {
//         return filteredValues = dim.filter(function(d){
//
//         });
//         // var filteredValues = cf.dimension(
//         //   function(e){ return e.rowcacode2}
//         // ).filter(function (d) {
//         //   if (d==code) { return d };
//         // });
//         // return filteredValues ;
//       }
//
//       // function f (code){
//       //   var d = dim.
//       //
//       // }
//
//       var cd = "BFA049001";
//       // var dm = filtrerDim(donnees, cd);
//       var g =cf.dimension(function(d) { return d.rowcacode2});
//       var dim = filtrerDim(g,cd);
//       var grp = dim.group().reduceSum(function(d) { return d.value }) ;
//
//           phaseG.width(400)
//                .height(350)
//                .dimension(dim)
//                .group(grp)
//                .x(d3.scale.linear().domain([1,4]));
//
//       dc.renderAll();
// }
//
//   var dataCall = $.ajax({
//       type: 'GET',
//       url: 'data/dat.json',
//       dataType: 'json',
//   });
//
//   $.when(dataCall).then(function(dataArgs){
//       //var geom = geomArgs[0];
//       console.log('alors') ;
//       // generateringComponent(dataArgs[0],geom);
//       cadreHarmonise(dataArgs[0]);
//   });

//======

d3.json('data/dat.json', function(error, data) {



    var phaseG = dc.barChart('#phase') ;
  //  var trend = dc.rowChart('#trend') ;

    var cf = crossfilter(data) ;

    function f(code){
      dim.filter(code);
      // dim.top(Infinity).forEach(function(d){
      // console.log('apres filtre : '+d.phase +':'+ d.value)});

      var cf2 = crossfilter(dim.top(Infinity));
      return cf2 ;

    }

    // var dimAdm1 = cf.dimension(function(f){return f.rowcacode2});
    // var grpAdm1 = dimAdm1.group();//.reduceSum(function(d){ return d.})

    console.log('taille : '+ cf.size());

    var dim = cf.dimension(function (d) { return d.rowcacode2}) ;

    // dim2.top(Infinity).forEach(function(d){
    // console.log('dim sur le newcf :'+d.phase +':'+ d.value + ' indice :'+d.ind)});

    c = "BFA050003";//"BFA049001";
    var cf2 = f(c);
    var dim2 = cf2.dimension(function(d){ return d.value});
    var grp = dim2.group().reduceSum(function(d) { return d.value }) ;

    dim2.top(Infinity).forEach(function(d){
    console.log('apres filtre : '+d.phase +':'+ d.value)});

    phaseG.width(400)
         .height(350)
         .dimension(dim2)
         .group(grp)
         .x(d3.scale.linear().domain([1,4]));

    dc.renderAll();

});

//====
//
// function generateringComponent(vardata, vargeodata){
//
//   var lookUp = genLookup(vargeodata) ;
//
//
//   var chPhase = dc.rowChart('#phase') ;
//   var chTrend = dc.rowChart('#trend') ;
//   var chCarte = dc.leafletChoroplethChart('#carte') ;
//
//   var cf = crossfilter(vardata);
//   var all = cf.groupAll();
//
//   // graphe des phases
//     var chPhaseDim = cf.dimension(function(d){ return d.country}) ;
//     var chPhaseGroupe = chPhaseDim.group().reduceSum( function (d) { return d.phase1}) ;
//
//   //graphe trend
//
//     var chTrendDim = cf.dimension(function (d) { return d.rowcacode2}) ;
//     var chTrendGroupe = chTrendDim.group().reduceSum( function (d) { return d.phase2}) ;
//
//   // carte
//
//     var chCarteDim = cf.dimension(function (d) { return d.rowcacode2}) ;
//     var chCarteGroupe = chCarteDim.group().reduceSum( function (d) { return d.phase35}) ;
//
//
//     chPhase.width(450)
//               .height(330)
//               .dimension(chPhaseDim)
//               .group(chPhaseGroupe) ;
//
//     chTrend.width(450)
//            .height(330)
//            .dimension(chTrendDim)
//            .group(chTrendGroupe)
//            .data(function (group) {
//              return group.top(5) ;
//            });
//
//   dc.dataCount('count-info')
//     .dimension(cf)
//     .group(all);
//
//
//       chCarte.width(450)
//              .dimension(chCarteDim)
//              .group(chCarteGroupe)
//              .center([0,0])
//              .zoom(0)
//              .geojson(vargeodata)
//              .colors(['#CCCCCC','#03a9f4'])
//              .colorDomain([0,1])
//              .colorAccessor(function (d){
//                if (d>0) {
//                  return 1;
//                } else {
//                  return 0;
//                }
//              })
//              .featureKeyAccessor(function (feature){
//                return feature.properties['Rowcacode2'];
//              }).popup(function (d){
//                return lookUp[d];
//              })
//              .renderPopup(true);
//
//       dc.renderAll();
//
//       var map = chCarte.map();
//
//       zoomToGeom(vargeodata);
//
//       function zoomToGeom(geodata){
//         var bounds = d3.geo.bounds(geodata) ;
//         map.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
//       }
//
//       function genLookup(geojson) {
//         var lookup = {} ;
//         geojson.features.forEach(function (e) {
//           lookup[e.properties['Rowcacode2']] = String(e.properties['adm2']);
//         });
//         return lookup ;
//       }
//
//
// }
//
// var dataCall = $.ajax({
//     type: 'GET',
//     url: 'data/ch.json',
//     dataType: 'json',
// });
//
// var geomCall = $.ajax({
//     type: 'GET',
//     url: 'data/sahel.geojson',
//     dataType: 'json',
// });
//
//
// $.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
//     var geom = geomArgs[0];
//     geom.features.forEach(function(e){
//         e.properties['Rowcacode2'] = String(e.properties['Rowcacode2']);
//     });
//     generateringComponent(dataArgs[0],geom);
// });
