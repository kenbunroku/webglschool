import"./modulepreload-polyfill-3cfb730f.js";import{G as p}from"./lil-gui.esm-aba6213a.js";class c{static loadFile(t){return new Promise((i,n)=>{fetch(t).then(e=>e.text()).then(e=>{i(e)}).catch(e=>{n(e)})})}static createWebGLContext(t){const i=t.getContext("webgl");if(i==null)throw new Error("webgl not supported");return i}static createShaderObject(t,i,n){const e=t.createShader(n);if(t.shaderSource(e,i),t.compileShader(e),t.getShaderParameter(e,t.COMPILE_STATUS))return e;throw new Error(t.getShaderInfoLog(e))}static createProgramObject(t,i,n){const e=t.createProgram();if(t.attachShader(e,i),t.attachShader(e,n),t.linkProgram(e),t.deleteShader(i),t.deleteShader(n),t.getProgramParameter(e,t.LINK_STATUS))return t.useProgram(e),e;throw new Error(t.getProgramInfoLog(e))}static createVBO(t,i){const n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(i),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),n}static enableAttribute(t,i,n,e){t.bindBuffer(t.ARRAY_BUFFER,i),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,e,t.FLOAT,!1,0,0)}}var f=`precision mediump float;
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

uniform float time;

varying vec4 vColor;
varying float vDistance;

void main() {
    float s = abs(vDistance);
    float ts = sin(time * 2.0);
    float tc = cos(time * 2.0);
    gl_FragColor = vec4(0.5 + 0.5*s*tc, 0.5 + 0.2*ts, 1.0 - 0.2*s*ts, 1.0);
}`;window.addEventListener("DOMContentLoaded",()=>{const h=new v;h.init(),h.load().then(()=>{h.setupGeometry(),h.setupLocation(),h.start()})},!1);class v{constructor(){this.canvas=null,this.gl=null,this.program=null,this.uniformLocation=null,this.positionArray=null,this.positionStride=null,this.params={petals:5,width:.5,numOfQuads:5,power:3},this.color=null,this.colorStride=null,this.colorVBO=null,this.startTime=null,this.isRender=!1,this.render=this.render.bind(this)}init(){this.canvas=document.getElementById("webgl-canvas"),this.gl=c.createWebGLContext(this.canvas);const t=Math.min(window.innerWidth,window.innerHeight);this.canvas.width=t,this.canvas.height=t;const i=new p;i.add(this.params,"petals",1,10).step(1).onChange(()=>this.setupGeometry()),i.add(this.params,"width",0,1).onChange(()=>this.setupGeometry()),i.add(this.params,"numOfQuads",2,20).step(1).name("number of quads").onChange(()=>this.setupGeometry()),i.add(this.params,"power",.01,10).step(.01).onChange(()=>this.setupGeometry())}load(){return new Promise((t,i)=>{const n=this.gl;if(n==null){const e=new Error("not initialized");i(e)}else{let e=c.createShaderObject(n,f,n.VERTEX_SHADER),a=c.createShaderObject(n,g,n.FRAGMENT_SHADER);this.program=c.createProgramObject(n,e,a),t()}})}setupGeometry(){const t=this.params.numOfQuads,i=this.params.petals,n=1/t,e=[],a=[];this.positionArray=[];for(let s=0;s<i;s++){let r=2*Math.PI/i*s;for(let l=0;l<t;l++){let o=l/t;e.push([o,r,0],[o+n,r,0],[o,r,-1]),e.push([o,r,0],[o+n,r,0],[o,r,1]),e.push([o+n,r,0],[o,r,-1],[o+n,r,-1]),e.push([o+n,r,0],[o,r,1],[o+n,r,1])}}for(let s of e){const r=s[0],l=1-Math.pow(r,this.params.power);let o=s[1]+this.params.width*l*s[2];a.push([r*Math.cos(o),r*Math.sin(o),s[2]])}const d=a.length/3;for(let s=0;s<d;s++){const r=s*3,l=a[r],o=a[r+1],u=a[r+2],m=[].concat(l,o,u);this.positionArray.push(m)}this.positionStride=3,this.color=[1,0,0,1,0,1,0,1,0,0,1,1],this.colorStride=4,this.colorVBO=c.createVBO(this.gl,this.color)}setupLocation(){const t=this.gl;this.uniformLocation={time:t.getUniformLocation(this.program,"time")}}setupRendering(){const t=this.gl;t.viewport(0,0,this.canvas.width,this.canvas.height),t.clearColor(1,1,1,1),t.clear(t.COLOR_BUFFER_BIT)}start(){this.startTime=Date.now(),this.isRender=!0,this.render()}render(){const t=this.gl;this.isRender===!0&&requestAnimationFrame(this.render),this.setupRendering();const i=(Date.now()-this.startTime)*.001;t.useProgram(this.program),t.uniform1f(this.uniformLocation.time,i);for(let n=0;n<this.positionArray.length;n++){const e=this.positionArray[n],a=c.createVBO(this.gl,e),d=t.getAttribLocation(this.program,"position"),s=t.getAttribLocation(this.program,"color");c.enableAttribute(t,a,d,this.positionStride),c.enableAttribute(t,this.colorVBO,s,this.colorStride),t.drawArrays(t.TRIANGLES,0,e.length/this.positionStride)}}}
