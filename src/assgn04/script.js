import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import * as dat from 'lil-gui'

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const app = new App3()
    app.load().then(() => {
      app.init()
      app.render()
    })
  },
  false,
)

class App3 {
  static get CAMERA_PARAM() {
    return {
      fovy: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 20.0,
      x: 1.0,
      y: 4.0,
      z: 8.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    }
  }

  static get RENDERER_PARAM() {
    return {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xffffff,
      intensity: 1.0,
      x: 1.0,
      y: 1.0,
      z: 1.0,
    }
  }

  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff,
      intensity: 0.2,
    }
  }

  static get MATERIAL_PARAM() {
    return { color: 0xffffff }
  }

  constructor() {
    this.renderer
    this.scene
    this.camera
    this.controls
    this.directionalLight
    this.ambientLight
    this.axesHelper

    // line
    this.line
    this.lineGeometry
    this.lineMaterial
    this.linePoints = []

    // points
    this.points
    this.pointsGeometry
    this.pointsMaterial

    // planes
    this.planeGeometry
    this.planeMaterial

    this.render = this.render.bind(this)

    // API key
    this.apiKey = '0296d9cfab50bb2bb831354611c78819'

    this.movieList = []

    //Resize event
    window.addEventListener(
      'resize',
      () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
      },
      false,
    )
  }

  async load() {
    for (let i = 0; i < 3; i++) {
      const url = `https://api.themoviedb.org/3/search/movie?query=indiana%20jones&include_adult=false&language=en-US&page=${
        i + 1
      }&region=US&api_key=${this.apiKey}`
      const response = await fetch(url)
      const json = await response.json()
      this.movieList.push(...json.results)
    }
  }

  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor))
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const wrapper = document.querySelector('#webgl')
    wrapper.appendChild(this.renderer.domElement)

    // scene
    this.scene = new THREE.Scene()

    // camera
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far,
    )
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z,
    )
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt)

    // directional light
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity,
    )
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z,
    )
    this.scene.add(this.directionalLight)

    // ambient light
    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity,
    )
    this.scene.add(this.ambientLight)

    // points
    this.pointsMaterial = new THREE.PointsMaterial(App3.MATERIAL_PARAM)

    this.pointsGeometry = new THREE.BufferGeometry()
    const count = 3
    const width = 2.0
    const vertices = []
    for (let i = 0; i < count; i++) {
      const x = -3.0
      const z = i * width
      vertices.push(x, 0.0, z)
    }
    const stride = 3
    const attribute = new THREE.BufferAttribute(
      new Float32Array(vertices),
      stride,
    )
    this.pointsGeometry.setAttribute('position', attribute)
    this.points = new THREE.Points(this.pointsGeometry, this.pointsMaterial)
    this.scene.add(this.points)

    // line
    this.lineMaterial = new THREE.MeshBasicMaterial(App3.MATERIAL_PARAM)
    this.lineGeometry = new THREE.CylinderGeometry(0.02, 0.02, 6, 32)
    this.line = new THREE.Mesh(this.lineGeometry, this.lineMaterial)
    this.scene.add(this.line)
    this.line.rotation.x = Math.PI / 2
    this.line.rotation.y = -0.3
    this.line.position.x = -3.0
    this.line.position.z = 3.0

    // planes
    this.planeMaterial = new THREE.MeshBasicMaterial(App3.MATERIAL_PARAM)
    this.planeGeometry = new THREE.PlaneGeometry(1.0, 1.0)
    const planeCount = 10
    const planes = []
    for (let i = 0; i < planeCount; i++) {
      const plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
      plane.position.set(i * 0.3 - 2.0, 0.0, 0.0)
      plane.rotation.y = -Math.PI / 4
      this.scene.add(plane)
    }

    // // controls
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // debug
    const gui = new dat.GUI()

    // axes helper
    const axesBarLength = 5.0
    this.axesHelper = new THREE.AxesHelper(axesBarLength)
    this.scene.add(this.axesHelper)
  }

  render() {
    requestAnimationFrame(this.render)

    this.renderer.render(this.scene, this.camera)
  }
}
