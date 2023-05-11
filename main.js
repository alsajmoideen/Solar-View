import * as THREE from 'three'
import { Assets } from './helpers/Images'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Initialize scene,camera and renderer 
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement) // Append the renderer to html

// Orbit controller is add here
const controls = new OrbitControls(camera, renderer.domElement)

camera.position.set(-50, 120, 300)
controls.update()

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// Adding star texture to the background 
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
  Assets.stars,
  Assets.stars,
  Assets.stars,
  Assets.stars,
  Assets.stars,
  Assets.stars
])

const textureLoader = new THREE.TextureLoader()

const sunGeo = new THREE.SphereGeometry(16, 50, 50)
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(Assets.sun),
  side: THREE.DoubleSide
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)
sun.position.x = 70
sun.position.y = -40

// Function to create planets the parameters are size,texture,position of planets.
// And if the planet has ring it is the last parameter it is optional
const createPlanet = (size, texture, position, ringObj) => {
  // Planet Mesh Creation code
  const Geo = new THREE.SphereGeometry(size, 30, 30)
  const Mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(Geo, Mat)
  const obj = new THREE.Object3D()
  obj.add(mesh)
  obj.position.x = 70
  obj.position.y = -40

  // Add ring to planet if they have one
  const ring = ringObj
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    )
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    mesh.add(ringMesh)
    ringMesh.rotateX(-Math.PI / 2)
  }

  scene.add(obj)
  mesh.position.x = position
  return { mesh, obj }
}

// Planet creation 
const mercury = createPlanet(3.2, Assets.mercury, 28)
const venus = createPlanet(5.8, Assets.venus, 44)
const earth = createPlanet(6, Assets.earth, 62)
const mars = createPlanet(4, Assets.mars, 78)
const jupiter = createPlanet(12, Assets.jupiter, 100)
const saturn = createPlanet(10,Assets.saturn,138,{
  innerRadius: 10,
  outerRadius:20,
  texture:Assets.saturnRing
})
const uranus = createPlanet(7,Assets.uranus,176,{
  innerRadius: 7,
  outerRadius:12,
  texture:Assets.uranusRing
})
const neptune = createPlanet(7, Assets.neptune, 200)
const pluto = createPlanet(3, Assets.pluto, 220)


// Add point light to get the day and light effect in planet
// Point light is used to create day and night effect in planets
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
scene.add(pointLight)
pointLight.position.x = 70
pointLight.position.y = -40

const planetMotions=(planet,rotation,spin)=>{
  planet.obj.rotateY(rotation)
  planet.mesh.rotateY(spin)
}


// This is were the animation loop is set
function animate() {
  requestAnimationFrame(animate)

  sun.rotateY(0.004)
  planetMotions(mercury,.04,.004)
  planetMotions(venus,.015,.002)
  planetMotions(earth,.01,.02)
  planetMotions(mars,.008,.018)
  planetMotions(jupiter,.004,.04)
  planetMotions(saturn,.002,.038)
  planetMotions(uranus,.0009,.03)
  planetMotions(neptune,.0005,.032)
  planetMotions(pluto,.0003,.008)

  renderer.render(scene, camera)
}
animate()

// Window resize event listener
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
