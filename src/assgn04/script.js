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
      x: -1.0,
      y: 2.0,
      z: 7.0,
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

    this.movieList

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
    this.movieList = {
      '1960s': [],
      '1970s': [],
      '1980s': [],
      '1990s': [],
      '2000s': [],
      '2010s': [],
      '2020s': [],
    }
    for (let i = 0; i < 5; i++) {
      const url = `https://api.themoviedb.org/3/search/movie?query=spider%20man&include_adult=false&language=en-US&page=${
        i + 1
      }&region=US&api_key=${this.apiKey}`
      const response = await fetch(url)
      const json = await response.json()
      const filtered = json.results.filter(
        (movie) =>
          movie['original_language'] === 'en' &&
          movie['release_date'] !== '' &&
          movie['poster_path'] !== null,
      )
      filtered.forEach((movie) => {
        const year = movie['release_date'].slice(0, 4)
        if (year >= 1960 && year < 1970) {
          this.movieList['1960s'].push(movie)
        } else if (year >= 1970 && year < 1980) {
          this.movieList['1970s'].push(movie)
        } else if (year >= 1980 && year < 1990) {
          this.movieList['1980s'].push(movie)
        } else if (year >= 1990 && year < 2000) {
          this.movieList['1990s'].push(movie)
        } else if (year >= 2000 && year < 2010) {
          this.movieList['2000s'].push(movie)
        } else if (year >= 2010 && year < 2020) {
          this.movieList['2010s'].push(movie)
        } else if (year >= 2020 && year < 2030) {
          this.movieList['2020s'].push(movie)
        }
      })
    }
  }

  async loadTexture(url) {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        url,
        (texture) => resolve(texture), // On load successful
        undefined, // On load in progress (not needed)
        (error) => reject(error), // On load fail
      )
    })
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
    const count = Object.keys(this.movieList).length
    const width = 2.0
    const vertices = []
    for (let i = 0; i < count; i++) {
      const x = -2.0
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
    this.lineGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2.0 * count, 32)
    this.line = new THREE.Mesh(this.lineGeometry, this.lineMaterial)
    this.scene.add(this.line)
    this.line.rotation.x = Math.PI / 2
    this.line.rotation.y = -0.3
    this.line.position.x = -2.0
    this.line.position.z = count

    // planes
    this.planeGeometry = new THREE.PlaneGeometry(0.75, 1.0)
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.movieList),
    )) {
      const movies = value
      movies.forEach((movie, j) => {
        const plane = new THREE.Mesh(this.planeGeometry)
        plane.position.set(j * 0.2 - 1.5, 0.0, width * index)
        plane.rotation.y = -Math.PI / 3

        this.loadTexture(
          `https://image.tmdb.org/t/p/original/${movie['poster_path']}`,
        )
          .then((texture) => {
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 1.0,
            })
            plane.material = material
            this.scene.add(plane)
          })
          .catch((error) => {
            console.error('Error loading texture:', error)
          })
      })
    }

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

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
