import { WebGLUtility } from "./webgl.js";
import { WebGLMath } from "./math.js";
import { WebGLGeometry } from "./geometry.js";
import { WebGLOrbitCamera } from "./camera.js";
import gsap from "gsap";
import { Pane } from "tweakpane";

import vertexShaderSource from "/@shaders/assgn07/main.vert";
import fragmentShaderSource from "/@shaders/assgn07/main.frag";

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
  },
  false
);

// App management class
class App {
  /** @constructor */
  constructor() {
    /** Canvas
     * @type {HTMLCanvasElement} */
    this.canvas = null;

    /** WebGL Context
     * @type {WebGLRenderingContext} */
    this.gl = null;

    /** Program object
     * @type {WebGLProgram} */
    this.program = null;

    /** Array to hold attribute locations
     * @type {Array.<number>} */
    this.attributeLocations = null;

    /** Array of attribute stride
     * @type {Array.<number>}
     */
    this.attributeStride = null;

    /** Object to hold uniform locations
     * @type {object.<WebGLUniformLocation>}
     */
    this.uniformLocation = null;

    /** Object of sphere geometry
     * @type {object}
     */
    this.icosphereGeometry = null;

    /** Arry of sphere VBO
     * @type {Array.<WebGLBuffer>}
     */
    this.icosphereVBO = null;

    /** sphere geometry IBO
     * @type {WebGLBuffer}
     */
    this.icosphereIBO = null;

    /** Time stamp of start time
     *    @type {number}
     */
    this.startTime = null;

    /** Instance of camera control
     * @type {WebGLOrbitCamera}
     */
    this.camera = null;

    /** Texture container
     * @type {WebGLTexture}
     */
    this.texture = null;
    this.textures = [];
    this.currentIdx = 0;
    this.currentTexture;
    this.nextTexture;

    this.TIME_LIMIT = 5;
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
    this.timerInterval = null;

    /** Flag for render
     * @type {boolean}
     */
    this.isRender = false;

    /** Texture visibility
     * @type {boolean}
     */
    this.textureVisibility = true;

    this.progress = { value: 0 };
    this.isRunning = false;

    // Bind to fix this
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.next = this.next.bind(this);

    // click event
    window.addEventListener("click", this.next, false);

    document.querySelector(".active").innerHTML = `
      <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="33" />
            <path
            id="base-timer-path-remaining"
            stroke-dasharray="207"
            class = "base-timer__path-remaining"
            style="color:"white"
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
    `;
  }

  /** Set up backface culling
   * @param {boolean} flag
   */
  setCulling(flag) {
    const gl = this.gl;
    if (gl == null) return;
    if (flag) {
      gl.enable(gl.CULL_FACE);
    } else {
      gl.disable(gl.CULL_FACE);
    }
  }

