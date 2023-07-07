import{V as c,G as g,L as A,e as y,b as P,f as u,F as E,g as R,W as L,C as I,S as T,P as C,D as p,A as x,h as N,i as b,a as D,O as G,j as _,d as B,Q as H}from"./OrbitControls-e22d038c.js";import{G as S,E as k,R as v,U as F}from"./lil-gui.esm-6291fccb.js";function V(t){if(!t.ok)throw new Error(t.status+" "+t.statusText);if(!(t.status===204||t.status===205))return t.json()}function z(t,r){return fetch(t,r).then(V)}function d(t,r,o){this.k=t,this.x=r,this.y=o}d.prototype={constructor:d,scale:function(t){return t===1?this:new d(this.k*t,this.x,this.y)},translate:function(t,r){return t===0&r===0?this:new d(this.k,this.x+this.k*t,this.y+this.k*r)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};d.prototype;window.addEventListener("DOMContentLoaded",()=>{const t=new e;t.load().then(()=>{t.init(),t.render()})},!1);class e{static get CAMERA_PARAM(){return{fovy:45,aspect:window.innerWidth/window.innerHeight,near:.1,far:1e4,x:10,y:0,z:2500,lookAt:new c(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:16777215,intensity:1,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.2}}static get MATERIAL_PARAM(){return{color:251686655}}static get AIRPLANE_DISTANCE(){return 1e3}static get TRAIL_MATERIAL_PARAM(){return{color:28415,linewidth:5}}static get TRAIL_LENGTH(){return 50}constructor(){this.renderer,this.scene,this.camera,this.controls,this.directionalLight,this.ambientLight,this.axesHelper,this.lines=new g,this.lineMaterial=new A({linewidth:1,color:16777215}),this.countryBoundaries,this.coneGeometry,this.airplane,this.airplaneMaterial,this.airplaneDirection,this.trail,this.trailMaterial,this.trailGeometry,this.trailVertices,this.composer,this.renderPass,this.unrealBloomPass,this.finalComposer,this.params={bloomStrength:1.5,bloomThreshold:0,bloomRadius:.85},this.bloomLayer=new y,this.clock=new P,this.render=this.render.bind(this),window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}createLineFromCoords(r){let o=new u,s=[];for(let h=0;h<r.length;h++){let i=r[h].y,n=r[h].x,a=e.RENDERER_PARAM.height,l=i*(Math.PI/180),m=-n*(Math.PI/180),M=Math.cos(l)*Math.cos(m)*a,f=Math.sin(l)*a,w=Math.cos(l)*Math.sin(m)*a;s.push(M,f,w)}return o.setAttribute("position",new E(s,3)),new R(o,this.lineMaterial)}addGeoJsonFeaturesToScene(r){for(let o=0;o<r.length;o++){let s=r[o],h=[];for(let i=0;i<s.geometry.coordinates.length;i++)if(s.geometry.type==" Polygon"){let n=[];for(let a=0;a<s.geometry.coordinates[i].length;a++){let l={x:s.geometry.coordinates[i][a][0],y:s.geometry.coordinates[i][a][1]};n.push(l)}n.length>0&&this.lines.add(this.coordinatesreateLineFromCoords(n))}else if(s.geometry.type=="MultiPolygon")for(let n=0;n<s.geometry.coordinates[i].length;n++)for(let a=0;a<s.geometry.coordinates[i][n].length;a++)s.geometry.coordinates[i][n][a][0],s.geometry.coordinates[i][n][a][1];else if(s.geometry.type=="LineString"){let n={x:s.geometry.coordinates[i][0],y:s.geometry.coordinates[i][1]};h.push(n)}s.geometry.type=="LineString"&&h.length>0&&this.lines.add(this.createLineFromCoords(h))}this.scene.add(this.lines)}async load(){return this.countryBoundaries=await z("https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_BN_20M_2020_4326.geojson")}init(){this.renderer=new L({antialias:!0}),this.renderer.setClearColor(new I(e.RENDERER_PARAM.clearColor)),this.renderer.setSize(e.RENDERER_PARAM.width,e.RENDERER_PARAM.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new T,this.camera=new C(e.CAMERA_PARAM.fovy,e.CAMERA_PARAM.aspect,e.CAMERA_PARAM.near,e.CAMERA_PARAM.far),this.camera.position.set(e.CAMERA_PARAM.x,e.CAMERA_PARAM.y,e.CAMERA_PARAM.z),this.camera.lookAt(e.CAMERA_PARAM.lookAt),this.directionalLight=new p(e.DIRECTIONAL_LIGHT_PARAM.color,e.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(e.DIRECTIONAL_LIGHT_PARAM.x,e.DIRECTIONAL_LIGHT_PARAM.y,e.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new x(e.AMBIENT_LIGHT_PARAM.color,e.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight),this.coneGeometry=new N(10,30,32),this.airplaneMaterial=new b(e.MATERIAL_PARAM),this.airplane=new D(this.coneGeometry,this.airplaneMaterial),this.scene.add(this.airplane),this.airplane.scale.setScalar(3),this.airplane.position.set(e.AIRPLANE_DISTANCE,0,0),this.airplaneDirection=new c(0,1,0).normalize(),this.trailVertices=[],this.trailMaterial=new A(e.TRAIL_MATERIAL_PARAM),this.trailGeometry=new u().setFromPoints(this.trailVertices),this.trail=new R(this.trailGeometry,this.trailMaterial),this.scene.add(this.trail);const o=new S;o.addColor(e.TRAIL_MATERIAL_PARAM,"color").onChange(i=>{this.airplaneMaterial.color.set(i),this.trailMaterial.color.set(i)}),o.add(e.TRAIL_MATERIAL_PARAM,"linewidth",1,10).onChange(i=>{this.trailMaterial.linewidth=Number(i)});const s=o.addFolder("Bloom");s.add(this.params,"bloomStrength",0,3).onChange(i=>{this.unrealBloomPass.strength=Number(i)}),s.add(this.params,"bloomThreshold",0,1).onChange(i=>{this.unrealBloomPass.threshold=Number(i)}),this.controls=new G(this.camera,this.renderer.domElement);const h=1e3;this.axesHelper=new _(h),this.axesHelper.visible=!1,this.scene.add(this.axesHelper),o.add(this.axesHelper,"visible").name("Axes Helper"),this.addGeoJsonFeaturesToScene(this.countryBoundaries.features),this.composer=new k(this.renderer),this.renderPass=new v(this.scene,this.camera),this.composer.addPass(this.renderPass),this.unrealBloomPass=new F(new B(window.innerWidth,window.innerHeight),1.5,.4,.85),this.unrealBloomPass.threshold=this.params.bloomThreshold,this.unrealBloomPass.strength=this.params.bloomStrength,this.unrealBloomPass.radius=this.params.bloomRadius,this.composer.addPass(this.unrealBloomPass),this.unrealBloomPass.renderToScreen=!1}render(){requestAnimationFrame(this.render),this.controls.update(),this.lines.rotation.y+=.001;const r=this.clock.getElapsedTime(),o=new c(Math.cos(r)*e.AIRPLANE_DISTANCE,Math.cos(r)*e.AIRPLANE_DISTANCE,Math.sin(r)*e.AIRPLANE_DISTANCE),s=this.airplaneDirection.clone(),h=new c().subVectors(o,this.airplane.position);h.normalize(),this.airplaneDirection.add(h.multiplyScalar(1)),this.airplaneDirection.normalize();const i=this.airplaneDirection.clone();this.airplane.position.add(i.multiplyScalar(15));const n=new c().crossVectors(s,this.airplaneDirection);n.normalize();const a=s.dot(this.airplaneDirection),l=Math.acos(a),m=new H().setFromAxisAngle(n,l);this.airplane.quaternion.premultiply(m),this.trailVertices.push(this.airplane.position.clone()),this.trailVertices.length>e.TRAIL_LENGTH&&this.trailVertices.shift(),this.trailGeometry.setFromPoints(this.trailVertices),this.composer.render()}}
