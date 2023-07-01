import{b as D,c as L,F as A,a as B,d as p,U as S,e as d,f as w,H as M,N as z,g as y,C as b,V as m,h as U,i as I,W as F,S as O,P as H,D as G,A as k,G as P,j as N,B as Q,O as V}from"./OrbitControls-d04deeaa.js";import{G as W}from"./lil-gui.esm-aba6213a.js";const _={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class T{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const j=new D(-1,1,1,-1,0,1),C=new L;C.setAttribute("position",new A([-1,3,0,-1,-1,0,3,-1,0],3));C.setAttribute("uv",new A([0,2,0,0,2,0],2));class E{constructor(e){this._mesh=new B(C,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,j)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class K extends T{constructor(e,s){super(),this.textureID=s!==void 0?s:"tDiffuse",e instanceof p?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=S.clone(e.uniforms),this.material=new p({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new E(this.material)}render(e,s,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class R extends T{constructor(e,s){super(),this.scene=e,this.camera=s,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,s,r){const i=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let a,n;this.inverse?(a=0,n=1):(a=1,n=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),t.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),t.buffers.stencil.setClear(n),t.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(i.EQUAL,1,4294967295),t.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),t.buffers.stencil.setLocked(!0)}}class X extends T{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Y{constructor(e,s){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),s===void 0){const r=e.getSize(new d);this._width=r.width,this._height=r.height,s=new w(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:M}),s.texture.name="EffectComposer.rt1"}else this._width=s.width,this._height=s.height;this.renderTarget1=s,this.renderTarget2=s.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new K(_),this.copyPass.material.blending=z,this.clock=new y}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,s){this.passes.splice(s,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const s=this.passes.indexOf(e);s!==-1&&this.passes.splice(s,1)}isLastEnabledPass(e){for(let s=e+1;s<this.passes.length;s++)if(this.passes[s].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const s=this.renderer.getRenderTarget();let r=!1;for(let i=0,t=this.passes.length;i<t;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),a.needsSwap){if(r){const n=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}R!==void 0&&(a instanceof R?r=!0:a instanceof X&&(r=!1))}}this.renderer.setRenderTarget(s)}reset(e){if(e===void 0){const s=this.renderer.getSize(new d);this._pixelRatio=this.renderer.getPixelRatio(),this._width=s.width,this._height=s.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,s){this._width=e,this._height=s;const r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class q extends T{constructor(e,s,r,i,t){super(),this.scene=e,this.camera=s,this.overrideMaterial=r,this.clearColor=i,this.clearAlpha=t!==void 0?t:0,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new b}render(e,s,r){const i=e.autoClear;e.autoClear=!1;let t,a;this.overrideMaterial!==void 0&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor&&(e.getClearColor(this._oldClearColor),t=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor&&e.setClearColor(this._oldClearColor,t),this.overrideMaterial!==void 0&&(this.scene.overrideMaterial=a),e.autoClear=i}}const $={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new b(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class g extends T{constructor(e,s,r,i){super(),this.strength=s!==void 0?s:1,this.radius=r,this.threshold=i,this.resolution=e!==void 0?new d(e.x,e.y):new d(256,256),this.clearColor=new b(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new w(t,a,{type:M}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const c=new w(t,a,{type:M});c.texture.name="UnrealBloomPass.h"+u,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const x=new w(t,a,{type:M});x.texture.name="UnrealBloomPass.v"+u,x.texture.generateMipmaps=!1,this.renderTargetsVertical.push(x),t=Math.round(t/2),a=Math.round(a/2)}const n=$;this.highPassUniforms=S.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new p({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];t=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.texSize.value=new d(t,a),t=Math.round(t/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=s,this.compositeMaterial.uniforms.bloomRadius.value=.1;const v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new m(1,1,1),new m(1,1,1),new m(1,1,1),new m(1,1,1),new m(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=_;this.copyUniforms=S.clone(h.uniforms),this.blendMaterial=new p({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:U,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new b,this.oldClearAlpha=1,this.basic=new I,this.fsQuad=new E(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,s){let r=Math.round(e/2),i=Math.round(s/2);this.renderTargetBright.setSize(r,i);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(r,i),this.renderTargetsVertical[t].setSize(r,i),this.separableBlurMaterials[t].uniforms.texSize.value=new d(r,i),r=Math.round(r/2),i=Math.round(i/2)}render(e,s,r,i,t){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=r.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let n=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[l].uniforms.direction.value=g.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=g.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),n=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(r),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){return new p({defines:{KERNEL_RADIUS:e,SIGMA:e},uniforms:{colorTexture:{value:null},texSize:{value:new d(.5,.5)},direction:{value:new d(.5,.5)}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new p({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}g.BlurDirectionX=new d(1,0);g.BlurDirectionY=new d(0,1);window.addEventListener("DOMContentLoaded",()=>{const f=new o;f.init(),f.render()},!1);class o{static get CAMERA_PARAM(){return{fovy:60,aspect:window.innerWidth/window.innerHeight,near:.1,far:40,x:10,y:0,z:15,lookAt:new m(0,0,0)}}static get RENDERER_PARAM(){return{clearColor:0,width:window.innerWidth,height:window.innerHeight}}static get DIRECTIONAL_LIGHT_PARAM(){return{color:16777215,intensity:1,x:1,y:1,z:1}}static get AMBIENT_LIGHT_PARAM(){return{color:16777215,intensity:.2}}constructor(){this.renderer,this.scene,this.camera,this.directionalLight,this.ambientLight,this.boxGeometry,this.boxArray,this.controls,this.axisHelper,this.composer,this.renderPass,this.unrealBloomPass,this.boxes,this.isPowerOn=!1,this.powerOnTime=null,this.rotationSpeed=0,this.clock=new y(!1),this.colors=[{color:15679797},{color:16777215},{color:21924}],this.params={bloomStrength:1.5,bloomThreshold:.01,bloomRadius:.85},this.render=this.render.bind(this),document.getElementById("power-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn=!this.isPowerOn,this.isPowerOn?this.clock.start():this.clock.stop()}),document.getElementById("speed-up-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn&&(this.rotationSpeed+=.01,this.rotationSpeed>this.params.bloomThreshold&&(this.params.bloomStrength+=.5,this.unrealBloomPass.strength=this.params.bloomStrength))}),document.getElementById("speed-down-btn").addEventListener("click",e=>{e.preventDefault(),this.isPowerOn&&(this.rotationSpeed-=.01,this.rotationSpeed>this.params.bloomThreshold&&(this.params.bloomStrength-=.5,this.unrealBloomPass.strength=this.params.bloomStrength))}),window.addEventListener("resize",()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix()},!1)}init(){this.renderer=new F,this.renderer.setClearColor(new b(o.RENDERER_PARAM.clearColor)),this.renderer.setSize(o.RENDERER_PARAM.width,o.RENDERER_PARAM.height),document.querySelector("#webgl").appendChild(this.renderer.domElement),this.scene=new O,this.camera=new H(o.CAMERA_PARAM.fovy,o.CAMERA_PARAM.aspect,o.CAMERA_PARAM.near,o.CAMERA_PARAM.far),this.camera.position.set(o.CAMERA_PARAM.x,o.CAMERA_PARAM.y,o.CAMERA_PARAM.z),this.camera.lookAt(o.CAMERA_PARAM.lookAt),this.directionalLight=new G(o.DIRECTIONAL_LIGHT_PARAM.color,o.DIRECTIONAL_LIGHT_PARAM.intensity),this.directionalLight.position.set(o.DIRECTIONAL_LIGHT_PARAM.x,o.DIRECTIONAL_LIGHT_PARAM.y,o.DIRECTIONAL_LIGHT_PARAM.z),this.scene.add(this.directionalLight),this.ambientLight=new k(o.AMBIENT_LIGHT_PARAM.color,o.AMBIENT_LIGHT_PARAM.intensity),this.scene.add(this.ambientLight);const s=new W,r=s.addFolder("Colors"),i=s.addFolder("Bloom");this.boxes=[];for(let t=0;t<3;t++){this.bladeGroup=new P,this.motorGroup=new P;const a=new N(this.colors[t]);a.metalness=.8;const n=15,l=.5;this.boxGeometry=new Q(l,l*1.61803398875,.1),this.boxArray=[];for(let v=0;v<n;v++){const h=new B(this.boxGeometry,a),u=v/n*Math.PI*2,c=2*(t+1);h.position.x=Math.cos(u)*c,h.position.y=Math.sin(u)*c,h.position.z=2.5*(t+1);const x=Math.atan2(h.position.y,h.position.x);h.rotation.z=x+90*(Math.PI/180),this.bladeGroup.add(h),this.boxArray.push(h)}this.motorGroup.add(this.bladeGroup),this.boxes.push({Blades:this.bladeGroup,Motor:this.motorGroup,isStarted:!1,startDelay:t*1}),r.addColor(this.colors[t],"color").name(`Color ${t+1}`).onChange(()=>{a.color.set(this.colors[t].color)}),this.scene.add(this.motorGroup)}i.add(this.params,"bloomThreshold",0,.1,.001).onChange(t=>{this.unrealBloomPass.strength=Number(t)}),i.add(this.params,"bloomRadius",0,5,.05).onChange(t=>{this.unrealBloomPass.strength=Number(t)}),this.controls=new V(this.camera,this.renderer.domElement),this.composer=new Y(this.renderer),this.renderPass=new q(this.scene,this.camera),this.composer.addPass(this.renderPass),this.unrealBloomPass=new g(new d(window.innerWidth,window.innerHeight),1.5,.4,.85),this.unrealBloomPass.threshold=this.params.bloomThreshold,this.unrealBloomPass.strength=this.params.bloomStrength,this.unrealBloomPass.radius=this.params.bloomRadius,this.composer.addPass(this.unrealBloomPass)}render(){requestAnimationFrame(this.render),this.controls.update(),this.boxes.forEach(e=>{if(this.isPowerOn){const s=this.clock.getElapsedTime();s>e.startDelay&&!e.isStarted&&(this.rotationSpeed=.02,e.isStarted=!0,e.previousAngle=e.previousAngle||0),e.isStarted&&(e.Blades.rotation.z+=this.rotationSpeed,e.angle=e.previousAngle+(s-e.startDelay)/10*2*Math.PI,e.Motor.rotation.y=Math.sin(e.angle))}else!this.isPowerOn&&this.rotationSpeed>0?(this.rotationSpeed-=1e-4,e.Blades.rotation.z+=this.rotationSpeed):!this.isPowerOn&&this.rotationSpeed<=0&&(this.rotationSpeed=0,e.isStarted=!1,e.previousAngle=e.angle)}),Math.abs(this.rotationSpeed)>.05?this.unrealBloomPass.enabled=!0:this.unrealBloomPass.enabled=!1,this.composer.render()}}
