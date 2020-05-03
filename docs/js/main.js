!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var r,o,i=(r=n(1))&&r.__esModule?r:{default:r};window.onload=function(){o=new i.default,u(),l(),document.getElementById("seed").addEventListener("input",()=>{l()}),document.getElementById("floorW").addEventListener("input",()=>{u(),l()}),document.getElementById("floorH").addEventListener("input",()=>{l()})};const l=()=>{const e=performance.now();let t=parseInt(document.getElementById("seed").value),n=parseInt(document.getElementById("floorW").value),r=parseInt(document.getElementById("floorH").value);document.getElementById("map").innerHTML=o.generate(t,n,r);const i=performance.now();console.log(i-e)},u=()=>{let e=parseInt(document.getElementById("floorW").value);e=Math.max(e,12);const t=document.getElementById("mapContainer"),n=Math.min(t.clientWidth,document.documentElement.clientWidth)/(2.37*e);t.style.fontSize=n+"px"}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=(r=n(2))&&r.__esModule?r:{default:r};t.default=class{constructor(){}generate(e,t=17,n=8){if(void 0===e||"number"!=typeof e)return console.log("seed値を整数値で指定してください"),"";this.xor=new o.default(e),this.dungeon=Array.from(new Array(n),()=>new Array(t).fill(-1));for(let e=0;e<n;e++)for(let n=0;n<t;n++){let t=!1;do{t=this.startWall(n,e)}while(t)}return this.printDungeon(this.dungeon)}startWall(e,t){if(-1!==this.dungeon[t][e])return!1;let n=[],r=[];n.push(e),r.push(t),this.dungeon[t][e]=this.xor.rnd()%4;let o=this.getNextPosition(e,t);return this.createWall(o,n,r)}getNextPosition(e,t){switch(this.dungeon[t][e]){case 0:return{x:e,y:t-1};case 1:return{x:e+1,y:t};case 2:return{x:e,y:t+1};case 3:return{x:e-1,y:t}}}createWall(e,t,n){if(t.push(e.x),n.push(e.y),this.checkOpenLoop(e.x,e.y,t,n))return this.clearRoute(t,n),!0;if(e.x<0||e.x>=this.dungeon[0].length)return!1;if(e.y<0||e.y>=this.dungeon.length)return!1;if(-1!==this.dungeon[e.y][e.x])return!1;const r=()=>{const r=this.xor.rnd()%3,o=t.length-2;let i=(r+this.dungeon[n[o]][t[o]]-1)%4;return-1===i&&(i=3),this.dungeon[e.y][e.x]=i,this.getNextPosition(e.x,e.y)};let o,i=!1;do{o=r(),i=this.checkCloseLoop(o,t,n)}while(i);return this.createWall(o,t,n)}checkCloseLoop(e,t,n){const r=t.length;for(let o=0;o<r;o++)if(t[o]===e.x&&n[o]===e.y)return!0;return!1}checkOpenLoop(e,t,n,r){let o,i,l,u=!1;const s=n.length;for(let a=0;a<s;a++)n[a]===e-1&&r[a]===t&&(o=!0),n[a]===e+1&&r[a]===t&&(i=!0),n[a]===e&&r[a]===t-1&&(l=!0),n[a]===e&&r[a]===t+1&&(u=!0);return o&&i&&l&&u}clearRoute(e,t){const n=e.length;for(let r=0;r<n;r++)this.dungeon[t[r]][e[r]]=-1}printDungeon(e,t="<br>",n="&emsp;"){let r="";this.mapH=2*e.length+1+2,this.mapW=2*e[0].length+1+2;for(let o=0;o<this.mapH;o++)r+=this.printDungeonLine(e,o,t,n);return r}printDungeonLine(e,t,n,r){return 0===t||t===this.mapH-1?this.printDungeonLineOutWall(n):t%2==0?this.printDungeonLinePillarAndWall(e,t,n,r):this.printDungeonLineFloorAndWall(e,t,n,r)}printDungeonLineOutWall(e){let t="■️".repeat(this.mapW);return t+=e,t}printDungeonLineFloorAndWall(e,t,n,r){let o="";const i=(t-1)/2;for(let t=0;t<this.mapW;t++){if(0===t||t===this.mapW-1){o+="■";continue}if(t%2==1){o+=r;continue}let n=t/2-1;i-1>=0&&2===e[i-1][n]?o+="│":i<e.length&&0===e[i][n]?o+="│":o+=r}return o+=n,o}printDungeonLinePillarAndWall(e,t,n,r){let o="";const i=t/2-1;for(let t=0;t<this.mapW;t++){if(0===t||t===this.mapW-1){o+="■";continue}let n=(t-1)/2;t%2!=0?n-1>=0&&1===e[i][n-1]||n<e[0].length&&3===e[i][n]?o+="─":o+=r:o+="●"}return o+=n,o}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default=class{constructor(e){this.seed(e)}seed(e){this.x=123456789,this.y=362436069,this.z=521288629,this.w=88675123,"number"==typeof e&&(this.w=e)}rnd(){const e=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=this.w^this.w>>19^e^e>>8}}}]);