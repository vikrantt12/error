
// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 15000;
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

// Add neural network visualization
const nodesCount = 50;
const nodes = [];
const connections = [];

function createNodes() {
    const container = document.querySelector('.nodes');
    for(let i = 0; i < nodesCount; i++) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        container.appendChild(node);
        nodes.push({
            element: node,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
}

function updateNodes() {
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if(node.x <= 0 || node.x >= window.innerWidth) node.vx *= -1;
        if(node.y <= 0 || node.y >= window.innerHeight) node.vy *= -1;
        
        node.element.style.transform = `translate(${node.x}px, ${node.y}px)`;
    });
    
    requestAnimationFrame(updateNodes);
}

createNodes();
updateNodes();

// Mini Game Setup
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

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = this.querySelector('button');
    btn.classList.add('loading');
    
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_email: 'vikrantchhabria4@gmail.com'
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(() => {
            createParticleExplosion(btn);
            alert('Message sent successfully!');
            this.reset();
        })
        .catch(() => {
            alert('Failed to send message. Please try again.');
        })
        .finally(() => {
            btn.classList.remove('loading');
        });
});

function createParticleExplosion(element) {
    const particles = [];
    const rect = element.getBoundingClientRect();
    
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = rect.left + rect.width/2 + 'px';
        particle.style.top = rect.top + rect.height/2 + 'px';
        document.body.appendChild(particle);
        
        const angle = (i / 30) * Math.PI * 2;
        const velocity = 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particles.push({
            element: particle,
            vx,
            vy,
            life: 1
        });
    }
    
    function updateParticles() {
        particles.forEach((particle, index) => {
            particle.life -= 0.02;
            particle.element.style.opacity = particle.life;
            
            const x = parseFloat(particle.element.style.left);
            const y = parseFloat(particle.element.style.top);
            
            particle.element.style.left = x + particle.vx + 'px';
            particle.element.style.top = y + particle.vy + 'px';
            
            if(particle.life <= 0) {
                particle.element.remove();
                particles.splice(index, 1);
            }
        });
        
        if(particles.length > 0) {
            requestAnimationFrame(updateParticles);
        }
    }
    
    updateParticles();
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    renderer.render(scene, camera);
}

animate();
