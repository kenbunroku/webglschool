import { WebGLUtility } from './webgl.js'
import * as dat from 'lil-gui'

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const app = new App()
    app.init()
    app.load().then(() => {
      app.setupGeometry()
      app.setupLocation()
      app.start()
    })
  },
  false,
)

class App {
  constructor() {
    this.canvas = null
    this.gl = null

    this.program = null

    this.uniformLocation = null

    this.positionArray = null
    this.positionStride = null

    this.params = {
      petals: 5.0,
      width: 0.5,
      numOfQuads: 5.0,
      power: 3.0,
    }

    this.color = null
    this.colorStride = null
    this.colorVBO = null

    this.startTime = null

    this.isRender = false

    this.render = this.render.bind(this)
  }

  init() {
    this.canvas = document.getElementById('webgl-canvas')
    this.gl = WebGLUtility.createWebGLContext(this.canvas)

    const size = Math.min(window.innerWidth, window.innerHeight)
    this.canvas.width = size
    this.canvas.height = size

    // gui
    const gui = new dat.GUI()
    gui
      .add(this.params, 'petals', 1.0, 10.0)
      .step(1.0)
      .onChange(() => this.setupGeometry())
    gui.add(this.params, 'width', 0.0, 1.0).onChange(() => this.setupGeometry())
    gui
      .add(this.params, 'numOfQuads', 2.0, 20.0)
      .step(1.0)
      .onChange(() => this.setupGeometry())
    gui
      .add(this.params, 'power', 0.01, 10.0)
      .step(0.01)
      .onChange(() => this.setupGeometry())
  }

  load() {
    return new Promise((resolve, reject) => {
      const gl = this.gl

      if (gl == null) {
        const error = new Error('not initialized')
        reject(error)
      } else {
        let vs = null
        let fs = null
        WebGLUtility.loadFile('./shader/main.vert')
          .then((vertexShaderSource) => {
            vs = WebGLUtility.createShaderObject(
              gl,
              vertexShaderSource,
              gl.VERTEX_SHADER,
            )
            return WebGLUtility.loadFile('./shader/main.frag')
          })
          .then((fragmentShaderSource) => {
            fs = WebGLUtility.createShaderObject(
              gl,
              fragmentShaderSource,
              gl.FRAGMENT_SHADER,
            )
            this.program = WebGLUtility.createProgramObject(gl, vs, fs)

            resolve()
          })
      }
    })
  }

  setupGeometry() {
    const numOfQuads = this.params.numOfQuads
    const petals = this.params.petals
    const dr = 1 / numOfQuads
    const rasArray = []
    const vertices = []
    this.positionArray = []

    for (let i = 0; i < petals; i++) {
      let a = ((2 * Math.PI) / petals) * i
      for (let j = 0; j < numOfQuads; j++) {
        let r = j / numOfQuads
        rasArray.push([r, a, 0], [r + dr, a, 0], [r, a, -1])
        rasArray.push([r, a, 0], [r + dr, a, 0], [r, a, +1])
        rasArray.push([r + dr, a, 0], [r, a, -1], [r + dr, a, -1])
        rasArray.push([r + dr, a, 0], [r, a, +1], [r + dr, a, +1])
      }
    }

    for (let ras of rasArray) {
      const radius = ras[0]
      const w = 1.0 - Math.pow(radius, this.params.power)
      let angle = ras[1] + this.params.width * w * ras[2]

      vertices.push([
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        ras[2],
      ])
    }

    const count = vertices.length / 3
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const vertex1 = vertices[i3]
      const vertex2 = vertices[i3 + 1]
      const vertex3 = vertices[i3 + 2]

      // combine vertices
      const position = [].concat(vertex1, vertex2, vertex3)

      this.positionArray.push(position)
    }

    this.positionStride = 3

    this.color = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]
    this.colorStride = 4
    this.colorVBO = WebGLUtility.createVBO(this.gl, this.color)
  }

  setupLocation() {
    const gl = this.gl

    this.uniformLocation = {
      time: gl.getUniformLocation(this.program, 'time'),
    }
  }

  setupRendering() {
    const gl = this.gl
    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clear(0.3, 0.3, 0.3, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  start() {
    this.startTime = Date.now()
    this.isRender = true
    this.render()
  }

  render() {
    const gl = this.gl

    if (this.isRender === true) {
      requestAnimationFrame(this.render)
    }

    this.setupRendering()

    const nowTime = (Date.now() - this.startTime) * 0.001
    gl.useProgram(this.program)

    gl.uniform1f(this.uniformLocation.time, nowTime)

    for (let i = 0; i < this.positionArray.length; i++) {
      const position = this.positionArray[i]
      const positionVBO = WebGLUtility.createVBO(this.gl, position)
      const attPosition = gl.getAttribLocation(this.program, 'position')
      const attColor = gl.getAttribLocation(this.program, 'color')

      WebGLUtility.enableAttribute(
        gl,
        positionVBO,
        attPosition,
        this.positionStride,
      )
      WebGLUtility.enableAttribute(
        gl,
        this.colorVBO,
        attColor,
        this.colorStride,
      )

      gl.drawArrays(gl.TRIANGLES, 0, position.length / this.positionStride)
    }
  }
}
