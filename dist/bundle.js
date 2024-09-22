(()=>{"use strict";var t={719:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Object3d=void 0;const s=i(79);e.Object3d=class{constructor(t,e,i,s){this.trianglesOriginal=t,this.triangles=this.copyTriangles(t),this.position=e,this.rotation=i,this.color=s}copyTriangles(t){let e=[];for(let i=0;i<t.length;i++){let n=[];for(let e=0;e<t[i].length;e++)n.push(new s.Vector3d(t[i][e].x,t[i][e].y,t[i][e].z));e.push(n)}return e}update(){this.triangles=this.copyTriangles(this.trianglesOriginal),this.rotate(),this.translate()}rotate(){let t=this.rotation.y,e=this.rotation.x,i=this.rotation.z;var s=Math.cos(i),n=Math.sin(i),r=Math.cos(t),o=Math.sin(t),l=Math.cos(e),h=Math.sin(e),a=s*r,c=s*o*h-n*l,d=s*o*l+n*h,u=n*r,g=n*o*h+s*l,p=n*o*l-s*h,w=-o,x=r*h,m=r*l;for(let t=0;t<this.triangles.length;t++)for(let e=0;e<this.triangles[t].length;e++){var y=this.triangles[t][e].x,b=this.triangles[t][e].y,f=this.triangles[t][e].z;this.triangles[t][e].x=a*y+c*b+d*f,this.triangles[t][e].y=u*y+g*b+p*f,this.triangles[t][e].z=w*y+x*b+m*f}}translate(){for(let t=0;t<this.triangles.length;t++)for(let e=0;e<this.triangles[t].length;e++)this.triangles[t][e]=this.translate3dPoint(this.triangles[t][e],this.position)}translate3dPoint(t,e){return t.x+=e.x,t.y+=e.y,t.z+=e.z,t}}},943:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Pixel=void 0;class i{constructor(t,e,i){this.r=t,this.g=e,this.b=i,this.indexFirstObjectHit=-1,this.indexFirstTriangleHit=-1,this.allSamplesHitSameObject=!1}copy(){let t=new i(this.r,this.g,this.b);return t.indexFirstObjectHit=this.indexFirstObjectHit,t.indexFirstTriangleHit=this.indexFirstTriangleHit,t.allSamplesHitSameObject=this.allSamplesHitSameObject,t}isEqual(t){return null!==t&&this.r==t.r&&this.g==t.g&&this.b==t.b}calculateLuminance(){return.299*this.r+.587*this.g+.114*this.b}}e.Pixel=i},180:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.RayCastingEngine=void 0;const s=i(943),n=i(79);e.RayCastingEngine=class{constructor(){this.width=1,this.height=1,this.objects=[],this.lights=[],this.pixels=[],this.pixelsLastFrame=[],this.lastWindowWidth=1,this.lastWindowHeight=1,this.lastFrameMs=Date.now()}setSizes(t,e){(this.width!=t||this.height!=e)&&(this.pixels=new Array(t*e).fill(null),this.pixelsLastFrame=new Array(t*e).fill(null)),this.width=t,this.height=e}getEllapsedMsSinceLastFrame(){const t=Date.now(),e=t-this.lastFrameMs;return this.lastFrameMs=t,e}addObject(t){this.objects.push(t)}addLight(t){this.lights.push(t)}update(t,e){this.savePixelsFromLastFrame(),this.pixels.fill(null);for(let t=0;t<this.objects.length;t++)0==t?this.objects[t].rotation.y+=.0023*e:1==t?(this.objects[t].rotation.x+=.0041*e,this.objects[t].rotation.z+=.027*e):(this.objects[t].rotation.z-=.0043*e,this.objects[t].rotation.y+=.0028*e),this.objects[t].update();for(let e=0;e<this.height;e+=2)for(let i=e%4==0?0:1;i<this.width;i+=2){let s=this.coordsToIndex(i,e);this.pixels[s]=this.calculatePixelWithMultisampling(i,e,t.multisampling)}for(let e=0;e<this.height;e+=1)for(let i=0;i<this.width;i+=1){let s=this.coordsToIndex(i,e);null===this.pixels[s]&&(t.optimization&&(this.pixels[s]=this.calculatePixelWithInterpolation(i,e,0)),null===this.pixels[s]&&(this.pixels[s]=this.calculatePixelWithMultisampling(i,e,t.multisampling)))}}savePixelsFromLastFrame(){for(let t=0;t<this.pixels.length;t++){const e=this.pixels[t];if(null===e)break;this.pixelsLastFrame[t]=e.copy()}}coordsToIndex(t,e){return e*this.width+t}getPixels(){return this.pixels}calculatePixelWithInterpolation(t,e,i){if(t==this.width-1||e==this.height-1||0==t||0==e)return null;const n=[0,1,2];n.includes(i)||(console.log("Interpolation can only be calculated with options "+n.join(", ")+"samples. Using left and right as fallback."),i=0);const r=[];0!=i&&2!=i||(r.push([t+1,e]),r.push([t-1,e])),1!=i&&2!=i||(r.push([t,e+1]),r.push([t,e-1]));const o=new s.Pixel(0,0,0),l=[],h=[];for(let t of r){let e=this.coordsToIndex(t[0],t[1]);if(null===this.pixels[e])return null;if(!this.pixels[e].allSamplesHitSameObject)return null;l.push(this.pixels[e].indexFirstObjectHit),h.push(this.pixels[e].indexFirstTriangleHit),o.r+=this.pixels[e].r/r.length,o.g+=this.pixels[e].g/r.length,o.b+=this.pixels[e].b/r.length}const a=l.every(((t,e,i)=>t===i[0])),c=h.every(((t,e,i)=>t===i[0]));return a&&c?o:null}calculatePixelWithMultisampling(t,e,i){let n=[1,2,4,8];if(n.includes(i)||(console.log("Multisampling can only be calculated with "+n.join(", ")+"samples. Using no-multisampling as fallback."),i=1),1==i){const i=this._calculatePixel(t,e);return i.allSamplesHitSameObject=!0,i}let r=[{x:-.25,y:-.25},{x:.25,y:.25}];i>=4&&(r.push({x:-.25,y:.25}),r.push({x:.25,y:-.25})),i>=8&&(r.push({x:-.5,y:.5}),r.push({x:.5,y:-.5}));const o=new s.Pixel(0,0,0),l=[],h=[];for(let i of r){let s=this._calculatePixel(t+i.x,e+i.y);o.r+=s.r/r.length,o.g+=s.g/r.length,o.b+=s.b/r.length,l.push(s.indexFirstObjectHit),h.push(s.indexFirstTriangleHit)}let a=l.every(((t,e,i)=>t===i[0])),c=h.every(((t,e,i)=>t===i[0]));return o.allSamplesHitSameObject=a&&c,o.indexFirstObjectHit=l[0],o.indexFirstTriangleHit=h[0],o}_calculatePixel(t,e){const i=.333*this.width;let r=new n.Vector3d(t-this.width/2,e-this.height/2,i),o=new n.Vector3d(0,0,0),l=this.getIntersectionsWithObjects(o,r.subtract(o));const h=this.getClosestIntersection(l);if(null===h)return new s.Pixel(0,0,0);const a=h.point.scale(1),c=h.triangle;let d=[];this.lights.forEach((t=>{let e=a.subtract(t.position),i=this.getIntersectionsWithObjects(t.position,e),s=this.getClosestIntersection(i);if(null!==s&&s.point.isAtSamePlaceAs(a)){let i=e.getAngleToTriangle(c);d.push({angle:i,intensity:t.intensity})}}));let u=1;d.forEach((t=>{let e=t.angle;e=Math.abs(e),e>90&&(e=90-(e-90)),u+=e/90*t.intensity}));const g=this.objects[h.objectIndex].color,p=new s.Pixel(g.r/(h.distance/50)*u,g.g/(h.distance/50)*u,g.b/(h.distance/50)*u);return p.indexFirstObjectHit=h.objectIndex,p.indexFirstTriangleHit=h.triangleIndex,p}getClosestIntersection(t){let e=1/0,i=null;return t.forEach(((t,s)=>{t.distance<e&&(i=t,e=t.distance)})),i}getIntersectionsWithObjects(t,e){let i=[];return this.objects.forEach(((s,n)=>{s.triangles.forEach(((s,r)=>{let o=e.getIntersectionPointWithTriangle(s,t);null!==o&&i.push({point:o,distance:o.getDistanceFromOtherVector(t),objectIndex:n,triangle:s,triangleIndex:r})}))})),i}}},929:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.RayCastingJs=void 0,e.RayCastingJs=class{constructor(t,e){this.deltaTimeHistory=[],this.renderers={},this.config={height:1,width:1,multisampling:1,optimization:!1,renderer:""},this.engine=t,this.loadConfig(e),this.engine.setSizes(this.config.width,this.config.height),this.lastFrameMilliseconds=Date.now()}loadConfig(t){if(this.config.renderer!=t.renderer)for(const e in this.renderers)e==t.renderer?this.renderers[e].enable():this.renderers[e].disable();this.config=t,this.engine.setSizes(this.config.width,this.config.height),this.onResize()}addRenderer(t,e){this.renderers[e]=t}update(){const t=Date.now(),e=t-this.lastFrameMilliseconds;this.addDeltaTimeToHistory(e),this.engine.update(this.config,e/(1e3/60)),this.lastFrameMilliseconds=t}onResize(){0!=Object.keys(this.renderers).length&&this.renderers[this.config.renderer].onResize(this.config.width)}draw(){this.renderers[this.config.renderer].render(this.engine.getPixels(),this.engine.width)}addDeltaTimeToHistory(t){this.deltaTimeHistory.length>=3&&this.deltaTimeHistory.shift(),this.deltaTimeHistory.push(t)}getFps(){const t=this.deltaTimeHistory.reduce(((t,e)=>t+e),0)/this.deltaTimeHistory.length;return Math.round(1e3/t)}}},768:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AsciiRenderer=void 0,e.AsciiRenderer=class{constructor(t){this.getFontSizeToFitScreen=t=>{const e=document.createElement("div");e.className="howManyChars",e.innerText+="A",document.body.appendChild(e);const i=e.clientHeight;for(let i=0;i<t-1;i++)e.innerText+="A";let s=1;for(let t=0;t<500&&(e.style.fontSize=s+"px",!(e.clientHeight>i));t++)s+=.25;const n=document.querySelector(".howManyChars");return n&&n.remove(),s},this.div=t}enable(){this.div.style.display="block"}disable(){this.div.style.display="none"}render(t,e){let i="";for(let s=0;s<t.length;s++){s>0&&s%e==0&&(i+="\n");const n=t[s].calculateLuminance();i+=this.luminanceToAsciiChar(n/255)}this.div.innerText=i}onResize(t){const e=this.getFontSizeToFitScreen(t);this.div.style.fontSize=e+"px",this.div.style.lineHeight=.6*e+"px"}luminanceToAsciiChar(t){let e=52*t*1.2;return e>51&&(e=51)," `,-_~:;!+ilI?][}{1)(\\/tfjrxnuvczmwqpdbkhao#MW&8%B@$".charAt(e)}}},186:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.DefaultRenderer=void 0,e.DefaultRenderer=class{constructor(t){this.canvas=t,this.context=this.canvas.getContext("2d")}enable(){this.canvas.style.display="block"}disable(){this.canvas.style.display="none"}render(t,e){let i=Math.ceil(this.context.canvas.width/e),s=0,n=0;for(let r=0;r<t.length;r++)this.context.fillStyle=`rgb(${t[r].r},${t[r].g},${t[r].b})`,this.context.fillRect(s*i,n*i,i,i),s+=1,s>=e&&(s=0,n+=1)}onResize(t){this.context.canvas.width=window.innerWidth,this.context.canvas.height=window.innerHeight}}},79:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Vector3d=void 0;class i{constructor(t,e,i){this.x=t,this.y=e,this.z=i}getIntersectionPointWithTriangle(t,e){let i=t[0],s=t[1],n=t[2],r=s.subtract(i),o=n.subtract(i),l=r.crossProduct(o),h=l.dotProduct(this);if(Math.abs(h)<1e-5)return null;let a=-l.dotProduct(i);var c=-(l.dotProduct(e)+a)/h;if(c<0)return null;let d,u=e.add(this.scale(c)),g=s.subtract(i),p=u.subtract(i);if(d=g.crossProduct(p),l.dotProduct(d)<0)return null;let w=n.subtract(s),x=u.subtract(s);if(d=w.crossProduct(x),l.dotProduct(d)<0)return null;let m=i.subtract(n),y=u.subtract(n);return d=m.crossProduct(y),l.dotProduct(d)<0?null:u}getAngleToOtherVector(t){return this.dotProduct(t)/this.getDistanceFromOrigin()/t.getDistanceFromOrigin()*90}crossProduct(t){return new i(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}dotProduct(t){return this.x*t.x+this.y*t.y+this.z*t.z}getDistanceFromOrigin(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}getDistanceFromOtherVector(t){return Math.sqrt(Math.pow(t.x-this.x,2)+Math.pow(t.y-this.y,2)+Math.pow(t.z-this.z,2))}subtract(t){return new i(this.x-t.x,this.y-t.y,this.z-t.z)}add(t){return new i(this.x+t.x,this.y+t.y,this.z+t.z)}scale(t){return new i(this.x*t,this.y*t,this.z*t)}isAtSamePlaceAs(t){return this.getDistanceFromOtherVector(t)<1e-4}getAngleToTriangle(t){const e=t[1].subtract(t[0]),s=t[2].subtract(t[0]),n=new i(e.y*s.z-e.z*s.y,e.z*s.x-e.x*s.z,e.x*s.y-e.y*s.x);return this.getAngleToOtherVector(n)}}e.Vector3d=i},185:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getConfig=e.generateSphere=e.generatePyramid=e.generateCube=void 0;const s=i(719),n=i(79);e.generatePyramid=t=>{const e=[];e.push([new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(0*t,-1*t,0*t)]),e.push([new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(0*t,-1*t,0*t)]),e.push([new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,1*t),new n.Vector3d(0*t,-1*t,0*t)]),e.push([new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(1*t,1*t,1*t),new n.Vector3d(0*t,-1*t,0*t)]),e.push([new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,1*t),new n.Vector3d(-1*t,1*t,1*t)]),e.push([new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,-1*t)]);const i=new n.Vector3d(0,0,0),r=new n.Vector3d(0,0,0),o={r:255*Math.sqrt(Math.random()),g:255*Math.sqrt(Math.random()),b:255*Math.sqrt(Math.random())};return new s.Object3d(e,i,r,o)},e.generateCube=t=>{const e=[];e.push([new n.Vector3d(-1*t,-1*t,-1*t),new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(1*t,-1*t,-1*t)]),e.push([new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(1*t,-1*t,-1*t)]),e.push([new n.Vector3d(-1*t,-1*t,1*t),new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(1*t,-1*t,1*t)]),e.push([new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(1*t,1*t,1*t),new n.Vector3d(1*t,-1*t,1*t)]),e.push([new n.Vector3d(-1*t,-1*t,-1*t),new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(-1*t,1*t,1*t)]),e.push([new n.Vector3d(-1*t,-1*t,-1*t),new n.Vector3d(-1*t,-1*t,1*t),new n.Vector3d(-1*t,1*t,1*t)]),e.push([new n.Vector3d(1*t,-1*t,-1*t),new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,1*t)]),e.push([new n.Vector3d(1*t,-1*t,-1*t),new n.Vector3d(1*t,-1*t,1*t),new n.Vector3d(1*t,1*t,1*t)]),e.push([new n.Vector3d(-1*t,-1*t,-1*t),new n.Vector3d(1*t,-1*t,-1*t),new n.Vector3d(1*t,-1*t,1*t)]),e.push([new n.Vector3d(-1*t,-1*t,-1*t),new n.Vector3d(-1*t,-1*t,1*t),new n.Vector3d(1*t,-1*t,1*t)]),e.push([new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,-1*t),new n.Vector3d(1*t,1*t,1*t)]),e.push([new n.Vector3d(-1*t,1*t,-1*t),new n.Vector3d(-1*t,1*t,1*t),new n.Vector3d(1*t,1*t,1*t)]);const i=new n.Vector3d(0,0,0),r=new n.Vector3d(0,0,0),o={r:255*Math.sqrt(Math.random()),g:255*Math.sqrt(Math.random()),b:255*Math.sqrt(Math.random())};return new s.Object3d(e,i,r,o)},e.generateSphere=(t,e,i)=>{const r=[],o=Math.PI;for(let s=0;s<=i;s++){const l=s*o/i,h=Math.sin(l),a=Math.cos(l);for(let i=0;i<=e;i++){const s=2*i*o/e,l=Math.sin(s),c=Math.cos(s)*h,d=a,u=l*h,g=new n.Vector3d(t*c,t*d,t*u);r.push(g)}}const l=[];for(let t=0;t<i;t++)for(let i=0;i<e;i++){const s=t*(e+1)+i,n=s+e+1;l.push([r[s],r[n],r[s+1]]),l.push([r[n],r[n+1],r[s+1]])}const h=new n.Vector3d(0,0,0),a=new n.Vector3d(0,0,0),c={r:255*Math.sqrt(Math.random()),g:255*Math.sqrt(Math.random()),b:255*Math.sqrt(Math.random())};return new s.Object3d(l,h,a,c)},e.getConfig=()=>{const t=document.getElementById("ascii").checked,e=document.getElementById("optimization").checked,i=parseInt(document.getElementById("multisampling").value),s=window.innerHeight/window.innerWidth,n=parseInt(document.getElementById("resolution").value);return{width:n,height:Math.ceil(n*s),multisampling:i,optimization:e,renderer:t?"ascii":"default"}}}},e={};function i(s){var n=e[s];if(void 0!==n)return n.exports;var r=e[s]={exports:{}};return t[s](r,r.exports,i),r.exports}(()=>{const t=i(180),e=i(79),s=i(185),n=i(929),r=i(186),o=i(768);let l;function h(){l&&(l.loadConfig((0,s.getConfig)()),l.onResize())}window.addEventListener("load",(function(i){!function(){const i=new t.RayCastingEngine,a=(0,s.generatePyramid)(100);a.position=new e.Vector3d(100,-40,200),i.addObject(a);const c=(0,s.generateCube)(150);c.position=new e.Vector3d(-400,-40,500),i.addObject(c);const d=(0,s.generateCube)(80);d.position=new e.Vector3d(-40,-150,300),i.addObject(d);const u=(0,s.generatePyramid)(120);u.position=new e.Vector3d(0,200,400),i.addObject(u),i.addLight({position:new e.Vector3d(205,0,0),intensity:2}),l=new n.RayCastingJs(i,(0,s.getConfig)()),l.addRenderer(new r.DefaultRenderer(document.getElementById("renderhere")),"default"),l.addRenderer(new o.AsciiRenderer(document.getElementById("renderasciihere")),"ascii"),h();const g=()=>{l.update(),l.draw(),document.getElementById("fps").innerText=l.getFps().toString(),window.requestAnimationFrame(g)};window.requestAnimationFrame(g)}()})),window.onresize=()=>{h()},document.querySelectorAll("#sidemenu input, #sidemenu select").forEach((t=>{t.addEventListener("change",(function(t){l.loadConfig((0,s.getConfig)())}))}))})()})();