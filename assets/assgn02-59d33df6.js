import{V as u,b as R,W as f,C as M,S as g,P as p,D as E,A as C,G as A,c as b,B as L,a as I,d as S}from"./three.module-450b7996.js";import{O as T}from"./OrbitControls-a0f1bf32.js";import{G as y,E as G,R as B,U as O}from"./lil-gui.esm-86906e4e.js";window.addEventListener("DOMContentLoaded",()=>{const a=new t;a.init(),a.render()},!1);class t{static get CAMERA_PARAM(){return{fovy:60,aspect:window.innerWidth/window.innerHeight,near:.1,far:40,x:10,y:0,z:15,lookAt:new u(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:16777215,intensity:1,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.2}}constructor(){this.renderer,this.scene,this.camera,this.directionalLight,this.ambientLight,this.boxGeometry,this.boxArray,this.controls,this.axisHelper,this.composer,this.renderPass,this.unrealBloomPass,this.boxes,this.isPowerOn=!1,this.powerOnTime=null,this.rotationSpeed=0,this.clock=new R(!1),this.colors=[{color:15679797},{color:16777215},{color:21924}],this.params={bloomStrength:1.5,bloomThreshold:.01,bloomRadius:.85},this.render=this.render.bind(this),document.getElementById("power-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn=!this.isPowerOn,this.isPowerOn?this.clock.start():this.clock.stop()}),document.getElementById("speed-up-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn&&(this.rotationSpeed+=.01,this.rotationSpeed>this.params.bloomThreshold&&(this.params.bloomStrength+=.5,this.unrealBloomPass.strength=this.params.bloomStrength))}),document.getElementById("speed-down-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn&&(this.rotationSpeed-=.01,this.rotationSpeed>this.params.bloomThreshold&&(this.params.bloomStrength-=.5,this.unrealBloomPass.strength=this.params.bloomStrength))}),window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}init(){this.renderer=new f({antialias:!0}),this.renderer.setClearColor(new M(t.RENDERER_PARAM.clearColor)),this.renderer.setSize(t.RENDERER_PARAM.width,t.RENDERER_PARAM.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new g,this.camera=new p(t.CAMERA_PARAM.fovy,t.CAMERA_PARAM.aspect,t.CAMERA_PARAM.near,t.CAMERA_PARAM.far),this.camera.position.set(t.CAMERA_PARAM.x,t.CAMERA_PARAM.y,t.CAMERA_PARAM.z),this.camera.lookAt(t.CAMERA_PARAM.lookAt),this.directionalLight=new E(t.DIRECTIONAL_LIGHT_PARAM.color,t.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(t.DIRECTIONAL_LIGHT_PARAM.x,t.DIRECTIONAL_LIGHT_PARAM.y,t.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new C(t.AMBIENT_LIGHT_PARAM.color,t.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight);const o=new y,w=o.addFolder("Colors"),h=o.addFolder("Bloom");this.boxes=[];for(let s=0;s<3;s++){this.bladeGroup=new A,this.motorGroup=new A;const r=new b(this.colors[s]);r.metalness=.8;const l=15,d=.5;this.boxGeometry=new L(d,d*1.61803398875,.1),this.boxArray=[];for(let n=0;n<l;n++){const i=new I(this.boxGeometry,r),c=n/l*Math.PI*2,m=2*(s+1);i.position.x=Math.cos(c)*m,i.position.y=Math.sin(c)*m,i.position.z=2.5*(s+1);const P=Math.atan2(i.position.y,i.position.x);i.rotation.z=P+90*(Math.PI/180),this.bladeGroup.add(i),this.boxArray.push(i)}this.motorGroup.add(this.bladeGroup),this.boxes.push({Blades:this.bladeGroup,Motor:this.motorGroup,isStarted:!1,startDelay:s*1}),w.addColor(this.colors[s],"color").name(`Color ${s+1}`).onChange(()=>{r.color.set(this.colors[s].color)}),this.scene.add(this.motorGroup)}h.add(this.params,"bloomThreshold",0,.1,.001).onChange(s=>{this.unrealBloomPass.threshold=Number(s)}),h.add(this.params,"bloomRadius",0,5,.05).onChange(s=>{this.unrealBloomPass.radius=Number(s)}),this.controls=new T(this.camera,this.renderer.domElement),this.composer=new G(this.renderer),this.renderPass=new B(this.scene,this.camera),this.composer.addPass(this.renderPass),this.unrealBloomPass=new O(new S(window.innerWidth,window.innerHeight),1.5,.4,.85),this.unrealBloomPass.threshold=this.params.bloomThreshold,this.unrealBloomPass.strength=this.params.bloomStrength,this.unrealBloomPass.radius=this.params.bloomRadius,this.composer.addPass(this.unrealBloomPass)}render(){requestAnimationFrame(this.render),this.controls.update(),this.boxes.forEach(e=>{if(this.isPowerOn){const o=this.clock.getElapsedTime();o>e.startDelay&&!e.isStarted&&(this.rotationSpeed=.02,e.isStarted=!0,e.previousAngle=e.previousAngle||0),e.isStarted&&(e.Blades.rotation.z+=this.rotationSpeed,e.angle=e.previousAngle+(o-e.startDelay)/10*2*Math.PI,e.Motor.rotation.y=Math.sin(e.angle))}else!this.isPowerOn&&this.rotationSpeed>0?(this.rotationSpeed-=1e-4,e.Blades.rotation.z+=this.rotationSpeed):!this.isPowerOn&&this.rotationSpeed<=0&&(this.rotationSpeed=0,e.isStarted=!1,e.previousAngle=e.angle)}),Math.abs(this.rotationSpeed)>.05?this.unrealBloomPass.enabled=!0:this.unrealBloomPass.enabled=!1,this.composer.render()}}
