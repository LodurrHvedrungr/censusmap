!function(e){function t(t){for(var n,i,l=t[0],s=t[1],c=t[2],u=0,d=[];u<l.length;u++)i=l[u],r[i]&&d.push(r[i][0]),r[i]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);for(p&&p(t);d.length;)d.shift()();return a.push.apply(a,c||[]),o()}function o(){for(var e,t=0;t<a.length;t++){for(var o=a[t],n=!0,l=1;l<o.length;l++){var s=o[l];0!==r[s]&&(n=!1)}n&&(a.splice(t--,1),e=i(i.s=o[0]))}return e}var n={},r={0:0},a=[];function i(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=n,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(o,n,function(t){return e[t]}.bind(null,n));return o},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var p=s;a.push([59,1]),o()}({104:function(e,t,o){},59:function(e,t,o){"use strict";o.r(t);o(60),o(69),o(70),o(71),o(49),o(80),o(82),o(83),o(85),o(100),o(102),o(104);var n,r,a=o(39),i=o.n(a),l=o(58),s=o.n(l),c=new i.a.Map({container:"map",accessToken:"pk.eyJ1IjoiZXVnZXlvbmUiLCJhIjoiY2p5c2kzNWd4MGtjeDNkbnUzcHNuZG5nZiJ9.QascU0AxqjJdeRehD88fSA",style:"mapbox://styles/mapbox/light-v10",zoom:0,maxZoom:8,center:[10.4660513,50.6702632],maxBounds:[[-.765531,46.631365],[20.88893,55.352543]]}),p=document.querySelector(".popup"),u=document.querySelector("#map"),d=document.querySelector("#search"),f=document.querySelector(".clear"),v=document.querySelector(".zoom__in"),y=document.querySelector(".zoom__out"),m=null,h={};function b(e){n&&n.remove(),d.value="",d.setAttribute("placeholder",e);var t=s()(h[e]);c.setZoom(8),c.panTo(t.coordinates);var o=document.createElement("div");o.className="marker",n=new i.a.Marker(o).setLngLat({lat:t.coordinates[1]+.05,lng:t.coordinates[0]}).addTo(c)}u.addEventListener("mousedown",function(){u.style.cursor="grabbing"}),u.addEventListener("mouseup",function(){u.style.cursor="initial"}),f.addEventListener("click",function(){d.value="",d.setAttribute("placeholder","Suchen..."),n.remove()}),v.addEventListener("click",function(){var e=c.getZoom();c.zoomIn(),e>7&&v.classList.add("disabled")}),y.addEventListener("click",function(){var e=c.getZoom();c.zoomOut(),8===e&&v.classList.remove("disabled")}),c.on("load",function(){c.resize(),c.setPaintProperty("country-label","text-color","#000000"),c.setLayoutProperty("country-label","text-field",["get","name_de"]),c.setPaintProperty("state-label","text-color","#000000"),c.setLayoutProperty("state-label","text-field",["get","name_de"]),c.setPaintProperty("settlement-label","text-color","#000000"),c.setLayoutProperty("settlement-label","text-field",["get","name_de"]),c.setPaintProperty("settlement-subdivision-label","text-color","#000000"),c.setLayoutProperty("settlement-subdivision-label","text-field",["get","name_de"]);for(var e=c.getStyle().layers,t=0;t<e.length;t++)if("symbol"===e[t].type){r=e[t].id;break}fetch("https://lodurrhvedrungr.github.io/censusmap/data.json").then(function(e){return e.json()}).then(function(e){c.addSource("population",{type:"geojson",data:e}),c.addLayer({id:"state-population",source:"population",type:"fill",paint:{"fill-color":["interpolate",["linear"],["get","JVA"],-5,"#0f7785",-.1,"#8fd7d2",0,"#ffffff",.1,"#eb9878",5,"#96210e"],"fill-opacity":.6,"fill-outline-color":["case",["boolean",["feature-state","hover"],!1],"#18758D","transparent"]}},r),c.addLayer({id:"state-population-hover",source:"population",type:"line",paint:{"line-width":2,"line-color":["case",["boolean",["feature-state","hover"],!1],"#18758D","transparent"]}}),c.addLayer({id:"state-population-borders",source:"population",type:"line",paint:{"line-width":1,"line-color":["interpolate",["linear"],["get","JVA"],-.1,"#70cbc5",0,"#ffffff",.1,"#eba990"]}},"state-population"),h=e.features.reduce(function(e,t){return e["".concat(t.properties.GEN,", ").concat(t.properties.BEZ)]=t.geometry,e},{}),function(e,t){var o;function n(e){if(!e)return!1;!function(e){for(var t=0;t<e.length;t++)e[t].classList.remove("autocomplete-active")}(e),o>=e.length&&(o=0),o<0&&(o=e.length-1),e[o].classList.add("autocomplete-active")}function r(t){for(var o=document.getElementsByClassName("autocomplete-items"),n=0;n<o.length;n++)t!=o[n]&&t!=e&&o[n].parentNode.removeChild(o[n])}e.addEventListener("input",function(n){var a,i,l,s=this.value;if(r(),!s)return!1;for(o=-1,(a=document.createElement("DIV")).setAttribute("id",this.id+"autocomplete-list"),a.setAttribute("class","autocomplete-items"),this.parentNode.appendChild(a),l=0;l<t.length;l++)if(t[l].substr(0,s.length).toUpperCase()==s.toUpperCase()){if(5===a.children.length)break;(i=document.createElement("DIV")).innerHTML="<strong>"+t[l].substr(0,s.length)+"</strong>",i.innerHTML+=t[l].substr(s.length),i.innerHTML+="<input type='hidden' value='"+t[l]+"'>",i.addEventListener("click",function(t){e.value=this.getElementsByTagName("input")[0].value,b(e.value),r()}),a.appendChild(i)}}),e.addEventListener("keydown",function(e){var t=document.getElementById(this.id+"autocomplete-list");t&&(t=t.getElementsByTagName("div")),40==e.keyCode?(o++,n(t)):38==e.keyCode?(o--,n(t)):13==e.keyCode&&(e.preventDefault(),o>-1&&t&&t[o].click())}),document.addEventListener("click",function(e){r(e.target)})}(d,Object.keys(h))}),c.on("mousemove","state-population",function(e){var t,o=c.queryRenderedFeatures(e.point);if(o.length>0){var n=!0,r=!1,a=void 0;try{for(var i,l=o[Symbol.iterator]();!(n=(i=l.next()).done);n=!0){var s=i.value;if("state-population"===s.layer.id){t=s;break}}}catch(e){r=!0,a=e}finally{try{n||null==l.return||l.return()}finally{if(r)throw a}}if(!t)return;m&&c.setFeatureState({source:"population",id:m},{hover:!1}),m=t.id,c.setFeatureState({source:"population",id:m},{hover:!0});var d=e.originalEvent.clientX,f=e.originalEvent.clientY,v=f>u.clientHeight/2,y=d>u.clientWidth/2;p.innerHTML=function(e){var t;switch(Math.sign(e.properties.JVA)){case 1:t='class="green">+';break;case-1:t='class="red">';break;case 0:t='class="white">'}return'\n        <div class="popup__arrow"></div>\n        <h2 class="popup__title">'.concat(e.properties.GEN,", ").concat(e.properties.BEZ,"</h2>\n        ").concat(e.properties.EWZ?'<div class="popup__wrap"><p class="popup__info">Einwohner 2017:<br/><strong class="popup__info__people">'.concat(e.properties.EWZ,'</strong></p><p class="popup__info">jährliche Veränderung seit 2011:<p ').concat(e.properties.JVA?"".concat(t).concat(e.properties.JVA,"%"):'class="black">±0%',"</p></p></div>"):'<div class="popup__wrap"><p>Keine Daten vorhanden</p></div>',"\n    ")}(t),p.style.display="flex";var h=document.querySelector(".popup__arrow");v&&!y?(p.style.left="".concat(d-30,"px"),p.style.top="".concat(f-p.offsetHeight-30,"px")):v&&y?(p.style.left="".concat(d-p.offsetWidth+30,"px"),p.style.top="".concat(f-p.offsetHeight-30,"px"),h.classList.add("bottom-right")):v||y?(p.style.left="".concat(d-p.offsetWidth+30,"px"),p.style.top="".concat(f+30,"px"),h.classList.add("top-right")):(p.style.left="".concat(d-30,"px"),p.style.top="".concat(f+30,"px"),h.classList.add("top-left"))}}),c.on("mouseleave","state-population",function(){m&&(p.style.display="none",c.setFeatureState({source:"population",id:m},{hover:!1})),m=null}),c.on("zoomend","state-population",function(){var e=c.getZoom();e<8&&v.classList.remove("disabled"),8===e&&v.classList.add("disabled")})})}});
//# sourceMappingURL=app.f5498c47.js.map