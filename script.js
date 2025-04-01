// Initialize EmailJS (This part remains from the original code)
emailjs.init("YOUR_PUBLIC_KEY");

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

// Create particles (modified from original)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x64ffda,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);


// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.content-card').forEach(card => {
    observer.observe(card);
});


// Mini Game Setup (This part remains largely unchanged from the original code)
const engine = Matter.Engine.create();
const world = engine.world;
const render = Matter.Render.create({
    element: document.querySelector('#game-canvas'),
    engine: engine,
    options: {
        width: 800,
        height: 400,
        wireframes: false,
        background: 'transparent'
    }
});

let score = 0;
let level = 1;

function createGameObjects() {
    const ground = Matter.Bodies.rectangle(400, 390, 810, 20, { 
        isStatic: true,
        render: { fillStyle: '#64ffda' }
    });
    
    Matter.World.add(world, ground);
    
    setInterval(() => {
        const circle = Matter.Bodies.circle(
            Math.random() * 800,
            0,
            10,
            {
                render: {
                    fillStyle: '#64ffda'
                }
            }
        );
        Matter.World.add(world, circle);
    }, 1000);
}

Matter.Events.on(engine, 'collisionStart', () => {
    score += 10;
    document.getElementById('score').textContent = score;
    if(score > level * 100) {
        level++;
        document.getElementById('level').textContent = level;
    }
});

Matter.Engine.run(engine);
Matter.Render.run(render);
createGameObjects();


// Contact form handling (rewritten from original)
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        to_email: 'vikrantchhabria4@gmail.com' //added to_email
    };

    try {
        // Here you would typically send the data to your backend using fetch or similar
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Form submitted:', data);
        alert('Message sent successfully!');
        e.target.reset();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    }
});


// Mouse parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        duration: 2
    });
});

// Responsive handling (from edited code)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation (from edited code)
function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    renderer.render(scene, camera);
}

animate();