import { WebGLUtility } from "./webgl.js";
import { WebGLMath } from "./math.js";
import { WebGLGeometry } from "./geometry.js";
import { WebGLOrbitCamera } from "./camera.js";
import { Pane } from "tweakpane";

import vertexShaderSource from "/@shaders/assgn06/main.vert";
import fragmentShaderSource from "/@shaders/assgn06/main.frag";

window.addEventListener(
  "DOMContentLoaded",
  () => {
    const app = new App();
    app.init();
    app.load().then(() => {
      app.setupGeometry();
      app.setupLocation();
      app.start();
    });

    // Set up tweakpane
    const pane = new Pane();
    const parameter = {
      culling: true,
      depthTest: true,
      rotation: false,
    };

    // Activate backface culling
    pane.addInput(parameter, "culling").on("change", (v) => {
      app.setCulling(v.value);
    });
    // Activate depth test
    pane.addInput(parameter, "depthTest").on("change", (v) => {
      app.setDepthTest(v.value);
    });
    // Activate rotation
    pane.addInput(parameter, "rotation").on("change", (v) => {
      app.setRotation(v.value);
    });
  },
  false
);

// App management class
class App {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.attributeLocation = null;
    this.attributeStride = null;
    this.uniformLocation = null;
    this.torusGeometry = null;
    this.torusVBO = null;
    this.torusIBO = null;
    this.sphereGeometry = null;
    this.sphereVBO = null;
    this.sphereIBO = null;
    this.startTime = null;
    this.camera = null;
    this.isRender = false;
    this.isRotation = false;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
  }

  setCulling(flag) {
    const gl = this.gl;
    if (gl == null) return;
    if (flag === true) {
      gl.enable(gl.CULL_FACE);
    } else {
      gl.disable(gl.CULL_FACE);
    }
  }

  setDepthTest(flag) {
    const gl = this.gl;
    if (gl == null) return;
    if (flag === true) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  }

  setRotation(flag) {
    this.isRotation = flag;
  }

  init() {
    this.canvas = document.getElementById("webgl-canvas");
    this.gl = WebGLUtility.createWebGLContext(this.canvas);

    const cameraOption = {
      distance: 5.0,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);

    this.resize();

    window.addEventListener("resize", this.resize, false);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  load() {
    return new Promise((resolve, reject) => {
      const gl = this.gl;
      if (gl == null) {
        const err = new Error("not initialized");
        reject(err);
      } else {
        let vs = WebGLUtility.createShaderObject(
          gl,
          vertexShaderSource,
          gl.VERTEX_SHADER
        );
        let fs = WebGLUtility.createShaderObject(
          gl,
          fragmentShaderSource,
          gl.FRAGMENT_SHADER
        );
        this.program = WebGLUtility.createProgramObject(gl, vs, fs);
        resolve();
      }
    });
  }

  setupGeometry() {
    // Get parameters
    const row = 32;
    const column = 32;
    const innerRadius = 0.4;
    const outerRadius = 0.8;
    const color = [1.0, 1.0, 1.0, 1.0];
    this.torusGeometry = WebGLGeometry.torus(
      row,
      column,
      innerRadius,
      outerRadius,
      color
    );

    // Generate VBO and IBO
    this.torusVBO = [
      WebGLUtility.createVBO(this.gl, this.torusGeometry.position),
      WebGLUtility.createVBO(this.gl, this.torusGeometry.normal),
      WebGLUtility.createVBO(this.gl, this.torusGeometry.color),
    ];
    this.torusIBO = WebGLUtility.createIBO(this.gl, this.torusGeometry.index);

    // Get sphere parameters
    const latitude = 32;
    const longitude = 32;
    const radius = 0.05;
    const color2 = [1.0, 0.0, 0.0, 1.0];
    this.sphereGeometry = WebGLGeometry.sphere(
      latitude,
      longitude,
      radius,
      color2
    );
    for (let i = 0; i < this.sphereGeometry.position.length; i++) {
      this.sphereGeometry.position[i] += 1.0;
    }
    // Generate VBO and IBO
    this.sphereVBO = [
      WebGLUtility.createVBO(this.gl, this.sphereGeometry.position),
      WebGLUtility.createVBO(this.gl, this.sphereGeometry.normal),
      WebGLUtility.createVBO(this.gl, this.sphereGeometry.color),
    ];
    this.sphereIBO = WebGLUtility.createIBO(this.gl, this.sphereGeometry.index);
  }

  setupLocation() {
    const gl = this.gl;

    // Get attribute location
    this.attributeLocation = [
      gl.getAttribLocation(this.program, "position"),
      gl.getAttribLocation(this.program, "normal"),
      gl.getAttribLocation(this.program, "color"),
    ];

    // Get attribute stride
    this.attributeStride = [3, 3, 4];

    // Get uniform location
    this.uniformLocation = {
      mvpMatrix: gl.getUniformLocation(this.program, "mvpMatrix"),
      normalMatrix: gl.getUniformLocation(this.program, "normalMatrix"),
    };
  }

  setupRendering() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  start() {
    this.startTime = Date.now();
    this.isRender = true;
    this.render();
  }

  stop() {
    this.isRender = false;
  }

  render() {
    const gl = this.gl;
    const m4 = WebGLMath.Mat4;
    const v3 = WebGLMath.Vec3;

    if (this.isRender === true) requestAnimationFrame(this.render);

    // Delta time
    const nowTime = (Date.now() - this.startTime) * 0.001;

    // Set rendering settings
    this.setupRendering();

    // Rotation
    const rotateAxis = v3.create(0.0, 1.0, 0.0);
    const m =
      this.isRotation === true
        ? m4.rotate(m4.identity(), nowTime, rotateAxis)
        : m4.identity();

    // View projection matrix
    const v = this.camera.update();
    const fovy = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10.0;
    const p = m4.perspective(fovy, aspect, near, far);

    // Model view projection matrix
    const vp = m4.multiply(p, v);
    const mvp = m4.multiply(vp, m);

    // Normal matrix
    const normalMatrix = m4.transpose(m4.inverse(m));

    // Update uniform variables
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniformLocation.mvpMatrix, false, mvp);
    gl.uniformMatrix4fv(this.uniformLocation.normalMatrix, false, normalMatrix);

    // Set up VBO and IBO and draw
    WebGLUtility.enableBuffer(
      gl,
      this.torusVBO,
      this.attributeLocation,
      this.attributeStride,
      this.torusIBO
    );
    gl.drawElements(
      gl.TRIANGLES,
      this.torusGeometry.index.length,
      gl.UNSIGNED_SHORT,
      0
    );

    // Set up VBO and IBO and draw
    WebGLUtility.enableBuffer(
      gl,
      this.sphereVBO,
      this.attributeLocation,
      this.attributeStride,
      this.sphereIBO
    );
    gl.drawElements(
      gl.TRIANGLES,
      this.sphereGeometry.index.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
