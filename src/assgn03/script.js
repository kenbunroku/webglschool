import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import * as dat from 'lil-gui'
import * as d3 from 'd3'

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
      far: 10000.0,
      x: 10.0,
      y: 0.0,
      z: 2500.0,
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
    return { color: 0xf006eff }
  }

  static get AIRPLANE_DISTANCE() {
    return 1000.0
  }

  static get TRAIL_MATERIAL_PARAM() {
    return {
      color: 0x006eff,
      linewidth: 5,
    }
  }

  static get TRAIL_LENGTH() {
    return 50
  }

  constructor() {
    this.renderer
    this.scene
    this.camera
    this.controls
    this.directionalLight
    this.ambientLight
    this.axesHelper

    // country boundaries
    this.lines = new THREE.Group()
    this.lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 1,
      color: 0xffffff,
    })
    this.countryBoundaries

    // airplane
    this.coneGeometry
    this.airplane
    this.airplaneMaterial
    this.airplaneDirection

    // trail
    this.trail
    this.trailMaterial
    this.trailGeometry
    this.trailVertices

    // composer
    this.composer
    this.renderPass
    this.unrealBloomPass
    this.finalComposer
    // params for UnrealBloomPass
    this.params = {
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0.85,
    }

    this.bloomLayer = new THREE.Layers()

    this.clock = new THREE.Clock()

    this.render = this.render.bind(this)

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

  createLineFromCoords(coords) {
    let lineGeom = new THREE.BufferGeometry()
    let positions = []
    for (let i = 0; i < coords.length; i++) {
      let lat = coords[i].y
      let lon = coords[i].x
      let radius = App3.RENDERER_PARAM.height
      let latRad = lat * (Math.PI / 180)
      let lonRad = -lon * (Math.PI / 180)
      let x = Math.cos(latRad) * Math.cos(lonRad) * radius
      let y = Math.sin(latRad) * radius
      let z = Math.cos(latRad) * Math.sin(lonRad) * radius
      positions.push(x, y, z)
    }

    lineGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    )

    return new THREE.Line(lineGeom, this.lineMaterial)
  }

  addGeoJsonFeaturesToScene(features) {
    // geojson to threejs
    for (let i = 0; i < features.length; i++) {
      let feature = features[i]
      let coords = []
      for (let c = 0; c < feature.geometry.coordinates.length; c++) {
        if (feature.geometry.type == ' Polygon') {
          let coords = []
          for (let s = 0; s < feature.geometry.coordinates[c].length; s++) {
            let xy = {
              x: feature.geometry.coordinates[c][s][0],
              y: feature.geometry.coordinates[c][s][1],
            }
            coords.push(xy)
          }

          if (coords.length > 0) {
            this.lines.add(this.coordinatesreateLineFromCoords(coords))
          }
        } else if (feature.geometry.type == 'MultiPolygon') {
          for (let s = 0; s < feature.geometry.coordinates[c].length; s++) {
            // each polygon in multipolygon:
            let coords = []
            for (
              let m = 0;
              m < feature.geometry.coordinates[c][s].length;
              m++
            ) {
              let xy = {
                x: feature.geometry.coordinates[c][s][m][0],
                y: feature.geometry.coordinates[c][s][m][1],
              }
              coords.push(xy)
            }
          }
        } else if (feature.geometry.type == 'LineString') {
          let xy = {
            x: feature.geometry.coordinates[c][0],
            y: feature.geometry.coordinates[c][1],
          }
          coords.push(xy)
        }
      }
      if (feature.geometry.type == 'LineString') {
        if (coords.length > 0) {
          this.lines.add(this.createLineFromCoords(coords))
        }
      }
    }
    this.scene.add(this.lines)
  }

  async load() {
    return (this.countryBoundaries = await d3.json(
      'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_BN_20M_2020_4326.geojson',
    ))
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

    // airplane
    this.coneGeometry = new THREE.ConeGeometry(10, 30, 32)
    this.airplaneMaterial = new THREE.MeshBasicMaterial(App3.MATERIAL_PARAM)
    this.airplane = new THREE.Mesh(this.coneGeometry, this.airplaneMaterial)
    this.scene.add(this.airplane)
    this.airplane.scale.setScalar(3)
    this.airplane.position.set(App3.AIRPLANE_DISTANCE, 0, 0)
    this.airplaneDirection = new THREE.Vector3(0.0, 1.0, 0.0).normalize()

    // trail
    this.trailVertices = []
    this.trailMaterial = new THREE.LineBasicMaterial(App3.TRAIL_MATERIAL_PARAM)
    this.trailGeometry = new THREE.BufferGeometry().setFromPoints(
      this.trailVertices,
    )
    this.trail = new THREE.Line(this.trailGeometry, this.trailMaterial)
    this.scene.add(this.trail)

    // debug
    const gui = new dat.GUI()

    gui.addColor(App3.TRAIL_MATERIAL_PARAM, 'color').onChange((color) => {
      this.airplaneMaterial.color.set(color)
      this.trailMaterial.color.set(color)
    })
    gui.add(App3.TRAIL_MATERIAL_PARAM, 'linewidth', 1, 10).onChange((width) => {
      this.trailMaterial.linewidth = Number(width)
    })

    const bloomFolder = gui.addFolder('Bloom')
    bloomFolder
      .add(this.params, 'bloomStrength', 0.0, 3.0)
      .onChange((value) => {
        this.unrealBloomPass.strength = Number(value)
      })
    bloomFolder.add(this.params, 'bloomThreshold', 0.0, 1).onChange((value) => {
      this.unrealBloomPass.threshold = Number(value)
    })

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // axis helper
    const axesBarLength = 1000.0
    this.axesHelper = new THREE.AxesHelper(axesBarLength)
    this.axesHelper.visible = false
    this.scene.add(this.axesHelper)
    gui.add(this.axesHelper, 'visible').name('Axes Helper')

    this.addGeoJsonFeaturesToScene(this.countryBoundaries.features)

    // composer
    this.composer = new EffectComposer(this.renderer)
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(this.renderPass)
    this.unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    )
    this.unrealBloomPass.threshold = this.params.bloomThreshold
    this.unrealBloomPass.strength = this.params.bloomStrength
    this.unrealBloomPass.radius = this.params.bloomRadius
    this.composer.addPass(this.unrealBloomPass)
    this.unrealBloomPass.renderToScreen = false
  }

  render() {
    requestAnimationFrame(this.render)

    this.controls.update()

    this.lines.rotation.y += 0.001

    const time = this.clock.getElapsedTime()
    const newPosition = new THREE.Vector3(
      Math.cos(time) * App3.AIRPLANE_DISTANCE,
      Math.cos(time) * App3.AIRPLANE_DISTANCE,
      Math.sin(time) * App3.AIRPLANE_DISTANCE,
    )

    const previousDirection = this.airplaneDirection.clone()

    // Calculate the direction vector from the previous position to the new position
    const subVector = new THREE.Vector3().subVectors(
      newPosition,
      this.airplane.position,
    )
    subVector.normalize()

    this.airplaneDirection.add(subVector.multiplyScalar(1))
    this.airplaneDirection.normalize()
    const direction = this.airplaneDirection.clone()
    this.airplane.position.add(direction.multiplyScalar(15))

    // Calculate the quaternion representing the rotation from the old direction to the new direction
    const normalAxis = new THREE.Vector3().crossVectors(
      previousDirection,
      this.airplaneDirection,
    )
    normalAxis.normalize()

    const cos = previousDirection.dot(this.airplaneDirection)
    const radians = Math.acos(cos)
    const qtn = new THREE.Quaternion().setFromAxisAngle(normalAxis, radians)

    this.airplane.quaternion.premultiply(qtn)

    // Update the trail
    this.trailVertices.push(this.airplane.position.clone())
    if (this.trailVertices.length > App3.TRAIL_LENGTH) {
      this.trailVertices.shift()
    }
    this.trailGeometry.setFromPoints(this.trailVertices)

    this.composer.render()
  }
}
