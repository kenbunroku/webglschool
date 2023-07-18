import { WebGLUtility } from './webgl.js'

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

    this.potisionArryay = null
    this.positionStride = null

    this.petals = null
    this.numOfQuads = null
    this.width = null
    this.power = null

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
    const center = [0.0, 0.0, 0.0]
    const numOfPoints = 6
    const radius = 0.1 + Math.random() * 0.1
    const radian = (360 / numOfPoints) * (Math.PI / 180)
    this.positionArray = []

    for (let i = 0; i < numOfPoints; i++) {
      const position = []
      const x = radius * Math.cos(radian * i) + center[0]
      const y = radius * Math.sin(radian * i) + center[1]
      const z = center[2]

      const x2 = radius * Math.cos(radian * (i + 1)) + center[0]
      const y2 = radius * Math.sin(radian * (i + 1)) + center[1]
      const z2 = center[2]

      position.push(center[0], center[1], center[2])
      position.push(x, y, z)
      position.push(x2, y2, z2)
      const positionVBO = WebGLUtility.createVBO(this.gl, position)

      this.positionArray.push({ position: position, positionVBO: positionVBO })
    }

    this.positionStride = 3

    this.color = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]
    this.colorStride = 4
    this.colorVBO = WebGLUtility.createVBO(this.gl, this.color)
  }

  setupLocation(positionVBO) {
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
      const position = this.positionArray[i].position
      const positionVBO = this.positionArray[i].positionVBO
      const gl = this.gl

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
