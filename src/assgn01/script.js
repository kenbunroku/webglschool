import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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
  // define camera
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100.0,
      x: 2.0,
      y: -7.0,
      z: 5.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    }
  }

  // define renderer
  static get RENDERER_PARAM() {
    return {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  // define directional light
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0x009998,
      intensity: 20.0,
      x: 1.0,
      y: 1.0,
      z: 1.0,
    }
  }

  // define ambient light
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xffffff,
      intensity: 0.4,
    }
  }

  // define material
  static get MATERIAL_PARAM() {
    return { color: 0x0057b8 }
  }

  // constructor
  constructor() {
    this.renderer
    this.scene
    this.camera
    this.geometry
    this.material
    this.box
    this.controls
    this.axesHelper

    this.isDown = false

    this.circleRadius = 4.0

    // bind
    this.render = this.render.bind(this)

    // detect keydown event
    window.addEventListener(
      'keydown',
      (keyEvent) => {
        switch (keyEvent.key) {
          case ' ':
            this.isDown = true
            break
          default:
            break
        }
      },
      false,
    )
    window.addEventListener(
      'keyup',
      (keyEvent) => {
        this.isDown = false
      },
      false,
    )

    // Resize event
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

  // init
  init() {
    // renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor(new THREE.Color(App3.RENDERER_PARAM.clearColor))
    this.renderer.setSize(App3.RENDERER_PARAM.width, App3.RENDERER_PARAM.height)
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

    // geometry and material
    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    this.material = new THREE.MeshPhongMaterial(App3.MATERIAL_PARAM)

    const numberOfBoxes = 100

    for (let i = 0; i < numberOfBoxes; i++) {
      const randomAngle = Math.random() * 2 * Math.PI
      const x = this.circleRadius * Math.cos(randomAngle)
      const y = this.circleRadius * Math.sin(randomAngle)
      const z = 1.5 * Math.random()

      // mesh
      this.box = new THREE.Mesh(this.geometry, this.material)

      const randomScale = Math.random() * 2.0
      this.box.scale.set(randomScale, randomScale, randomScale)
      this.box.position.set(x, y, z)
      const rotationAxis = new THREE.Vector3(
        Math.random(),
        Math.random(),
        Math.random(),
      ).normalize()
      this.box.rotation.set(rotationAxis.x, rotationAxis.y, rotationAxis.z)
      this.box.userData.rotationAxis = rotationAxis

      // Store the original position angle for rotating around circle
      const posAngle = Math.atan2(y, x)
      this.box.userData.posAngle = posAngle

      this.scene.add(this.box)
    }

    // add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // // helper
    // const axesBarLength = 5.0
    // this.axesHelper = new THREE.AxesHelper(axesBarLength)
    // this.scene.add(this.axesHelper)
  }

  render() {
    // animation
    requestAnimationFrame(this.render)

    // update
    this.controls.update()

    // rotate the boxes
    this.scene.children.forEach((object) => {
      let rotationSpeed
      if (this.isDown) {
        rotationSpeed = 0.1
      } else if (!this.isDown && this.circleRadius > 4.0) {
        rotationSpeed = -0.1
      } else {
        rotationSpeed = 0.01
      }

      if (object instanceof THREE.Mesh) {
        object.rotateOnAxis(object.userData.rotationAxis, rotationSpeed)

        // rotate the box around the circle
        this.isDown
          ? (object.userData.posAngle -= 0.02)
          : (object.userData.posAngle += 0.001)

        if (this.isDown && this.circleRadius < 6.0) {
          this.circleRadius += 0.0001
        } else if (!this.isDown && this.circleRadius > 4.0) {
          this.circleRadius -= 0.0002
          object.userData.posAngle += 0.015
        }

        object.position.x =
          this.circleRadius * Math.cos(object.userData.posAngle)
        object.position.y =
          this.circleRadius * Math.sin(object.userData.posAngle)
      }
    })

    // rendering
    this.renderer.render(this.scene, this.camera)
  }
}
