import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js'
import { EffectComposer } from '../lib/EffectComposer.js'
import { RenderPass } from '../lib/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import * as dat from 'lil-gui'

window.addEventListener(
  'DOMContentLoaded',
  () => {
    const app = new App3()
    app.init()
    app.render()
  },
  false,
)

class App3 {
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 20.0,
      x: 0.0,
      y: 0.0,
      z: 12.0,
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
    return [{ color: 0x00209f }, { color: 0xffffff }, { color: 0xef4135 }]
  }

  constructor() {
    this.renderer
    this.scene
    this.camera
    this.directionalLight
    this.ambientLight
    this.material
    this.boxGeometry
    this.boxArray
    this.controls
    this.axisHelper
    this.composer
    this.renderPass
    this.unrealBloomPass
    this.boxes

    this.render = this.render.bind(this)

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

  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor))
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height)
    const wrapper = document.querySelector('#webgl')
    wrapper.appendChild(this.renderer.domElement)

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

    // group
    this.bladeGroup = new THREE.Group()
    this.motorGroup = new THREE.Group()
    this.scene.add(this.bladegroup)
    this.scene.add(this.motorGroup)

    // boxes
    this.boxes = []

    // debug
    const gui = new dat.GUI()
    const colorFolder = gui.addFolder('Colors')

    for (let i = 0; i < 3; i++) {
      // material
      this.material = new THREE.MeshLambertMaterial(App3.MATERIAL_PARAM[i])

      const BOX_COUNT = 15
      const BOX_EDGE_LENGTH = 0.5
      this.boxGeometry = new THREE.BoxGeometry(
        BOX_EDGE_LENGTH,
        BOX_EDGE_LENGTH * 1.61803398875,
        0.1,
      )
      this.boxArray = []
      for (let j = 0; j < BOX_COUNT; j++) {
        const box = new THREE.Mesh(this.boxGeometry, this.material)

        // place box in circle
        const angle = (j / BOX_COUNT) * Math.PI * 2
        const radius = 6.0 / (i + 1)
        box.position.x = Math.cos(angle) * radius
        box.position.y = Math.sin(angle) * radius
        box.position.z = 6 - i * 2.0

        // calculate the angle between box position and origin
        const angleToOrigin = Math.atan2(box.position.y, box.position.x)
        box.rotation.z = angleToOrigin + 90 * (Math.PI / 180)

        this.bladeGroup.add(box)
        this.boxArray.push(box)
      }
      this.motorGroup.add(this.bladeGroup)
      this.boxes.push({ Blades: this.bladeGroup, Motor: this.motorGroup })

      colorFolder
        .addColor(App3.MATERIAL_PARAM[i], 'color')
        .name(`Color ${i + 1}`)
        .onChange(() => {
          this.material.color.setHex(App3.MATERIAL_PARAM[i].color)
        })
    }

    // control
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // composer
    const params = {
      bloomStrength: 1.5,
      bloomThreshold: 0.4,
      bloomRadius: 0.85,
    }

    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(this.renderPass)
    this.unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    )
    this.unrealBloomPass.threshold = params.threshold
    this.unrealBloomPass.strength = params.bloomStrength
    this.unrealBloomPass.radius = params.bloomRadius
    this.composer.addPass(this.unrealBloomPass)
    this.unrealBloomPass.renderToScreen = true

    // axis helper
    const axesBarLength = 5.0
    this.axesHelper = new THREE.AxesHelper(axesBarLength)
    this.scene.add(this.axesHelper)
  }

  render() {
    requestAnimationFrame(this.render)

    this.controls.update()

    this.bladeGroup.rotation.z += 0.02

    // rotate group around y axis
    const angle = (Date.now() / 10000) * Math.PI * 2
    this.motorGroup.rotation.y = Math.sin(angle) * 0.5

    this.composer.render()
  }
}