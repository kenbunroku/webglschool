import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import gsap from 'gsap'

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
    this.planeArray = []

    this.isCliked = false
    this.object
    this.objectCopy

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

    // raycaster
    this.raycaster = new THREE.Raycaster()

    // pointermove event to move the object up
    window.addEventListener(
      'pointermove',
      (event) => {
        event.preventDefault()
        const x = (event.clientX / window.innerWidth) * 2.0 - 1.0
        const y = (event.clientY / window.innerHeight) * 2.0 - 1.0

        const v = new THREE.Vector2(x, -y)

        this.raycaster.setFromCamera(v, this.camera)
        const intersects = this.raycaster.intersectObjects(this.planeArray)
        if (intersects.length > 0 && !this.isCliked) {
          // move the first intersected object to the up
          const intersected = intersects[0]
          const object = intersected.object
          gsap.to(object.position, { duration: 0.5, y: 0.3 })

          // Desplay the movie title
          document.querySelector('.movie-title').innerHTML =
            object.userData['original_title']

          // move the other objects to the down
          this.planeArray.forEach((plane) => {
            if (plane !== object) {
              gsap.to(plane.position, { duration: 0.5, y: 0.0 })
            }
          })
        } else if (!this.isCliked) {
          // move all objects to the down
          this.planeArray.forEach((plane) => {
            gsap.to(plane.position, { duration: 0.5, y: 0.0 })
          })
        }
      },
      false,
    )

    // click event to move the object to the right center and display the movie overview
    window.addEventListener(
      'click',
      (event) => {
        event.preventDefault()

        const x = (event.clientX / window.innerWidth) * 2.0 - 1.0
        const y = (event.clientY / window.innerHeight) * 2.0 - 1.0
        const v = new THREE.Vector2(x, -y)
        this.raycaster.setFromCamera(v, this.camera)

        const intersects = this.raycaster.intersectObjects(this.planeArray)

        if (intersects.length > 0 && !this.isCliked) {
          this.isCliked = true
          const intersected = intersects[0]
          this.object = intersected.object
          this.objectCopy = this.object.clone()

          // Desplay the movie overview
          document.querySelector('.movie-overview').innerHTML =
            this.object.userData['overview']

          let tl = gsap.timeline()
          const duration = 0.5
          const scale = 2.0

          tl.to(
            this.object.position,
            {
              duration: duration,
              x: 2.0,
              y: 1.25,
              z: 2.5,
            },
            0,
          )
          tl.to(
            this.object.rotation,
            { duration: duration, x: Math.PI * 2 - 0.1, y: -0.4 },
            0,
          )
          tl.to(
            this.object.scale,
            { duration: duration, x: scale, y: scale },
            0,
          )
          tl.to('.movie-info-container', { duration: duration, y: 110 }, 0)
          tl.to('.movie-overview-container', { duration: duration, opacity: 1 })
        } else if (this.isCliked) {
          // move back to the original position
          let tl = gsap.timeline(
            { onComplete: () => (this.isCliked = false) },
            1,
          )

          const duration = 0.5
          const scale = 1.0

          tl.to(
            this.object.position,
            {
              duration: duration,
              x: this.objectCopy.position.x,
              y: 0.0,
              z: this.objectCopy.position.z,
            },
            0,
          )
          tl.to(
            this.object.rotation,
            {
              duration: duration,
              x: -Math.PI * 2,
              y: this.objectCopy.rotation.y,
            },
            0,
          )
          tl.to(
            this.object.scale,
            { duration: duration, x: scale, y: scale },
            0,
          )
          tl.to('.movie-info-container', { duration: duration, y: -125 }, 0)
          tl.to(
            '.movie-overview-container',
            {
              duration: duration,
              opacity: 0,
              onComplete: () => {
                // Clean up the movie overview
                document.querySelector('.movie-overview').innerHTML = ''
              },
            },
            0,
          )
        }
      },
      false,
    )
  }

  async load() {
    // Fetch data and sort them out by release decade
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
    // this.scene.fog = new THREE.Fog(
    //   App3.FOG_PARAM.fogColor,
    //   App3.FOG_PARAM.fogNear,
    //   App3.FOG_PARAM.fogFar,
    // )

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
    this.lineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2.0 * count, 32)
    this.line = new THREE.Mesh(this.lineGeometry, this.lineMaterial)
    this.scene.add(this.line)
    this.line.rotation.x = Math.PI / 2
    this.line.rotation.y = -0.3
    this.line.position.x = -2.0
    this.line.position.z = count

    // planes
    for (const [index, [key, value]] of Object.entries(
      Object.entries(this.movieList),
    )) {
      const movies = value
      movies.forEach((movie, j) => {
        const geometry = new THREE.PlaneGeometry(0.75, 1.0)
        const plane = new THREE.Mesh(geometry)
        plane.position.set(j * 0.2 - 1.5, 0.0, width * index)
        plane.rotation.y = -Math.PI / 3

        // store movie data attached to plane
        plane.userData = movie

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
            this.planeArray.push(plane)
          })
          .catch((error) => {
            console.error('Error loading texture:', error)
          })
      })
    }
    // // set geomeetry of selected movie
    // this.selectedMovieGeometry = new THREE.PlaneGeometry(0.75, 1.0)
    // this.selectedMovieGeometry.position.set(1.0, 1.0, 0.0)

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

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
