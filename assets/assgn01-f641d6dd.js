import"./modulepreload-polyfill-3cfb730f.js";import{V as A,W as M,C as w,S as m,P as E,D as u,A as g,B as P,M as L,a as c}from"./three.module-57b44d7c.js";import{O as x}from"./OrbitControls-ab7bb6ee.js";window.addEventListener("DOMContentLoaded",()=>{const r=new e;r.init(),r.render()},!1);class e{static get CAMERA_PARAM(){return{fovy:60,aspect:window.innerWidth/window.innerHeight,near:.1,far:100,x:2,y:-7,z:5,lookAt:new A(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:39320,intensity:20,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.4}}static get MATERIAL_PARAM(){return{color:22456}}constructor(){this.renderer,this.scene,this.camera,this.geometry,this.material,this.box,this.controls,this.axesHelper,this.isDown=!1,this.circleRadius=4,this.render=this.render.bind(this),window.addEventListener("keydown",t=>{switch(t.key){case" ":this.isDown=!0;break}},!1),window.addEventListener("keyup",t=>{this.isDown=!1},!1),window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}init(){this.renderer=new M,this.renderer.setClearColor(new w(e.RENDERER_PARAM.clearColor)),this.renderer.setSize(e.RENDERER_PARAM.width,e.RENDERER_PARAM.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new m,this.camera=new E(e.CAMERA_PARAM.fovy,e.CAMERA_PARAM.aspect,e.CAMERA_PARAM.near,e.CAMERA_PARAM.far),this.camera.position.set(e.CAMERA_PARAM.x,e.CAMERA_PARAM.y,e.CAMERA_PARAM.z),this.camera.lookAt(e.CAMERA_PARAM.lookAt),this.directionalLight=new u(e.DIRECTIONAL_LIGHT_PARAM.color,e.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(e.DIRECTIONAL_LIGHT_PARAM.x,e.DIRECTIONAL_LIGHT_PARAM.y,e.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new g(e.AMBIENT_LIGHT_PARAM.color,e.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight),this.geometry=new P(.2,.2,.2),this.material=new L(e.MATERIAL_PARAM);const i=100;for(let a=0;a<i;a++){const o=Math.random()*2*Math.PI,h=this.circleRadius*Math.cos(o),d=this.circleRadius*Math.sin(o),l=1.5*Math.random();this.box=new c(this.geometry,this.material);const n=Math.random()*2;this.box.scale.set(n,n,n),this.box.position.set(h,d,l);const s=new A(Math.random(),Math.random(),Math.random()).normalize();this.box.rotation.set(s.x,s.y,s.z),this.box.userData.rotationAxis=s;const R=Math.atan2(d,h);this.box.userData.posAngle=R,this.scene.add(this.box)}this.controls=new x(this.camera,this.renderer.domElement)}render(){requestAnimationFrame(this.render),this.controls.update(),this.scene.children.forEach(t=>{let i;this.isDown?i=.1:!this.isDown&&this.circleRadius>4?i=-.1:i=.01,t instanceof c&&(t.rotateOnAxis(t.userData.rotationAxis,i),this.isDown?t.userData.posAngle-=.02:t.userData.posAngle+=.001,this.isDown&&this.circleRadius<6?this.circleRadius+=1e-4:!this.isDown&&this.circleRadius>4&&(this.circleRadius-=2e-4,t.userData.posAngle+=.015),t.position.x=this.circleRadius*Math.cos(t.userData.posAngle),t.position.y=this.circleRadius*Math.sin(t.userData.posAngle))}),this.renderer.render(this.scene,this.camera)}}