  /** Set up depth test
   * @param {boolean} flag
   */
  setDepthTest(flag) {
    const gl = this.gl;
    if (gl == null) return;
    if (flag) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }
  }

  /** Set up texture visibility
   * @param {boolean} flag
   */
  setTextureVisibility(flag) {
    this.textureVisibility = flag;
  }

  /** Initialization process */
  init() {
    // Get the canvas element and initialize the WebGL context
    this.canvas = document.getElementById("webgl-canvas");
    this.gl = WebGLUtility.createWebGLContext(this.canvas);

    const v3 = WebGLMath.Vec3;

    // Create instances of camera control
    const cameraOption = {
      distance: 4.5,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);
    this.camera.setPosition(v3.create(0.0, 1.0, cameraOption.distance));

    // Resize canvas
    this.resize();

    // Resize event
    window.addEventListener("resize", this.resize, false);

    // Activate depth test
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  /** Resize canvas */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Load resources */
  load() {
    return new Promise((resolve, reject) => {
      const gl = this.gl;
      if (gl == null) {
        const error = new Error("not initialized");
        reject(error);
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

        WebGLUtility.loadImages([
          "/img/blue-marble.jpg",
          "/img/mars.jpg",
          "/img/jupiter.jpg",
          "/img/saturn.jpg",
          "/img/uranus.jpg",
          "/img/neptune.jpg",
          "/img/mercury.jpg",
          "/img/venus.jpg",
        ]).then((images) => {
          this.textures = WebGLUtility.createTextures(gl, images);
          // Set texture
          this.currentTexture = this.textures[0];
          this.nextTexture = this.textures[1];
          resolve();
        });
      }
    });
  }

  /** Set up geometry */
  setupGeometry() {
    // Create isosphere geometry
    const order = 4;

    this.icosphereGeometry = WebGLGeometry.icosphere(order, true);

    // Create VBO and IBO\
    this.icosphereVBO = [
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.position),
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.normal),
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.texCoord),
    ];
    this.icosphereIBO = WebGLUtility.createIBO(
      this.gl,
      this.icosphereGeometry.index
    );
  }

  /** Set up Attribute Location */
  setupLocation() {
    const gl = this.gl;

    // Get attribute locations
    this.attributeLocation = [
      gl.getAttribLocation(this.program, "position"),
      gl.getAttribLocation(this.program, "normal"),
      gl.getAttribLocation(this.program, "texCoord"),
    ];

    // attribute stride
    this.attributeStride = [3, 3, 2];

    // Get uniform location
    this.uniformLocation = {
      mMatrix: gl.getUniformLocation(this.program, "mMatrix"),
      mvpMatrix: gl.getUniformLocation(this.program, "mvpMatrix"),
      normalMatrix: gl.getUniformLocation(this.program, "normalMatrix"),
      textureUnit: gl.getUniformLocation(this.program, "textureUnit"),
      textureUnit2: gl.getUniformLocation(this.program, "textureUnit2"),
      time: gl.getUniformLocation(this.program, "time"),
      progress: gl.getUniformLocation(this.program, "progress"),
    };
  }

  /** Set up rendering */
  setupRendering() {
    const gl = this.gl;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  calclulateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const FULL_DASH_ARRAY = 2 * Math.PI * 33;
    const circleDasharray = `${(
      this.calclulateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 207`;

    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;

      if (this.timeLeft === 0) {
        clearInterval(this.timerInterval);
        this.timePassed = 0;
        this.timeLeft = this.TIME_LIMIT;
      }
      this.timeLeft = this.TIME_LIMIT - this.timePassed;

      this.setCircleDasharray();
    }, 1000);
  }

  /** Start rendering */
  start() {
    // Get time stamp of start time
    this.startTime = Date.now();

    // Turn on render flag
    this.isRender = true;

    setInterval(() => {
      this.next();
    }, this.TIME_LIMIT * 1000 + 1000);

    this.startTimer();

    this.render();
  }

  /** Stop rendering */
  stop() {
    // Turn off render flag
    this.isRender = false;
  }

  next() {
    if (this.isRunning) return;
    this.isRunning = true;
    let len = this.textures.length;
    let nextTexture = this.textures[(this.currentIdx + 1.0) % len];
    this.nextTexture = nextTexture;
    let tl = gsap.timeline();
    tl.to(this.progress, 1, {
      value: 1.0,
      ease: "power2.easeInOut",
      onComplete: () => {
        this.currentIdx = (this.currentIdx + 1) % len;
        this.currentTexture = nextTexture;
        this.progress.value = 0.0;
        this.isRunning = false;
        this.startTimer();
      },
    });
  }

  /** Rendering function */
  render() {
    const gl = this.gl;
    const m4 = WebGLMath.Mat4;
    const v3 = WebGLMath.Vec3;

    // Call requestAnimationFrame when render flag is true
    if (this.isRender) requestAnimationFrame(this.render);

    // Get the elapsed time
    const nowTime = (Date.now() - this.startTime) * 0.0001;

    // Set up rendering
    this.setupRendering();

    // Model coordinate transformation matrix
    const m = m4.rotate(m4.identity(), nowTime, v3.create(0.0, 1.0, 0.0));

    // View and projection coordinate transformation matrix
    const v = this.camera.update();
    const fovy = 45;
    const aspect = this.canvas.width / this.canvas.height;
    const near = 0.1;
    const far = 10.0;
    const p = m4.perspective(fovy, aspect, near, far);

    // Model-view-projection matrix
    const vp = m4.multiply(p, v);
    const mvp = m4.multiply(vp, m);

    // Normal matrix
    const normalMatrix = m4.transpose(m4.inverse(m));

    // Bine texture to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.currentTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.nextTexture);

    // Update uniform variables
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniformLocation.mvpMatrix, false, mvp);
    gl.uniformMatrix4fv(this.uniformLocation.normalMatrix, false, normalMatrix);
    gl.uniform1i(this.uniformLocation.textureUnit, 0);
    gl.uniform1i(this.uniformLocation.textureUnit2, 1);
    gl.uniform1f(this.uniformLocation.time, nowTime);
    gl.uniform1f(this.uniformLocation.progress, this.progress.value);

    // Set VBO and IBO and draw geometry
    WebGLUtility.enableBuffer(
      gl,
      this.icosphereVBO,
      this.attributeLocation,
      this.attributeStride,
      this.icosphereIBO
    );
    gl.drawElements(
      gl.TRIANGLES,
      this.icosphereGeometry.index.length,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
