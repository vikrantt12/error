
// Initialize Three.js background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create geometry
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ffff,
    metalness: 0.7,
    roughness: 0.2,
    wireframe: true
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Add lights
const pointLight = new THREE.PointLight(0xff00ff, 2);
pointLight.position.set(15, 15, 15);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 30;

// Animation loop 
function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.005;
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
gsap.from(".hero", { 
    opacity: 0, 
    y: -50, 
    duration: 1.5,
    ease: "power4.out"
});

gsap.from(".content", { 
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
    scrollTrigger: {
        trigger: ".content",
        start: "top 80%",
    }
});

animate();
