import{V as R,G as g,L as y,c as m,F as M,k as w,W as E,C as L,S as P,P as C,D as I,A as x,O as T,l as k}from"./OrbitControls-047931be.js";import{G}from"./lil-gui.esm-aba6213a.js";function H(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(!(t.status===204||t.status===205))return t.json()}function _(t,n){return fetch(t,n).then(H)}function l(t,n,a){this.k=t,this.x=n,this.y=a}l.prototype={constructor:l,scale:function(t){return t===1?this:new l(this.k*t,this.x,this.y)},translate:function(t,n){return t===0&n===0?this:new l(this.k,this.x+this.k*t,this.y+this.k*n)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};l.prototype;window.addEventListener("DOMContentLoaded",()=>{const t=new e;t.init(),t.render()},!1);class e{static get CAMERA_PARAM(){return{fovy:45,aspect:window.innerWidth/window.innerHeight,near:.1,far:1e4,x:10,y:0,z:2e3,lookAt:new R(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:16777215,intensity:1,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.2}}constructor(){this.renderer,this.scene,this.camera,this.controls,this.directionalLight,this.ambientLight,this.axesHelper,this.lines=new g,this.lineMaterial=new y({linewidth:1,color:16777215}),this.render=this.render.bind(this),window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}createLineFromCoords(n){let a=new m,i=[];for(let h=0;h<n.length;h++){let r=n[h].y,s=n[h].x,o=e.RENDERER_PARAM.height,c=r*(Math.PI/180),d=-s*(Math.PI/180),A=Math.cos(c)*Math.cos(d)*o,u=Math.sin(c)*o,f=Math.cos(c)*Math.sin(d)*o;i.push(A,u,f)}return a.setAttribute("position",new M(i,3)),new w(a,this.lineMaterial)}addGeoJsonFeaturesToScene(n){for(let a=0;a<n.length;a++){let i=n[a],h=[];for(let r=0;r<i.geometry.coordinates.length;r++)if(i.geometry.type==" Polygon"){let s=[];for(let o=0;o<i.geometry.coordinates[r].length;o++){let c={x:i.geometry.coordinates[r][o][0],y:i.geometry.coordinates[r][o][1]};s.push(c)}s.length>0&&this.lines.add(this.coordinatesreateLineFromCoords(s))}else if(i.geometry.type=="MultiPolygon")for(let s=0;s<i.geometry.coordinates[r].length;s++)for(let o=0;o<i.geometry.coordinates[r][s].length;o++)i.geometry.coordinates[r][s][o][0],i.geometry.coordinates[r][s][o][1];else if(i.geometry.type=="LineString"){let s={x:i.geometry.coordinates[r][0],y:i.geometry.coordinates[r][1]};h.push(s)}i.geometry.type=="LineString"&&h.length>0&&this.lines.add(this.createLineFromCoords(h))}this.scene.add(this.lines)}async init(){this.renderer=new E,this.renderer.setClearColor(new L(e.RENDERER_PARAM.clearColor)),this.renderer.setSize(e.RENDERER_PARAM.width,e.RENDERER_PARAM.height),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new P,this.camera=new C(e.CAMERA_PARAM.fovy,e.CAMERA_PARAM.aspect,e.CAMERA_PARAM.near,e.CAMERA_PARAM.far),this.camera.position.set(e.CAMERA_PARAM.x,e.CAMERA_PARAM.y,e.CAMERA_PARAM.z),this.camera.lookAt(e.CAMERA_PARAM.lookAt),this.directionalLight=new I(e.DIRECTIONAL_LIGHT_PARAM.color,e.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(e.DIRECTIONAL_LIGHT_PARAM.x,e.DIRECTIONAL_LIGHT_PARAM.y,e.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new x(e.AMBIENT_LIGHT_PARAM.color,e.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight),new G,this.controls=new T(this.camera,this.renderer.domElement);const a=1e3;this.axesHelper=new k(a),this.scene.add(this.axesHelper);const i=await _("https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_BN_20M_2020_4326.geojson");this.addGeoJsonFeaturesToScene(i.features)}render(){requestAnimationFrame(this.render),this.controls.update(),this.lines.rotation.y+=.001,this.renderer.render(this.scene,this.camera)}}
