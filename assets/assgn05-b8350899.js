import"./modulepreload-polyfill-3cfb730f.js";import{G as m}from"./lil-gui.esm-aba6213a.js";class c{static loadFile(t){return new Promise((n,i)=>{fetch(t).then(e=>e.text()).then(e=>{n(e)}).catch(e=>{i(e)})})}static createWebGLContext(t){const n=t.getContext("webgl");if(n==null)throw new Error("webgl not supported");return n}static createShaderObject(t,n,i){const e=t.createShader(i);if(t.shaderSource(e,n),t.compileShader(e),t.getShaderParameter(e,t.COMPILE_STATUS))return e;throw new Error(t.getShaderInfoLog(e))}static createProgramObject(t,n,i){const e=t.createProgram();if(t.attachShader(e,n),t.attachShader(e,i),t.linkProgram(e),t.deleteShader(n),t.deleteShader(i),t.getProgramParameter(e,t.LINK_STATUS))return t.useProgram(e),e;throw new Error(t.getProgramInfoLog(e))}static createVBO(t,n){const i=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array(n),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),i}static enableAttribute(t,n,i,e){t.bindBuffer(t.ARRAY_BUFFER,n),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,e,t.FLOAT,!1,0,0)}}var f=`precision mediump float;
attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
varying float vDistance;

uniform float time;

void main() {
  vColor = color;

  
  float angle = atan(position.y, position.x);

  
  float distance = length(position) - 0.2;

  
  angle += cos(time) * distance * 0.5;

  
  vec2 newPosition = vec2(cos(angle), sin(angle)) * distance * 0.8;

  gl_Position = vec4(newPosition, position.z, 1.0);

  vDistance = distance;
}`,g=`precision mediump float;

varying vec4 vColor;
varying float vDistance;

void main() {
    float s = abs(vDistance);
    gl_FragColor = vec4(0.4 + 0.5*s, 0.5, 1.0 - 0.2*s, 1.0);
}`;window.addEventListener("DOMContentLoaded",()=>{const h=new v;h.init(),h.load().then(()=>{h.setupGeometry(),h.setupLocation(),h.start()})},!1);class v{constructor(){this.canvas=null,this.gl=null,this.program=null,this.uniformLocation=null,this.positionArray=null,this.positionStride=null,this.params={petals:5,width:.5,numOfQuads:5,power:3},this.color=null,this.colorStride=null,this.colorVBO=null,this.startTime=null,this.isRender=!1,this.render=this.render.bind(this)}init(){this.canvas=document.getElementById("webgl-canvas"),this.gl=c.createWebGLContext(this.canvas);const t=Math.min(window.innerWidth,window.innerHeight);this.canvas.width=t,this.canvas.height=t;const n=new m;n.add(this.params,"petals",1,10).step(1).onChange(()=>this.setupGeometry()),n.add(this.params,"width",0,1).onChange(()=>this.setupGeometry()),n.add(this.params,"numOfQuads",2,20).step(1).onChange(()=>this.setupGeometry()),n.add(this.params,"power",.01,10).step(.01).onChange(()=>this.setupGeometry())}load(){return new Promise((t,n)=>{const i=this.gl;if(i==null){const e=new Error("not initialized");n(e)}else{let e=c.createShaderObject(i,f,i.VERTEX_SHADER),a=c.createShaderObject(i,g,i.FRAGMENT_SHADER);this.program=c.createProgramObject(i,e,a),t()}})}setupGeometry(){const t=this.params.numOfQuads,n=this.params.petals,i=1/t,e=[],a=[];this.positionArray=[];for(let o=0;o<n;o++){let r=2*Math.PI/n*o;for(let l=0;l<t;l++){let s=l/t;e.push([s,r,0],[s+i,r,0],[s,r,-1]),e.push([s,r,0],[s+i,r,0],[s,r,1]),e.push([s+i,r,0],[s,r,-1],[s+i,r,-1]),e.push([s+i,r,0],[s,r,1],[s+i,r,1])}}for(let o of e){const r=o[0],l=1-Math.pow(r,this.params.power);let s=o[1]+this.params.width*l*o[2];a.push([r*Math.cos(s),r*Math.sin(s),o[2]])}const d=a.length/3;for(let o=0;o<d;o++){const r=o*3,l=a[r],s=a[r+1],p=a[r+2],u=[].concat(l,s,p);this.positionArray.push(u)}this.positionStride=3,this.color=[1,0,0,1,0,1,0,1,0,0,1,1],this.colorStride=4,this.colorVBO=c.createVBO(this.gl,this.color)}setupLocation(){const t=this.gl;this.uniformLocation={time:t.getUniformLocation(this.program,"time")}}setupRendering(){const t=this.gl;t.viewport(0,0,this.canvas.width,this.canvas.height),t.clear(.3,.3,.3,1),t.clear(t.COLOR_BUFFER_BIT)}start(){this.startTime=Date.now(),this.isRender=!0,this.render()}render(){const t=this.gl;this.isRender===!0&&requestAnimationFrame(this.render),this.setupRendering();const n=(Date.now()-this.startTime)*.001;t.useProgram(this.program),t.uniform1f(this.uniformLocation.time,n);for(let i=0;i<this.positionArray.length;i++){const e=this.positionArray[i],a=c.createVBO(this.gl,e),d=t.getAttribLocation(this.program,"position"),o=t.getAttribLocation(this.program,"color");c.enableAttribute(t,a,d,this.positionStride),c.enableAttribute(t,this.colorVBO,o,this.colorStride),t.drawArrays(t.TRIANGLES,0,e.length/this.positionStride)}}}
