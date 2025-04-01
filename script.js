
// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create animated background particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 8000;
const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i += 3) {
    const radius = 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i + 2] = radius * Math.cos(phi);
    
    velocityArray[i] = (Math.random() - 0.5) * 0.1;
    velocityArray[i + 1] = (Math.random() - 0.5) * 0.1;
    velocityArray[i + 2] = (Math.random() - 0.5) * 0.1;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x4a4aff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create advanced 3D shapes
const shapes = [];
const geometries = [
    new THREE.TorusKnotGeometry(2, 0.5, 100, 16),
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.OctahedronGeometry(1.8, 2),
    new THREE.SphereGeometry(1.2, 32, 32)
];

// Add atmospheric fog
const fog = new THREE.FogExp2(0x0a0f1a, 0.02);
scene.fog = fog;

for(let i = 0; i < 5; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x2d4a8a,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.2,
        wireframe: false,
        transparent: true,
        opacity: 0.7
    });
    const shape = new THREE.Mesh(geometry, material);
    shape.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
    );
    shapes.push(shape);
    scene.add(shape);
}

// Add ambient and point lights
const ambientLight = new THREE.AmbientLight(0x2d4a8a, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
const pointLight1 = new THREE.PointLight(0x2d4a8a, 2, 50);
pointLight1.position.set(-15, 10, 10);
const pointLight2 = new THREE.PointLight(0x1a2a4a, 2, 50);
pointLight2.position.set(15, -10, -10);
scene.add(ambientLight, directionalLight, pointLight1, pointLight2);

// Smooth scroll animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        duration: 2
    });

    shapes.forEach(shape => {
        gsap.to(shape.rotation, {
            x: mouseY * 0.2,
            y: mouseX * 0.2,
            duration: 2
        });
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            gsap.from(entry.target, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.content-card').forEach(card => {
    observer.observe(card);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < positions.length; i += 3) {
        positions[i] += velocityArray[i];
        positions[i + 1] += velocityArray[i + 1];
        positions[i + 2] += velocityArray[i + 2];
        
        if(Math.abs(positions[i]) > 50) velocityArray[i] *= -1;
        if(Math.abs(positions[i + 1]) > 50) velocityArray[i + 1] *= -1;
        if(Math.abs(positions[i + 2]) > 50) velocityArray[i + 2] *= -1;
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    shapes.forEach(shape => {
        shape.rotation.x += 0.001;
        shape.rotation.y += 0.002;
        shape.position.y = Math.sin(Date.now() * 0.001) * 2;
    });
    
    camera.position.x = Math.sin(Date.now() * 0.0002) * 10;
    camera.position.z = 30 + Math.cos(Date.now() * 0.0002) * 10;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Form handling
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        alert('Message sent successfully!');
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    }
});
