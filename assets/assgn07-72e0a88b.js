import"./modulepreload-polyfill-3cfb730f.js";import{g as Z}from"./index-4db78ffb.js";import"./tweakpane-a93a1018.js";class B{static loadFile(t){return new Promise((e,s)=>{fetch(t).then(n=>n.text()).then(n=>{e(n)}).catch(n=>{s(n)})})}static loadImage(t){return new Promise(e=>{const s=new Image;s.addEventListener("load",()=>{e(s)},!1),s.addEventListener("error",n=>{reject(new Error(`Failed to load image at path: ${t}`))},!1),s.src=t})}static loadImages(t){return Promise.all(t.map(e=>B.loadImage(e)))}static createWebGLContext(t){const e=t.getContext("webgl");if(e==null)throw new Error("webgl not supported");return e}static createShaderObject(t,e,s){const n=t.createShader(s);if(t.shaderSource(n,e),t.compileShader(n),t.getShaderParameter(n,t.COMPILE_STATUS))return n;throw new Error(t.getShaderInfoLog(n))}static createProgramObject(t,e,s){const n=t.createProgram();if(t.attachShader(n,e),t.attachShader(n,s),t.linkProgram(n),t.deleteShader(e),t.deleteShader(s),t.getProgramParameter(n,t.LINK_STATUS))return t.useProgram(n),n;throw new Error(t.getProgramInfoLog(n))}static createVBO(t,e){const s=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array(e),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null),s}static createIBO(t,e){const s=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,s),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Int16Array(e),t.STATIC_DRAW),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null),s}static enableBuffer(t,e,s,n,i){for(let o=0;o<e.length;++o)t.bindBuffer(t.ARRAY_BUFFER,e[o]),t.enableVertexAttribArray(s[o]),t.vertexAttribPointer(s[o],n[o],t.FLOAT,!1,0,0);i!=null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,i)}static createTexture(t,e){const s=t.createTexture();return t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,s),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.generateMipmap(t.TEXTURE_2D),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.bindTexture(t.TEXTURE_2D,null),s}static createTextures(t,e){const s=[];for(let n=0;n<e.length;++n)s.push(this.createTexture(t,e[n]));return s}}class O{static get Vec2(){return H}static get Vec3(){return W}static get Mat4(){return Q}static get Qtn(){return K}}let H=class k{static create(t=0,e=0){const s=new Float32Array(2);return s[0]=t,s[1]=e,s}static length(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])}static normalize(t){const e=k.create(),s=k.length(t);if(s>0){const n=1/s;e[0]=t[0]*n,e[1]=t[1]*n}return e}static dot(t,e){return t[0]*e[0]+t[1]*e[1]}static cross(t,e){return k.create(),t[0]*e[1]-t[1]*e[0]}},W=class z{static create(t=0,e=0,s=0){const n=new Float32Array(3);return n[0]=t,n[1]=e,n[2]=s,n}static length(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2])}static subtract(t,e){const s=z.create();return s[0]=t[0]-e[0],s[1]=t[1]-e[1],s[2]=t[2]-e[2],s}static normalize(t){const e=z.create(),s=z.length(t);if(s>0){const n=1/s;e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n}return e}static dot(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}static cross(t,e){return z.create(t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0])}static faceNormal(t,e,s){const n=z.create(e[0]-t[0],e[1]-t[1],e[2]-t[2]),i=z.create(s[0]-t[0],s[1]-t[1],s[2]-t[2]),o=z.create(n[1]*i[2]-n[2]*i[1],n[2]*i[0]-n[0]*i[2],n[0]*i[1]-n[1]*i[0]);return z.normalize(o)}},Q=class F{static create(){return new Float32Array(16)}static identity(t){const e=t??F.create();return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}static multiply(t,e,s){const n=s??F.create(),i=t[0],o=t[1],r=t[2],a=t[3],c=t[4],h=t[5],l=t[6],u=t[7],d=t[8],M=t[9],p=t[10],E=t[11],v=t[12],y=t[13],g=t[14],f=t[15],m=e[0],T=e[1],x=e[2],I=e[3],w=e[4],b=e[5],L=e[6],U=e[7],P=e[8],R=e[9],D=e[10],A=e[11],_=e[12],X=e[13],G=e[14],$=e[15];return n[0]=m*i+T*c+x*d+I*v,n[1]=m*o+T*h+x*M+I*y,n[2]=m*r+T*l+x*p+I*g,n[3]=m*a+T*u+x*E+I*f,n[4]=w*i+b*c+L*d+U*v,n[5]=w*o+b*h+L*M+U*y,n[6]=w*r+b*l+L*p+U*g,n[7]=w*a+b*u+L*E+U*f,n[8]=P*i+R*c+D*d+A*v,n[9]=P*o+R*h+D*M+A*y,n[10]=P*r+R*l+D*p+A*g,n[11]=P*a+R*u+D*E+A*f,n[12]=_*i+X*c+G*d+$*v,n[13]=_*o+X*h+G*M+$*y,n[14]=_*r+X*l+G*p+$*g,n[15]=_*a+X*u+G*E+$*f,n}static scale(t,e,s){const n=s??F.create();return n[0]=t[0]*e[0],n[1]=t[1]*e[0],n[2]=t[2]*e[0],n[3]=t[3]*e[0],n[4]=t[4]*e[1],n[5]=t[5]*e[1],n[6]=t[6]*e[1],n[7]=t[7]*e[1],n[8]=t[8]*e[2],n[9]=t[9]*e[2],n[10]=t[10]*e[2],n[11]=t[11]*e[2],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n}static translate(t,e,s){const n=s??F.create();return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[0]*e[0]+t[4]*e[1]+t[8]*e[2]+t[12],n[13]=t[1]*e[0]+t[5]*e[1]+t[9]*e[2]+t[13],n[14]=t[2]*e[0]+t[6]*e[1]+t[10]*e[2]+t[14],n[15]=t[3]*e[0]+t[7]*e[1]+t[11]*e[2]+t[15],n}static rotate(t,e,s,n){let i=n??F.create();const o=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);if(!o)return null;let r=s[0],a=s[1],c=s[2];if(o!=1){const X=1/o;r*=X,a*=X,c*=X}const h=Math.sin(e),l=Math.cos(e),u=1-l,d=t[0],M=t[1],p=t[2],E=t[3],v=t[4],y=t[5],g=t[6],f=t[7],m=t[8],T=t[9],x=t[10],I=t[11],w=r*r*u+l,b=a*r*u+c*h,L=c*r*u-a*h,U=r*a*u-c*h,P=a*a*u+l,R=c*a*u+r*h,D=r*c*u+a*h,A=a*c*u-r*h,_=c*c*u+l;return e?t!=i&&(i[12]=t[12],i[13]=t[13],i[14]=t[14],i[15]=t[15]):i=t,i[0]=d*w+v*b+m*L,i[1]=M*w+y*b+T*L,i[2]=p*w+g*b+x*L,i[3]=E*w+f*b+I*L,i[4]=d*U+v*P+m*R,i[5]=M*U+y*P+T*R,i[6]=p*U+g*P+x*R,i[7]=E*U+f*P+I*R,i[8]=d*D+v*A+m*_,i[9]=M*D+y*A+T*_,i[10]=p*D+g*A+x*_,i[11]=E*D+f*A+I*_,i}static lookAt(t,e,s,n){const i=n??F.create(),o=t[0],r=t[1],a=t[2],c=e[0],h=e[1],l=e[2],u=s[0],d=s[1],M=s[2];if(o==c&&r==h&&a==l)return F.identity(i);let p,E,v,y,g,f,m,T,x,I;return m=o-c,T=r-h,x=a-l,I=1/Math.sqrt(m*m+T*T+x*x),m*=I,T*=I,x*=I,p=d*x-M*T,E=M*m-u*x,v=u*T-d*m,I=Math.sqrt(p*p+E*E+v*v),I?(I=1/I,p*=I,E*=I,v*=I):(p=0,E=0,v=0),y=T*v-x*E,g=x*p-m*v,f=m*E-T*p,I=Math.sqrt(y*y+g*g+f*f),I?(I=1/I,y*=I,g*=I,f*=I):(y=0,g=0,f=0),i[0]=p,i[1]=y,i[2]=m,i[3]=0,i[4]=E,i[5]=g,i[6]=T,i[7]=0,i[8]=v,i[9]=f,i[10]=x,i[11]=0,i[12]=-(p*o+E*r+v*a),i[13]=-(y*o+g*r+f*a),i[14]=-(m*o+T*r+x*a),i[15]=1,i}static perspective(t,e,s,n,i){const o=i??F.create(),r=s*Math.tan(t*Math.PI/360),c=r*e*2,h=r*2,l=n-s;return o[0]=s*2/c,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=s*2/h,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=-(n+s)/l,o[11]=-1,o[12]=0,o[13]=0,o[14]=-(n*s*2)/l,o[15]=0,o}static ortho(t,e,s,n,i,o,r){const a=r??F.create(),c=e-t,h=s-n,l=o-i;return a[0]=2/c,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2/h,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=-2/l,a[11]=0,a[12]=-(t+e)/c,a[13]=-(s+n)/h,a[14]=-(o+i)/l,a[15]=1,a}static transpose(t,e){const s=e??F.create();return s[0]=t[0],s[1]=t[4],s[2]=t[8],s[3]=t[12],s[4]=t[1],s[5]=t[5],s[6]=t[9],s[7]=t[13],s[8]=t[2],s[9]=t[6],s[10]=t[10],s[11]=t[14],s[12]=t[3],s[13]=t[7],s[14]=t[11],s[15]=t[15],s}static inverse(t,e){const s=e??F.create(),n=t[0],i=t[1],o=t[2],r=t[3],a=t[4],c=t[5],h=t[6],l=t[7],u=t[8],d=t[9],M=t[10],p=t[11],E=t[12],v=t[13],y=t[14],g=t[15],f=n*c-i*a,m=n*h-o*a,T=n*l-r*a,x=i*h-o*c,I=i*l-r*c,w=o*l-r*h,b=u*v-d*E,L=u*y-M*E,U=u*g-p*E,P=d*y-M*v,R=d*g-p*v,D=M*g-p*y,A=1/(f*D-m*R+T*P+x*U-I*L+w*b);return s[0]=(c*D-h*R+l*P)*A,s[1]=(-i*D+o*R-r*P)*A,s[2]=(v*w-y*I+g*x)*A,s[3]=(-d*w+M*I-p*x)*A,s[4]=(-a*D+h*U-l*L)*A,s[5]=(n*D-o*U+r*L)*A,s[6]=(-E*w+y*T-g*m)*A,s[7]=(u*w-M*T+p*m)*A,s[8]=(a*R-c*U+l*b)*A,s[9]=(-n*R+i*U-r*b)*A,s[10]=(E*I-v*T+g*f)*A,s[11]=(-u*I+d*T-p*f)*A,s[12]=(-a*P+c*L-h*b)*A,s[13]=(n*P-i*L+o*b)*A,s[14]=(-E*x+v*m-y*f)*A,s[15]=(u*x-d*m+M*f)*A,s}static toVecIV(t,e){const s=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],c=t[6],h=t[7],l=t[8],u=t[9],d=t[10],M=t[11],p=t[12],E=t[13],v=t[14],y=t[15],g=e[0],f=e[1],m=e[2],T=e[3],x=new Float32Array(4);return x[0]=g*s+f*r+m*l+T*p,x[1]=g*n+f*a+m*u+T*E,x[2]=g*i+f*c+m*d+T*v,x[3]=g*o+f*h+m*M+T*y,x}static screenPositionFromMvp(t,e,s,n){const i=s*.5,o=n*.5,r=F.toVecIV(t,[e[0],e[1],e[2],1]);if(r[3]<=0)return[NaN,NaN];r[0]/=r[3],r[1]/=r[3],r[2]/=r[3];const a=H.create();return a[0]=i+r[0]*i,a[1]=o-r[1]*o,a}},K=class C{static create(){return new Float32Array(4)}static identity(t){const e=t??C.create();return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}static inverse(t,e){const s=e??C.create();return s[0]=-t[0],s[1]=-t[1],s[2]=-t[2],s[3]=t[3],s}static normalize(t){const e=C.create(),s=t[0],n=t[1],i=t[2],o=Math.sqrt(s*s+n*n+i*i);if(o>0){const r=1/o;e[0]=s*r,e[1]=n*r,e[2]=i*r}return e}static multiply(t,e,s){const n=s??C.create(),i=t[0],o=t[1],r=t[2],a=t[3],c=e[0],h=e[1],l=e[2],u=e[3];return n[0]=i*u+a*c+o*l-r*h,n[1]=o*u+a*h+r*c-i*l,n[2]=r*u+a*l+i*h-o*c,n[3]=a*u-i*c-o*h-r*l,n}static rotate(t,e,s){const n=s??C.create();let i=e[0],o=e[1],r=e[2];const a=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(a!==0){const h=1/a;i*=h,o*=h,r*=h}const c=Math.sin(t*.5);return n[0]=i*c,n[1]=o*c,n[2]=r*c,n[3]=Math.cos(t*.5),n}static toVecIII(t,e,s){const n=s??W.create(),i=C.create(),o=C.create(),r=C.create();return C.inverse(e,r),i[0]=t[0],i[1]=t[1],i[2]=t[2],C.multiply(r,i,o),C.multiply(o,e,r),n[0]=r[0],n[1]=r[1],n[2]=r[2],n}static toMatIV(t,e){const s=e??Q.create(),n=t[0],i=t[1],o=t[2],r=t[3],a=n+n,c=i+i,h=o+o,l=n*a,u=n*c,d=n*h,M=i*c,p=i*h,E=o*h,v=r*a,y=r*c,g=r*h;return s[0]=1-(M+E),s[1]=u-g,s[2]=d+y,s[3]=0,s[4]=u+g,s[5]=1-(l+E),s[6]=p-v,s[7]=0,s[8]=d-y,s[9]=p+v,s[10]=1-(l+M),s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}static slerp(t,e,s,n){const i=n??C.create(),o=t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3];let r=1-o*o;if(r<=0)i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=t[3];else if(r=Math.sqrt(r),Math.abs(r)<1e-4)i[0]=t[0]*.5+e[0]*.5,i[1]=t[1]*.5+e[1]*.5,i[2]=t[2]*.5+e[2]*.5,i[3]=t[3]*.5+e[3]*.5;else{const a=Math.acos(o),c=a*s,h=Math.sin(a-c)/r,l=Math.sin(c)/r;i[0]=t[0]*h+e[0]*l,i[1]=t[1]*h+e[1]*l,i[2]=t[2]*h+e[2]*l,i[3]=t[3]*h+e[3]*l}return i}};class J{static plane(t,e,s){const n=t/2,i=e/2,o=[-n,i,0,n,i,0,-n,-i,0,n,-i,0],r=[0,0,1,0,0,1,0,0,1,0,0,1],a=[s[0],s[1],s[2],s[3],s[0],s[1],s[2],s[3],s[0],s[1],s[2],s[3],s[0],s[1],s[2],s[3]];return{position:o,normal:r,color:a,texCoord:[0,0,1,0,0,1,1,1],index:[0,2,1,1,2,3]}}static circle(t,e,s){const n=[],i=[],o=[],r=[],a=[];n.push(0,0,0),i.push(0,0,1),o.push(s[0],s[1],s[2],s[3]),r.push(.5,.5);let c=0;for(let h=0;h<t;h++){const l=Math.PI*2/t*h,u=Math.cos(l),d=Math.sin(l);n.push(u*e,d*e,0),i.push(0,0,1),o.push(s[0],s[1],s[2],s[3]),r.push((u+1)*.5,1-(d+1)*.5),h===t-1?a.push(0,c+1,1):a.push(0,c+1,c+2),++c}return{position:n,normal:i,color:o,texCoord:r,index:a}}static cube(t,e){const s=t*.5,n=[-s,-s,s,s,-s,s,s,s,s,-s,s,s,-s,-s,-s,-s,s,-s,s,s,-s,s,-s,-s,-s,s,-s,-s,s,s,s,s,s,s,s,-s,-s,-s,-s,s,-s,-s,s,-s,s,-s,-s,s,s,-s,-s,s,s,-s,s,s,s,s,-s,s,-s,-s,-s,-s,-s,s,-s,s,s,-s,s,-s],i=1/Math.sqrt(3),o=[-i,-i,i,i,-i,i,i,i,i,-i,i,i,-i,-i,-i,-i,i,-i,i,i,-i,i,-i,-i,-i,i,-i,-i,i,i,i,i,i,i,i,-i,-i,-i,-i,i,-i,-i,i,-i,i,-i,-i,i,i,-i,-i,i,i,-i,i,i,i,i,-i,i,-i,-i,-i,-i,-i,i,-i,i,i,-i,i,-i],r=[];for(let h=0;h<n.length/3;h++)r.push(e[0],e[1],e[2],e[3]);return{position:n,normal:o,color:r,texCoord:[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],index:[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]}}static cone(t,e,s,n){const i=[],o=[],r=[],a=[],c=[],h=s/2;i.push(0,-h,0),o.push(0,-1,0),r.push(n[0],n[1],n[2],n[3]),a.push(.5,.5);let l=0;for(let u=0;u<=t;u++){const d=Math.PI*2/t*u,M=Math.cos(d),p=Math.sin(d);i.push(M*e,-h,p*e,M*e,-h,p*e),o.push(0,-1,0,M,0,p),r.push(n[0],n[1],n[2],n[3],n[0],n[1],n[2],n[3]),a.push((M+1)*.5,1-(p+1)*.5,(M+1)*.5,1-(p+1)*.5),u!==t&&(c.push(0,l+1,l+3),c.push(l+4,l+2,t*2+3)),l+=2}return i.push(0,h,0),o.push(0,1,0),r.push(n[0],n[1],n[2],n[3]),a.push(.5,.5),{position:i,normal:o,color:r,texCoord:a,index:c}}static cylinder(t,e,s,n,i){const o=[],r=[],a=[],c=[],h=[],l=n/2;o.push(0,l,0,0,-l,0),r.push(0,1,0,0,-1,0),a.push(i[0],i[1],i[2],i[3],i[0],i[1],i[2],i[3]),c.push(.5,.5,.5,.5);let u=2;for(let d=0;d<=t;d++){const M=Math.PI*2/t*d,p=Math.cos(M),E=Math.sin(M);o.push(p*e,l,E*e,p*e,l,E*e,p*s,-l,E*s,p*s,-l,E*s),r.push(0,1,0,p,0,E,0,-1,0,p,0,E),a.push(i[0],i[1],i[2],i[3],i[0],i[1],i[2],i[3],i[0],i[1],i[2],i[3],i[0],i[1],i[2],i[3]),c.push((p+1)*.5,1-(E+1)*.5,1-d/t,0,(p+1)*.5,1-(E+1)*.5,1-d/t,1),d!==t&&h.push(0,u+4,u,1,u+2,u+6,u+5,u+7,u+1,u+1,u+7,u+3),u+=4}return{position:o,normal:r,color:a,texCoord:c,index:h}}static sphere(t,e,s,n){const i=[],o=[],r=[],a=[],c=[];for(let h=0;h<=t;h++){const l=Math.PI/t*h,u=Math.cos(l),d=Math.sin(l);for(let M=0;M<=e;M++){const p=Math.PI*2/e*M,E=d*s*Math.cos(p),v=u*s,y=d*s*Math.sin(p),g=d*Math.cos(p),f=d*Math.sin(p);i.push(E,v,y),o.push(g,u,f),r.push(n[0],n[1],n[2],n[3]),a.push(1-1/e*M,1/t*h)}}for(let h=0;h<t;h++)for(let l=0;l<e;l++){const u=(e+1)*h+l;c.push(u,u+1,u+e+2),c.push(u,u+e+2,u+e+1)}return{position:i,normal:o,color:r,texCoord:a,index:c}}static torus(t,e,s,n,i){const o=[],r=[],a=[],c=[],h=[];for(let l=0;l<=t;l++){const u=Math.PI*2/t*l,d=Math.cos(u),M=Math.sin(u);for(let p=0;p<=e;p++){const E=Math.PI*2/e*p,v=(d*s+n)*Math.cos(E),y=M*s,g=(d*s+n)*Math.sin(E),f=d*Math.cos(E),m=d*Math.sin(E),T=1/e*p;let x=1/t*l+.5;x>1&&(x-=1),x=1-x,o.push(v,y,g),r.push(f,M,m),a.push(i[0],i[1],i[2],i[3]),c.push(T,x)}}for(let l=0;l<t;l++)for(let u=0;u<e;u++){const d=(e+1)*l+u;h.push(d,d+e+1,d+1),h.push(d+e+1,d+e+2,d+1)}return{position:o,normal:r,color:a,texCoord:c,index:h}}static icosahedron(t,e){const s=(1+Math.sqrt(5))/2,n=s*t,i=Math.sqrt(1+s*s),o=[1/i,s/i],r=[-t,n,0,t,n,0,-t,-n,0,t,-n,0,0,-t,n,0,t,n,0,-t,-n,0,t,-n,n,0,-t,n,0,t,-n,0,-t,-n,0,t],a=[-o[0],o[1],0,o[0],o[1],0,-o[0],-o[1],0,o[0],-o[1],0,0,-o[0],o[1],0,o[0],o[1],0,-o[0],-o[1],0,o[0],-o[1],o[1],0,-o[0],o[1],0,o[0],-o[1],0,-o[0],-o[1],0,o[0]],c=[e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3],e[0],e[1],e[2],e[3]],h=[];for(let u=0,d=a.length;u<d;u+=3){const M=(Math.atan2(a[u+2],-a[u])+Math.PI)/(Math.PI*2),p=1-(a[u+1]+1)/2;h.push(M,p)}return{position:r,normal:a,color:c,texCoord:h,index:[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1]}}static icosphere(t=0,e=!1){const s=O.Vec3;if(t>10)throw new Error(`Max order is 10, but given ${t}.`);const n=(1+Math.sqrt(5))/2,o=10*Math.pow(4,t)+2;let r=new Float32Array(o*3),a=new Float32Array(r.length);r.set(Float32Array.of(-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1));let c=Uint32Array.of(0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,11,10,2,5,11,4,1,5,9,7,1,8,10,7,6,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,9,8,1,4,9,5,2,4,11,6,2,10,8,6,7),h=12;const l=t?new Map:null;function u(f,m){const T=Math.floor((f+m)*(f+m+1)/2+Math.min(f,m));let x=l.get(T);return x!==void 0?(l.delete(T),x):(l.set(T,h),r[3*h+0]=(r[3*f+0]+r[3*m+0])*.5,r[3*h+1]=(r[3*f+1]+r[3*m+1])*.5,r[3*h+2]=(r[3*f+2]+r[3*m+2])*.5,h++)}let d=c;const M=t>5?Uint32Array:Uint16Array;for(let f=0;f<t;f++){const m=d.length;c=new M(m*4);for(let T=0;T<m;T+=3){const x=d[T+0],I=d[T+1],w=d[T+2],b=u(x,I),L=u(I,w),U=u(w,x);let P=T*4;c[P++]=x,c[P++]=b,c[P++]=U,c[P++]=I,c[P++]=L,c[P++]=b,c[P++]=w,c[P++]=U,c[P++]=L,c[P++]=b,c[P++]=L,c[P++]=U}d=c}for(let f=0;f<o*3;f+=3){const m=r[f+0],T=r[f+1],x=r[f+2],I=1/Math.hypot(m,T,x);r[f+0]*=I,r[f+1]*=I,r[f+2]*=I,a[f+0]=r[f+0],a[f+1]=r[f+1],a[f+2]=r[f+2]}if(!e)return{position:r,normal:a,index:c};let p=new Float32Array(o*2);for(let f=0;f<o;f++)p[2*f+0]=Math.atan2(r[3*f+2],r[3*f])/(2*Math.PI)+.5,p[2*f+1]=Math.asin(r[3*f+1])/Math.PI+.5;const E=[...p],v=[...r],y=[...a];let g=p.length/2-1;for(let f=0;f<c.length/3;f++){const m=c[f*3],T=c[f*3+1],x=c[f*3+2],I=p[2*m],w=p[2*T],b=p[2*x],L=s.create(I,p[2*m+1],0),U=s.create(w,p[2*T+1],0),P=s.create(b,p[2*x+1],0);s.cross(s.subtract(U,L),s.subtract(P,L))[2]>0&&(I<.05||w<.05||b<.05)&&(v.push(r[3*m],r[3*m+1],r[3*m+2]),E.push(I+(I<.05?1:0),p[2*m+1]),y.push(a[3*m],a[3*m+1],a[3*m+2]),g++,c[f*3]=g,v.push(r[3*T],r[3*T+1],r[3*T+2]),y.push(a[3*T],a[3*T+1],a[3*T+2]),E.push(w+(w<.05?1:0),p[2*T+1]),g++,c[f*3+1]=g,v.push(r[3*x],r[3*x+1],r[3*x+2]),E.push(b+(b<.05?1:0),p[2*x+1]),y.push(a[3*x],a[3*x+1],a[3*x+2]),g++,c[f*3+2]=g)}r=v,p=E,a=y;for(let f=0;f<p.length;f+=2)p[f+1]=1-p[f+1];return{position:r,normal:a,texCoord:p,index:c}}}const Y=O.Vec2,V=O.Vec3,q=O.Mat4,S=O.Qtn;class j{static get DEFAULT_DISTANCE(){return 5}static get DEFAULT_MIN_DISTANCE(){return 1}static get DEFAULT_MAX_DISTANCE(){return 10}static get DEFAULT_MOVE_SCALE(){return 2}constructor(t,e={}){this.target=t,this.distance=e.distance||j.DEFAULT_DISTANCE,this.minDistance=e.min||j.DEFAULT_MIN_DISTANCE,this.maxDistance=e.max||j.DEFAULT_MAX_DISTANCE,this.moveScale=e.move||j.DEFAULT_MOVE_SCALE,this.position=V.create(0,0,this.distance),this.center=V.create(0,0,0),this.upDirection=V.create(0,1,0),this.defaultPosition=V.create(0,0,this.distance),this.defaultCenter=V.create(0,0,0),this.defaultUpDirection=V.create(0,1,0),this.movePosition=V.create(0,0,0),this.rotateX=0,this.rotateY=0,this.scale=0,this.isDown=!1,this.prevPosition=Y.create(0,0),this.offsetPosition=Y.create(0,0),this.qt=S.create(),this.qtx=S.create(),this.qty=S.create(),this.mouseInteractionStart=this.mouseInteractionStart.bind(this),this.mouseInteractionMove=this.mouseInteractionMove.bind(this),this.mouseInteractionEnd=this.mouseInteractionEnd.bind(this),this.wheelScroll=this.wheelScroll.bind(this),this.target.addEventListener("mousedown",this.mouseInteractionStart,!1),this.target.addEventListener("mousemove",this.mouseInteractionMove,!1),this.target.addEventListener("mouseup",this.mouseInteractionEnd,!1),this.target.addEventListener("wheel",this.wheelScroll,!1),this.target.addEventListener("contextmenu",s=>{s.preventDefault()},!1)}setPosition(t){this.defaultPosition=t}mouseInteractionStart(t){this.isDown=!0;const e=this.target.getBoundingClientRect();this.prevPosition=Y.create(t.clientX-e.left,t.clientY-e.top)}mouseInteractionMove(t){if(this.isDown!==!0)return;const e=this.target.getBoundingClientRect(),s=e.width,n=e.height,i=t.clientX-e.left,o=t.clientY-e.top,r=1/Math.min(s,n);switch(this.offsetPosition=Y.create(i-this.prevPosition[0],o-this.prevPosition[1]),this.prevPosition=Y.create(i,o),t.buttons){case 1:this.rotateX+=this.offsetPosition[0]*r,this.rotateY+=this.offsetPosition[1]*r,this.rotateX=this.rotateX%1,this.rotateY=Math.min(Math.max(this.rotateY%1,-.25),.25);break;case 2:const a=V.create(this.offsetPosition[0],-this.offsetPosition[1],0),c=S.toVecIII(a,this.qt);this.movePosition[0]-=c[0]*r*this.moveScale,this.movePosition[1]-=c[1]*r*this.moveScale,this.movePosition[2]-=c[2]*r*this.moveScale;break}}mouseInteractionEnd(t){this.isDown=!1}wheelScroll(t){const e=t.wheelDelta;e>0?this.scale=-.5:e<0&&(this.scale=.5)}update(){const t=Math.PI*2,e=V.create(1,0,0),s=V.create(0,1,0);return this.scale*=.7,this.distance+=this.scale,this.distance=Math.min(Math.max(this.distance,this.minDistance),this.maxDistance),this.defaultPosition[2]=this.distance,S.identity(this.qt),S.identity(this.qtx),S.identity(this.qty),S.rotate(this.rotateX*t,s,this.qtx),S.toVecIII(e,this.qtx,e),S.rotate(this.rotateY*t,e,this.qty),S.multiply(this.qtx,this.qty,this.qt),S.toVecIII(this.defaultPosition,this.qt,this.position),S.toVecIII(this.defaultUpDirection,this.qt,this.upDirection),this.position[0]+=this.movePosition[0],this.position[1]+=this.movePosition[1],this.position[2]+=this.movePosition[2],this.center[0]=this.defaultCenter[0]+this.movePosition[0],this.center[1]=this.defaultCenter[1]+this.movePosition[1],this.center[2]=this.defaultCenter[2]+this.movePosition[2],q.lookAt(this.position,this.center,this.upDirection)}}var tt=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 texCoord;
uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    
    vPosition = (mMatrix * vec4(position, 1.0)).xyz;
    vNormal = normal;

    vTexCoord = texCoord;

    gl_Position = mvpMatrix * vec4(position, 1.0);
}`,et=`precision mediump float;

