function toggleForm(form) {
    const wrapper = document.getElementById('formWrapper');
    if (form === 'signup') wrapper.classList.add('slide-signup');
    else wrapper.classList.remove('slide-signup');
}

// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.classList.add("hidden");
        document.getElementById("loginTitle").classList.add("loaded");
        document.getElementById("signupTitle").classList.add("loaded");

        // 🔥 Force video to load & play immediately
        const bgVideo = document.getElementById("bgVideo");
        bgVideo.load();
        bgVideo.play().catch(err => console.log("Autoplay blocked:", err));
    }, 1200);
});



const toggleBtn = document.getElementById("modeToggle");
const bgVideo = document.getElementById("bgVideo");
const bgSource = document.getElementById("bgSource");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        toggleBtn.textContent = "🌕︎"; // black moon
        bgSource.src = "https://cdn.pixabay.com/video/2022/08/20/128525-741495530_tiny.mp4";
    } else {
        toggleBtn.textContent = "☀"; // white sun
        bgSource.src = "https://cdn.pixabay.com/video/2022/08/20/128525-741495530_tiny.mp4";
    }
    bgVideo.load();
    bgVideo.play();
});

// Form Validation
function validatePassword(pass) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/;
    return regex.test(pass);
}

document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const email = document.getElementById("loginEmail");
    const pass = document.getElementById("loginPassword");

    if (!email.value) {
        document.getElementById("loginEmailError").style.display = "block";
        valid = false;
    } else {
        document.getElementById("loginEmailError").style.display = "none";
    }

    if (!pass.value || !validatePassword(pass.value)) {
        document.getElementById("loginPassError").style.display = "block";
        valid = false;
    } else {
        document.getElementById("loginPassError").style.display = "none";
    }

    if (valid) alert("Login successful!");
});

document.getElementById("signupForm").addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById("signupName");
    const email = document.getElementById("signupEmail");
    const pass = document.getElementById("signupPassword");

    if (!name.value) {
        document.getElementById("signupNameError").style.display = "block";
        valid = false;
    } else {
        document.getElementById("signupNameError").style.display = "none";
    }

    if (!email.value) {
        document.getElementById("signupEmailError").style.display = "block";
        valid = false;
    } else {
        document.getElementById("signupEmailError").style.display = "none";
    }

    if (!pass.value || !validatePassword(pass.value)) {
        document.getElementById("signupPassError").style.display = "block";
        valid = false;
    } else {
        document.getElementById("signupPassError").style.display = "none";
    }

    if (valid) alert("Signup successful!");
});

// Three.js Scene
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

camera.position.z = 5;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Scales of Justice model
function createScales() {
    const scales = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x641226 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    scales.add(base);

    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    const pole = new THREE.Mesh(poleGeometry, baseMaterial);
    pole.position.y = 1.1;
    scales.add(pole);

    // Beam
    const beamGeometry = new THREE.BoxGeometry(2, 0.1, 0.1);
    const beam = new THREE.Mesh(beamGeometry, baseMaterial);
    beam.position.y = 2.1;
    scales.add(beam);

    // Pans
    const panGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
    const panMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const pan1 = new THREE.Mesh(panGeometry, panMaterial);
    pan1.position.set(-0.8, 1.8, 0);
    scales.add(pan1);

    const pan2 = new THREE.Mesh(panGeometry, panMaterial);
    pan2.position.set(0.8, 1.8, 0);
    scales.add(pan2);

    scene.add(scales);
    return scales;
}

const scales = createScales();
const beam = scales.children[2];
const pan1 = scales.children[3];
const pan2 = scales.children[4];

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

// Event Listeners
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

function tiltScales() {
    const emailLength = loginEmail.value.length;
    const passwordLength = loginPassword.value.length;
    const tilt = (emailLength - passwordLength) / 20;

    beam.rotation.z = tilt;
    pan1.position.y = 1.8 - tilt * 4;
    pan2.position.y = 1.8 + tilt * 4;
}

loginEmail.addEventListener("input", tiltScales);
loginPassword.addEventListener("input", tiltScales);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Slowly rotate the scales
    scales.rotation.y += 0.005;

    controls.update();

    renderer.render(scene, camera);
}
animate();
