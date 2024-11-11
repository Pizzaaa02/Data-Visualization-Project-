d3.csv("path/to/TB_Global_Incident.csv").then(data => {
    // Process the data and visualize it on the globe
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x0077ff, wireframe: true });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

camera.position.z = 10;

let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const deltaMove = {
            x: e.offsetX - previousMousePosition.x,
            y: e.offsetY - previousMousePosition.y
        };

        globe.rotation.y += deltaMove.x * 0.01;
        globe.rotation.x += deltaMove.y * 0.01;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();