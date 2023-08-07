import { WebGLUtility } from "./webgl.js";
import { WebGLMath } from "./math.js";
import { WebGLGeometry } from "./geometry.js";
import { WebGLOrbitCamera } from "./camera.js";
// import { Pane } from "tweakpane";
import * as dat from "lil-gui";

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

    // // Set up tweakpane
    // const pane = new Pane();
    // const parameter = {
    //   culling: true,
    //   depthTest: true,
    //   rotation: false,
    // };

    // // Activate backface culling
    // pane.addInput(parameter, "culling").on("change", (v) => {
    //   app.setCulling(v.value);
    // });
    // // Activate depth test
    // pane.addInput(parameter, "depthTest").on("change", (v) => {
    //   app.setDepthTest(v.value);
    // });
    // // Activate rotation
    // pane.addInput(parameter, "rotation").on("change", (v) => {
    //   app.setRotation(v.value);
    // });
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

    this.isDirectionalLight = true;
    this.directionalLightColor = [1.0, 1.0, 1.0];
    this.intensity = 0.5;

    this.isPointLight1 = false;
    this.pointLightPosition1 = { x: 1.0, y: 1.0, z: 1.0 };
    this.pointLightColor1 = [0.0, 0.0, 0.0];

    this.isSpotLight = true;
    this.spotLightPosition = { x: 1.0, y: 2.0, z: 0.0 };
    this.spotLightTarget = { x: 0.0, y: 0.0, z: 0.0 };
    this.spotLightColor = [0.0, 0.0, 0.0];
    this.innerLimit = 10.0;
    this.outerLimit = 20.0;

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
    const vec3 = WebGLMath.Vec3;

    const cameraOption = {
      distance: 5.0,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);
    this.camera.setPosition(vec3.create(1.0, 2.0, 5.0));

    this.resize();

    window.addEventListener("resize", this.resize, false);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);

    // gui
    const gui = new dat.GUI();
    const directionalLightFolder = gui.addFolder("Directional Light");
    directionalLightFolder
      .add(this, "isDirectionalLight")
      .name("On/Off")
      .onChange((value) => {
        !value ? (this.intensity = 0.0) : (this.intensity = 0.5);
      });
    directionalLightFolder
      .addColor(this, "directionalLightColor")
      .name("Color");
    directionalLightFolder
      .add(this, "intensity", 0.0, 1.0)
      .name("Intensity")
      .onChange((value) => {
        this.isDirectionalLight
          ? (this.intensity = value)
          : (this.intensity = 0.0);
      });

    const pointLightFolder = gui.addFolder("Point Light");
    pointLightFolder.add(this, "isPointLight1").name("On/Off");

    pointLightFolder.add(this.pointLightPosition1, "x", -1, 1);
    pointLightFolder.add(this.pointLightPosition1, "y", -1, 1);
    pointLightFolder.add(this.pointLightPosition1, "z", -1, 1);

    const spotLightFolder = gui.addFolder("Spot Light");
    spotLightFolder.add(this, "isSpotLight").name("On/Off");
    spotLightFolder.add(this.spotLightTarget, "x", -1, 1).name("Target x");
    spotLightFolder.add(this.spotLightTarget, "y", -1, 1).name("Target y");
    spotLightFolder.add(this.spotLightTarget, "z", -1, 1).name("Target z");
    spotLightFolder.add(this.spotLightPosition, "x", -1, 1);
    spotLightFolder.add(this.spotLightPosition, "y", -1, 5);
    spotLightFolder.add(this.spotLightPosition, "z", -1, 1);
    spotLightFolder.add(this, "innerLimit", 1, 90);
    spotLightFolder.add(this, "outerLimit", 1, 90);
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
      this.sphereGeometry.position[i] += 2.0;
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
      pointLightPosition1: gl.getUniformLocation(
        this.program,
        "pointLightPosition1"
      ),
      intensity: gl.getUniformLocation(this.program, "intensity"),
      pointLightPosition2: gl.getUniformLocation(
        this.program,
        "pointLightPosition2"
      ),
      spotLightPosition: gl.getUniformLocation(
        this.program,
        "spotLightPosition"
      ),
      spotLightTarget: gl.getUniformLocation(this.program, "spotLightTarget"),
      directionalLightColor: gl.getUniformLocation(
        this.program,
        "directionalLightColor"
      ),
      pointLightColor1: gl.getUniformLocation(this.program, "pointLightColor1"),
      spotLightColor: gl.getUniformLocation(this.program, "spotLightColor"),
      innerLimit: gl.getUniformLocation(this.program, "innerLimit"),
      outerLimit: gl.getUniformLocation(this.program, "outerLimit"),
    };
  }

  setupRendering() {
    const gl = this.gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

    this.isPointLight1
      ? (this.pointLightColor1 = [1.0, 0.0, 0.0])
      : (this.pointLightColor1 = [0.0, 0.0, 0.0]);

    this.isSpotLight
      ? (this.spotLightColor = [0.0, 1.0, 0.0])
      : (this.spotLightColor = [0.0, 0.0, 0.0]);

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

    // Light position
    const pointLightPosition1 = v3.create(
      this.pointLightPosition1.x,
      this.pointLightPosition1.y,
      this.pointLightPosition1.z
    );
    const pointLightPosition2 = v3.create(-1.0, 1.0, 1.0);
    const spotLightPosition = v3.create(
      this.spotLightPosition.x,
      this.spotLightPosition.y,
      this.spotLightPosition.z
    );

    const spotLightTarget = v3.create(
      this.spotLightTarget.x,
      this.spotLightTarget.y,
      this.spotLightTarget.z
    );

    const innerRadians = (this.innerLimit * Math.PI) / 180.0;
    const outerRadians = (this.outerLimit * Math.PI) / 180.0;

    // Update uniform variables
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniformLocation.mvpMatrix, false, mvp);
    gl.uniformMatrix4fv(this.uniformLocation.normalMatrix, false, normalMatrix);
    gl.uniform1f(this.uniformLocation.intensity, this.intensity);
    gl.uniform3fv(
      this.uniformLocation.pointLightPosition1,
      pointLightPosition1
    );
    gl.uniform3fv(
      this.uniformLocation.pointLightPosition2,
      pointLightPosition2
    );
    gl.uniform3fv(this.uniformLocation.spotLightPosition, spotLightPosition);
    gl.uniform3fv(this.uniformLocation.spotLightTarget, spotLightTarget);
    gl.uniform3fv(
      this.uniformLocation.directionalLightColor,
      this.directionalLightColor
    );
    gl.uniform3fv(this.uniformLocation.pointLightColor1, this.pointLightColor1);
    gl.uniform3fv(this.uniformLocation.spotLightColor, this.spotLightColor);
    gl.uniform1f(this.uniformLocation.innerLimit, Math.cos(innerRadians));
    gl.uniform1f(this.uniformLocation.outerLimit, Math.cos(outerRadians));

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
