import{V as w,W as f,C as L,S as m,P as E,D as P,A as y,p as u,f as I,q as g,r as C,i as c,s as G,a as d,t as T,j as p}from"./three.module-04eef51a.js";import{G as x}from"./lil-gui.esm-aba6213a.js";window.addEventListener("DOMContentLoaded",()=>{const a=new e;a.load().then(()=>{a.init(),a.render()})},!1);class e{static get CAMERA_PARAM(){return{fovy:45,aspect:window.innerWidth/window.innerHeight,near:.1,far:20,x:1,y:4,z:8,lookAt:new w(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:16777215,intensity:1,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.2}}static get MATERIAL_PARAM(){return{color:16777215}}constructor(){this.renderer,this.scene,this.camera,this.controls,this.directionalLight,this.ambientLight,this.axesHelper,this.line,this.lineGeometry,this.lineMaterial,this.linePoints=[],this.points,this.pointsGeometry,this.pointsMaterial,this.planeGeometry,this.planeMaterial,this.render=this.render.bind(this),this.apiKey="0296d9cfab50bb2bb831354611c78819",this.movieList,window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}async load(){this.movieList={"1960s":[],"1970s":[],"1980s":[],"1990s":[],"2000s":[],"2010s":[],"2020s":[]};for(let n=0;n<5;n++){const o=`https://api.themoviedb.org/3/search/movie?query=spider%20man&include_adult=false&language=en-US&page=${n+1}&region=US&api_key=${this.apiKey}`;(await(await fetch(o)).json()).results.filter(i=>i.original_language==="en"&&i.release_date!=="").forEach(i=>{const t=i.release_date.slice(0,4);t>=1960&&t<1970?this.movieList["1960s"].push(i):t>=1970&&t<1980?this.movieList["1970s"].push(i):t>=1980&&t<1990?this.movieList["1980s"].push(i):t>=1990&&t<2e3?this.movieList["1990s"].push(i):t>=2e3&&t<2010?this.movieList["2000s"].push(i):t>=2010&&t<2020?this.movieList["2010s"].push(i):t>=2020&&t<2030&&this.movieList["2020s"].push(i)})}}init(){this.renderer=new f({antialias:!0}),this.renderer.setClearColor(new L(e.RENDERER_PARAM.clearColor)),this.renderer.setSize(e.RENDERER_PARAM.width,e.RENDERER_PARAM.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new m,this.camera=new E(e.CAMERA_PARAM.fovy,e.CAMERA_PARAM.aspect,e.CAMERA_PARAM.near,e.CAMERA_PARAM.far),this.camera.position.set(e.CAMERA_PARAM.x,e.CAMERA_PARAM.y,e.CAMERA_PARAM.z),this.camera.lookAt(e.CAMERA_PARAM.lookAt),this.directionalLight=new P(e.DIRECTIONAL_LIGHT_PARAM.color,e.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(e.DIRECTIONAL_LIGHT_PARAM.x,e.DIRECTIONAL_LIGHT_PARAM.y,e.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new y(e.AMBIENT_LIGHT_PARAM.color,e.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight),this.pointsMaterial=new u(e.MATERIAL_PARAM),this.pointsGeometry=new I;const o=3,l=2,h=[];for(let s=0;s<o;s++){const R=s*l;h.push(-3,0,R)}const A=3,i=new g(new Float32Array(h),A);this.pointsGeometry.setAttribute("position",i),this.points=new C(this.pointsGeometry,this.pointsMaterial),this.scene.add(this.points),this.lineMaterial=new c(e.MATERIAL_PARAM),this.lineGeometry=new G(.02,.02,6,32),this.line=new d(this.lineGeometry,this.lineMaterial),this.scene.add(this.line),this.line.rotation.x=Math.PI/2,this.line.rotation.y=-.3,this.line.position.x=-3,this.line.position.z=3,this.planeMaterial=new c(e.MATERIAL_PARAM),this.planeGeometry=new T(1.5,2);const t=10;for(let s=0;s<t;s++){const r=new d(this.planeGeometry,this.planeMaterial);r.position.set(s*.4-2,0,0),r.rotation.y=-Math.PI/4,this.scene.add(r)}new x;const M=5;this.axesHelper=new p(M),this.scene.add(this.axesHelper)}render(){requestAnimationFrame(this.render),this.renderer.render(this.scene,this.camera)}}
