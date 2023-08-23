import { WebGLUtility } from "./webgl.js";
import { WebGLMath } from "./math.js";
import { WebGLGeometry } from "./geometry.js";
import { WebGLOrbitCamera } from "./camera.js";
import gsap from "gsap";
import { Pane } from "tweakpane";

import vertexShaderSource from "/@shaders/assgn08/render.vert";
import fragmentShaderSource from "/@shaders/assgn08/render.frag";
import offscreenVertexShaderSource from "/@shaders/assgn08/offscreen.vert";
import offscreenFragmentShaderSource from "/@shaders/assgn08/offscreen.frag";

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
    this.renderProgram = null;
    this.offscreenProgram = null;

    /** Array to hold attribute locations
     * @type {Array.<number>} */
    this.renderAttLocation = null;
    this.offscreenAttLocation = null;

    /** Array of attribute stride
     * @type {Array.<number>}
     */
    this.renderAttStride = null;
    this.offscreenAttStride = null;

    /** Object to hold uniform locations
     * @type {object.<WebGLUniformLocation>}
     */
    this.renderUniLocation = null;
    this.offscreenUniLocation = null;

    /** Object of plane geometry
     * @type {object}
     */
    this.planeGeometry = null;
    this.offscreenPlaneGeometry = null;

    /** Arry of plane VBO
     * @type {Array.<WebGLBuffer>}
     */
    this.planeVBO = null;
    this.offscreenPlaneVBO = null;

    /** sphere plane IBO
     * @type {WebGLBuffer}
     */
    this.planeIBO = null;
    this.offscreenPlaneIBO = null;

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

    /**
     * Frame buffer object
     * @type {object}
     */
    this.framebufferObject = null;

    /**
     * Frame buffer texture
     * @type {WebGLTexture}
     */
    this.framebufferSize = 512;

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

    const v3 = WebGLMath.Vec3;

    // Create instances of camera control
    const cameraOption = {
      distance: 4.5,
      min: 1.0,
      max: 10.0,
      move: 2.0,
    };
    this.camera = new WebGLOrbitCamera(this.canvas, cameraOption);

    // Create frame buffer object
    this.framebufferObject = WebGLUtility.createFramebuffer(
      this.gl,
      this.framebufferSize,
      this.framebufferSize
    );

    // Resize canvas
    this.resize();

    // Resize event
    window.addEventListener("resize", this.resize, false);

    // Activate depth test
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  /** Resize canvas */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Update frame buffer
    if (this.framebufferObject != null) {
      WebGLUtility.deleteFramebuffer(
        this.gl,
        this.framebufferObject.framebuffer,
        this.framebufferObject.renderbuffer,
        this.framebufferObject.texture
      );
    }

    this.framebufferObject = WebGLUtility.createFramebuffer(
      this.gl,
      this.canvas.width,
      this.canvas.height
    );
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
        this.renderProgram = WebGLUtility.createProgramObject(gl, vs, fs);

        vs = WebGLUtility.createShaderObject(
          gl,
          offscreenVertexShaderSource,
          gl.VERTEX_SHADER
        );
        fs = WebGLUtility.createShaderObject(
          gl,
          offscreenFragmentShaderSource,
          gl.FRAGMENT_SHADER
        );
        this.offscreenProgram = WebGLUtility.createProgramObject(gl, vs, fs);

        const config = {
          basePath:
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1"
              ? ""
              : "/webglschool",
        };

        WebGLUtility.loadImage(`${config.basePath}/img/space.jpg`).then(
          (image) => {
            this.texture = WebGLUtility.createTexture(gl, image);
            resolve();
          }
        );
      }
    });
  }

  /** Set up geometry */
  setupGeometry() {
    const color = [1.0, 1.0, 1.0, 1.0];
    const size = 2.0;

    // Create plane for render program
    this.planeGeometry = WebGLGeometry.plane(size, size, color);
    this.planeVBO = [
      WebGLUtility.createVBO(this.gl, this.planeGeometry.position),
      WebGLUtility.createVBO(this.gl, this.planeGeometry.texCoord),
    ];
    this.planeIBO = WebGLUtility.createIBO(this.gl, this.planeGeometry.index);

    // Create plane for offscreen program
    this.offscreenPlaneGeometry = WebGLGeometry.plane(size * 2, size, color);
    this.offscreenPlaneVBO = [
      WebGLUtility.createVBO(this.gl, this.offscreenPlaneGeometry.position),
      WebGLUtility.createVBO(this.gl, this.offscreenPlaneGeometry.texCoord),
    ];
    this.offscreenPlaneIBO = WebGLUtility.createIBO(
      this.gl,
      this.offscreenPlaneGeometry.index
    );
  }

  /** Set up Attribute Location */
  setupLocation() {
    const gl = this.gl;

    // Get attribute locations
    this.renderAttLocation = [
      gl.getAttribLocation(this.renderProgram, "position"),
      gl.getAttribLocation(this.renderProgram, "texCoord"),
    ];

    // attribute stride
    this.renderAttStride = [3, 2];

    // Get uniform location
    this.renderUniLocation = {
      textureUnit: gl.getUniformLocation(this.renderProgram, "textureUnit"),
    };

    // Set up offscreen locations
    this.offscreenAttLocation = [
      gl.getAttribLocation(this.offscreenProgram, "position"),
      gl.getAttribLocation(this.offscreenProgram, "texCoord"),
    ];
    this.offscreenAttStride = [3, 3, 2, 4];
    this.offscreenUniLocation = {
      mvpMatrix: gl.getUniformLocation(this.offscreenProgram, "mvpMatrix"),
      normalMatrix: gl.getUniformLocation(
        this.offscreenProgram,
        "normalMatrix"
      ),
      textureUnit: gl.getUniformLocation(this.offscreenProgram, "textureUnit"),
    };
  }

  /** Set up rendering */
  setupRendering() {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.renderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.framebufferObject.texture);
  }

  setupOffscreenRendering() {
    const gl = this.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebufferObject.framebuffer);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.clearColor(1.0, 0.6, 0.9, 1.0);
    gl.clearDepth(1.0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.offscreenProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
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

    const nowTime = (Date.now() - this.startTime) * 0.0001;

    // Set up offscreen rendering
    {
      this.setupOffscreenRendering();

      const v = this.camera.update();
      const fovy = 45;
      const aspect = window.innerWidth / window.innerHeight;
      const near = 0.1;
      const far = 10.0;
      const p = m4.perspective(fovy, aspect, near, far);

      const vp = m4.multiply(p, v);
      let m = m4.translate(m4.identity(), v3.create(0.0, -1.0, 0.0));

      const mvp = m4.multiply(vp, m);
      const normalMatrix = m4.transpose(m4.inverse(m));

      WebGLUtility.enableBuffer(
        gl,
        this.offscreenPlaneVBO,
        this.offscreenAttLocation,
        this.offscreenAttStride,
        this.offscreenPlaneIBO
      );
      gl.uniformMatrix4fv(this.offscreenUniLocation.mvpMatrix, false, mvp);
      gl.uniform1i(this.offscreenUniLocation.textureUnit, 0);
      gl.drawElements(
        gl.TRIANGLES,
        this.offscreenPlaneGeometry.index.length,
        gl.UNSIGNED_SHORT,
        0
      );
    }

    {
      // Set up rendering
      this.setupRendering();

      WebGLUtility.enableBuffer(
        gl,
        this.planeVBO,
        this.renderAttLocation,
        this.renderAttStride,
        this.planeIBO
      );
      gl.uniform1i(this.renderUniLocation.textureUnit, 0);
      gl.drawElements(
        gl.TRIANGLES,
        this.planeGeometry.index.length,
        gl.UNSIGNED_SHORT,
        0
      );
    }
  }
}
