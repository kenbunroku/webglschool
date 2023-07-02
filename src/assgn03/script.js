import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
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
      z: 2000.0,
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

  static get AIRPLANCE_DISTANCE() {
    return 1000.0
  }

  constructor() {
    this.renderer
    this.scene
    this.camera
    this.controls
    this.directionalLight
    this.ambientLight
    this.axesHelper

    this.lines = new THREE.Group()
    this.lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 1,
      color: 0xffffff,
    })
    this.countryBoundaries

    this.coneGeometry
    this.airplane
    this.airplaneMaterial

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

  async init() {
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

    // airplane
    this.coneGeometry = new THREE.ConeGeometry(10, 30, 32)
    this.airplaneMaterial = new THREE.MeshBasicMaterial(App3.MATERIAL_PARAM)
    this.airplane = new THREE.Mesh(this.coneGeometry, this.airplaneMaterial)
    this.scene.add(this.airplane)
    this.airplane.position.set(App3.AIRPLANCE_DISTANCE, 0, 0)

    // debug
    const gui = new dat.GUI()

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    // axis helper
    const axesBarLength = 1000.0
    this.axesHelper = new THREE.AxesHelper(axesBarLength)
    this.scene.add(this.axesHelper)

    this.addGeoJsonFeaturesToScene(this.countryBoundaries.features)
  }

  render() {
    requestAnimationFrame(this.render)

    this.controls.update()

    this.lines.rotation.y += 0.001

    this.renderer.render(this.scene, this.camera)
  }
}