uniform sampler2D textureUnit;
uniform sampler2D textureUnit2;
uniform mat4 normalMatrix;
uniform float time;
uniform float progress;
varying vec3 vNormal;
varying vec2 vTexCoord;

const vec3 light = vec3(1.0, 2.0, 2.0);
vec2 mirrored(vec2 v) {
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m));
}

void main() {
    vec3 n = (normalMatrix * vec4(vNormal, 0.0)).xyz;

    vec2 newUV = (vTexCoord - vec2(0.5)) + vec2(0.5);
    vec4 noise = texture2D(textureUnit, mirrored(newUV + time * 0.04));
    float prog = progress * 0.8 - 0.05 + noise.g * 0.06;
    float intpl = pow(abs(smoothstep(0.0, 1.0, (prog * 2.0 - vTexCoord.y + 0.5))), 10.0);

    float d = dot(normalize(n), normalize(light)) * 0.7;

    vec4 t1 = texture2D(textureUnit, (newUV - 0.5) * (1.0 - intpl) + 0.5);
    vec4 t2 = texture2D(textureUnit2, (newUV - 0.5) * intpl + 0.5);

    gl_FragColor = mix(t1, t2, intpl) * vec4(vec3(d), 1.0);
}`;window.addEventListener("DOMContentLoaded",()=>{const N=new st;N.init(),N.load().then(()=>{N.setupGeometry(),N.setupLocation(),N.start()})},!1);class st{constructor(){this.canvas=null,this.gl=null,this.program=null,this.attributeLocations=null,this.attributeStride=null,this.uniformLocation=null,this.icosphereGeometry=null,this.icosphereVBO=null,this.icosphereIBO=null,this.startTime=null,this.camera=null,this.texture=null,this.textures=[],this.currentIdx=0,this.currentTexture,this.nextTexture,this.TIME_LIMIT=5,this.timePassed=0,this.timeLeft=this.TIME_LIMIT,this.timerInterval=null,this.previewIdx=2,this.isRender=!1,this.textureVisibility=!0,this.progress={value:0},this.isRunning=!1,this.resize=this.resize.bind(this),this.render=this.render.bind(this),this.next=this.next.bind(this)}setCulling(t){const e=this.gl;e!=null&&(t?e.enable(e.CULL_FACE):e.disable(e.CULL_FACE))}setDepthTest(t){const e=this.gl;e!=null&&(t?e.enable(e.DEPTH_TEST):e.disable(e.DEPTH_TEST))}setTextureVisibility(t){this.textureVisibility=t}init(){this.canvas=document.getElementById("webgl-canvas"),this.gl=B.createWebGLContext(this.canvas);const t=O.Vec3,e={distance:4.5,min:1,max:10,move:2};this.camera=new j(this.canvas,e),this.camera.setPosition(t.create(0,1,e.distance)),this.resize(),window.addEventListener("resize",this.resize,!1),this.gl.enable(this.gl.DEPTH_TEST),this.setTimerOnActivePlanet()}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}load(){return new Promise((t,e)=>{const s=this.gl;if(s==null){const n=new Error("not initialized");e(n)}else{let n=B.createShaderObject(s,tt,s.VERTEX_SHADER),i=B.createShaderObject(s,et,s.FRAGMENT_SHADER);this.program=B.createProgramObject(s,n,i);const o={basePath:location.hostname==="localhost"||location.hostname==="127.0.0.1"?"":"/webglschool"};B.loadImages([`${o.basePath}/img/blue-marble.jpg`,`${o.basePath}/img/mars.jpg`,`${o.basePath}/img/jupiter.jpg`,`${o.basePath}/img/saturn.jpg`,`${o.basePath}/img/uranus.jpg`,`${o.basePath}/img/neptune.jpg`,`${o.basePath}/img/mercury.jpg`,`${o.basePath}/img/venus.jpg`]).then(r=>{this.textures=B.createTextures(s,r),this.currentTexture=this.textures[0],this.nextTexture=this.textures[1],t()})}})}setupGeometry(){this.icosphereGeometry=J.icosphere(4,!0),this.icosphereVBO=[B.createVBO(this.gl,this.icosphereGeometry.position),B.createVBO(this.gl,this.icosphereGeometry.normal),B.createVBO(this.gl,this.icosphereGeometry.texCoord)],this.icosphereIBO=B.createIBO(this.gl,this.icosphereGeometry.index)}setupLocation(){const t=this.gl;this.attributeLocation=[t.getAttribLocation(this.program,"position"),t.getAttribLocation(this.program,"normal"),t.getAttribLocation(this.program,"texCoord")],this.attributeStride=[3,3,2],this.uniformLocation={mMatrix:t.getUniformLocation(this.program,"mMatrix"),mvpMatrix:t.getUniformLocation(this.program,"mvpMatrix"),normalMatrix:t.getUniformLocation(this.program,"normalMatrix"),textureUnit:t.getUniformLocation(this.program,"textureUnit"),textureUnit2:t.getUniformLocation(this.program,"textureUnit2"),time:t.getUniformLocation(this.program,"time"),progress:t.getUniformLocation(this.program,"progress")}}setupRendering(){const t=this.gl;t.viewport(0,0,this.canvas.width,this.canvas.height),t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT)}setTimerOnActivePlanet(){const t=document.querySelector(".active");t&&(t.innerHTML=`
            <div class="base-timer">
                <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g class="base-timer__circle">
                        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="33" />
                        <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="207"
                        class="base-timer__path-remaining"
                        style="color: white"
                        d="
                            M 50, 50
                            m -33, 0
                            a 33,33 0 1,0 66,0
                            a 33,33 0 1,0 -66,0
                        "
                        ></path>
                    </g>
                </svg>
            </div>
        `)}calclulateTimeFraction(){const t=this.timeLeft/this.TIME_LIMIT;return t-1/this.TIME_LIMIT*(1-t)}setCircleDasharray(){const t=2*Math.PI*33,e=`${(this.calclulateTimeFraction()*t).toFixed(0)} 207`;document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray",e)}startTimer(){this.timerInterval&&clearInterval(this.timerInterval),this.timerInterval=setInterval(()=>{this.timePassed=this.timePassed+=1,this.timeLeft=this.TIME_LIMIT-this.timePassed,this.setCircleDasharray(),this.timeLeft<=0&&(clearInterval(this.timerInterval),this.timerInterval=null)},1e3)}start(){this.startTime=Date.now(),this.isRender=!0,this.startTimer(),this.render()}stop(){this.isRender=!1}next(){if(this.isRunning)return;this.isRunning=!0;let t=this.textures.length,e=this.textures[(this.currentIdx+1)%t];this.nextTexture=e,Z.timeline().to(this.progress,1,{value:1,ease:"power2.easeInOut",onComplete:()=>{this.currentIdx=(this.currentIdx+1)%t,this.currentTexture=e,this.progress.value=0,this.isRunning=!1}})}render(){const t=this.gl,e=O.Mat4,s=O.Vec3;this.isRender&&requestAnimationFrame(this.render);let n=this.startTime;const i=(Date.now()-this.startTime)*1e-4,o=Date.now();if((o-n)*.001>=1e3&&(this.timePassed+=1,this.timeLeft=this.TIME_LIMIT-this.timePassed,this.setCircleDasharray(),n=o),this.timeLeft<=0){this.timePassed=0,this.timeLeft=this.TIME_LIMIT,this.previewIdx=(this.previewIdx+1)%this.textures.length;let y=document.querySelector(".active");y.classList.remove("active"),y.innerHTML="",document.querySelectorAll(".ring")[this.previewIdx].classList.add("active"),this.setTimerOnActivePlanet(),this.startTimer(),this.next()}this.setupRendering();const a=e.rotate(e.identity(),i,s.create(0,1,0)),c=this.camera.update(),h=45,l=this.canvas.width/this.canvas.height,u=.1,d=10,M=e.perspective(h,l,u,d),p=e.multiply(M,c),E=e.multiply(p,a),v=e.transpose(e.inverse(a));t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.currentTexture),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.nextTexture),t.useProgram(this.program),t.uniformMatrix4fv(this.uniformLocation.mvpMatrix,!1,E),t.uniformMatrix4fv(this.uniformLocation.normalMatrix,!1,v),t.uniform1i(this.uniformLocation.textureUnit,0),t.uniform1i(this.uniformLocation.textureUnit2,1),t.uniform1f(this.uniformLocation.time,i),t.uniform1f(this.uniformLocation.progress,this.progress.value),B.enableBuffer(t,this.icosphereVBO,this.attributeLocation,this.attributeStride,this.icosphereIBO),t.drawElements(t.TRIANGLES,this.icosphereGeometry.index.length,t.UNSIGNED_SHORT,0)}}
