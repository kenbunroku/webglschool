import { WebGLUtility } from "./webgl.js";
import { WebGLMath } from "./math.js";
import { WebGLGeometry } from "./geometry.js";
import { WebGLOrbitCamera } from "./camera.js";
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

    // Gui with teakpane
    const pane = new Pane();
    const parameter = {
      texture: true,
    };

    // Turn on/off texture
    pane.addInput(parameter, "texture").on("change", (event) => {
      app.setTextureVisibility(event.value);
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

    /** Object of plane geometry
     * @type {object}
     */
    this.planeGeometry = null;

    /** Arry of plane VBO
     * @type {Array.<WebGLBuffer>}
     */
    this.planeVBO = null;

    /** Plane geometry IBO
     * @type {WebGLBuffer}
     */
    this.planeIBO = null;

    this.icosphereGeometry = null;
    this.icosphereVBO = null;
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

    /** Flag for render
     * @type {boolean}
     */
    this.isRender = false;

    /** Texture visibility
     * @type {boolean}
     */
    this.textureVisibility = true;

    // Bind to fix this
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
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

    // Create instances of camera control
    const cameraOption = {
      distance: 5.0,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);

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

        WebGLUtility.loadImage("/img/blue-marble.jpg").then((image) => {
          this.texture = WebGLUtility.createTexture(gl, image);
          resolve();
        });
      }
    });
  }

  /** Set up geometry */
  setupGeometry() {
    // Create isosphere geometry
    const order = 4;
    const color = [1.0, 1.0, 1.0, 1.0];
    this.icosphereGeometry = WebGLGeometry.icosphere(order, color, true);

    // Create VBO and IBO\
    this.icosphereVBO = [
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.position),
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.normal),
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.color),
      WebGLUtility.createVBO(this.gl, this.icosphereGeometry.texCoord),
    ];
    this.icosphereIBO = WebGLUtility.createIBO(
      this.gl,
      this.icosphereGeometry.index
    );
    console.log(this.icosphereGeometry)
  }

  /** Set up Attribute Location */
  setupLocation() {
    const gl = this.gl;

    // Get attribute locations
    this.attributeLocation = [
      gl.getAttribLocation(this.program, "position"),
      gl.getAttribLocation(this.program, "normal"),
      gl.getAttribLocation(this.program, "color"),
      gl.getAttribLocation(this.program, "texCoord"),
    ];

    // attribute stride
    this.attributeStride = [3, 3, 4, 2];

    // Get uniform location
    this.uniformLocation = {
      mvpMatrix: gl.getUniformLocation(this.program, "mvpMatrix"),
      normalMatrix: gl.getUniformLocation(this.program, "normalMatrix"),
      textureUnit: gl.getUniformLocation(this.program, "textureUnit"),
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

  /** Start rendering */
  start() {
    // Get time stamp of start time
    this.startTime = Date.now();

    // Turn on render flag
    this.isRender = true;

    this.render();
  }

  /** Stop rendering */
  stop() {
    // Turn off render flag
    this.isRender = false;
  }

  /** Rendering function */
  render() {
    const gl = this.gl;
    const m4 = WebGLMath.Mat4;
    const v3 = WebGLMath.Vec3;

    // Call requestAnimationFrame when render flag is true
    if (this.isRender) requestAnimationFrame(this.render);

    // Get the elapsed time
    const nowTime = (Date.now() - this.startTiem) * 0.001;

    // Set up rendering
    this.setupRendering();

    // Model coordinate transformation matrix
    const m = m4.identity();

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
    if (this.textureVisibility) {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // Update uniform variables
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.uniformLocation.mvpMatrix, false, mvp);
    gl.uniformMatrix4fv(this.uniformLocation.normalMatrix, false, normalMatrix);
    gl.uniform1i(this.uniformLocation.textureUnit, this.texture);

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
