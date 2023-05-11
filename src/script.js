import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


//** cursor */
const cursor = {
    x:0,
    y:0
}

window.addEventListener('resize',()=>{
    console.log('resize occured')
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    const aspectRatio = sizes.width / sizes.height

    camera.left = -1 * aspectRatio
    camera.right = 1 * aspectRatio

    const boundingSphere = scene.children[0].geometry.boundingSphere.radius
    const cameraWidth = Math.abs(camera.left) + Math.abs(camera.right) 
    console.log(scene)
    
    // bounding Sphere is the radius of the mesh 
    // and is compared to the width of the cameraView

    camera.zoom = boundingSphere *2 < cameraWidth
        ? 0.9 : cameraWidth /  (boundingSphere * 2) - .1
    
    console.log('Camera zoom: '+camera.zoom)
    
    //update aspect ratio
    //camera.aspect = sizes.width / sizes.height

    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener('dblclick',()=>{
    !document.fullscreenElement
        ? canvas.requestFullscreen()
        : document.exitFullscreen()
})

window.addEventListener('mousemove',(event)=>{
    cursor.x = event.clientX / sizes.width - 0.5 
    cursor.y = event.clientY / sizes.height -0.5 
    //console.log( cursor.x,cursor.y)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true  })
)
mesh.geometry.computeBoundingSphere()
scene.add(mesh)

// Camera
//const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1   ,100)
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(
    aspectRatio*  -1, 
    aspectRatio*  1, 
    1,
    - 1, 
    1, 10)

//get boundingSphere radius to determine the zoom
const boundingSphere = scene.children[0].geometry.boundingSphere.radius
const cameraWidth = Math.abs(camera.left) + Math.abs(camera.right) 
camera.zoom = boundingSphere *2 < cameraWidth
        ? 0.9 : cameraWidth /  (boundingSphere * 2) - .1
console.log(camera.zoom)
camera.updateProjectionMatrix()
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//    Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    controls.update()
    
    // Update objects
    //mesh.rotation.y = elapsedTime;

    // update camera
    //camera.position.x = Math.sin( cursor.x * Math.PI * 2) * 3
    //camera.position.z = Math.cos (cursor.x * Math.PI * 2) * 3
    //camera.position.y = (cursor.y * 10)
    //camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()