!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).$$CustomLib={})}(this,(function(t){"use strict";var e=6371008.8,r={centimeters:637100880,centimetres:637100880,degrees:360/(2*Math.PI),feet:20902260.511392,inches:39.37*e,kilometers:6371.0088,kilometres:6371.0088,meters:e,metres:e,miles:3958.761333810546,millimeters:6371008800,millimetres:6371008800,nauticalmiles:e/1852,radians:1,yards:6967335.223679999};function i(t){return t%360*Math.PI/180}function n(t){if(!t)throw new Error("coord is required");if(!Array.isArray(t)){if("Feature"===t.type&&null!==t.geometry&&"Point"===t.geometry.type)return[...t.geometry.coordinates];if("Point"===t.type)return[...t.coordinates]}if(Array.isArray(t)&&t.length>=2&&!Array.isArray(t[0])&&!Array.isArray(t[1]))return[...t];throw new Error("coord must be GeoJSON Point or an Array of numbers")}function s(t,e,s={}){var o=n(t),a=n(e),u=i(a[1]-o[1]),l=i(a[0]-o[0]),c=i(o[1]),f=i(a[1]),m=Math.pow(Math.sin(u/2),2)+Math.pow(Math.sin(l/2),2)*Math.cos(c)*Math.cos(f);return function(t,e="kilometers"){const i=r[e];if(!i)throw new Error(e+" units is invalid");return t*i}(2*Math.atan2(Math.sqrt(m),Math.sqrt(1-m)),s.units)}t.GeoUtils=class GeoUtils{static getRandomInt(t,e){return Math.floor(Math.random()*(e-t+1))+t}static distance(t,e){return s(t,e,{units:"kilometers"})}},t.StringUtils=class StringUtils{static toUpperCase(t){return t.toUpperCase()}}}));
