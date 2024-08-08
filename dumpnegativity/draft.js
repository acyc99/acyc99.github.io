// Import Three.js as a module
import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';
// import { FontLoader } from 'https://unpkg.com/three@0.167.1/examples/jsm/loaders/FontLoader.js';

// Clear the input field
const clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', () => {
    messageInput.value = ''; 
});

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Black Hole
const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32); // Radius, Width Segments (Higher # = Smoother and more detailed sphere but increases the computational cost), Height Segments (Vertical from top to bottom of the sphere)
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
scene.add(blackHole);

// Create Absorbing Objects
const objectGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const objects = [];

for (let i = 0; i < 50; i++) {
    const obj = new THREE.Mesh(objectGeometry, objectMaterial);
    resetObjectPosition(obj);  // Initialize the object position
    scene.add(obj);
    objects.push(obj);
}

camera.position.z = 30;

// Function to reset object position
function resetObjectPosition(obj) {
    const spreadFactor = 50; // Increase to spread objects wider 
    obj.position.set(
        (Math.random() - 0.5) * spreadFactor,
        (Math.random() - 0.5) * spreadFactor,
        (Math.random() - 0.5) * spreadFactor
    );
    obj.scale.set(1, 1, 1); // Reset scale to original size
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    objects.forEach(obj => {
        const direction = new THREE.Vector3();
        direction.subVectors(blackHole.position, obj.position).normalize();
        obj.position.add(direction.multiplyScalar(0.05));

        // Scale down objects as they approach the black hole
        if (obj.position.distanceTo(blackHole.position) < 3) {
            obj.scale.multiplyScalar(0.95);
        }

        // Reset object after it has been fully absorbed (disappeared)
        if (obj.scale.length() < 0.01) {
            resetObjectPosition(obj);
        }
    });

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Handle chatbox submission 
const messageInput = document.getElementById('messageInput');
const throwButton = document.getElementById('throwButton');

throwButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        createPaperAndAnimate(message);
        messageInput.value = '';  // Clear the input field
    }
});

function createPaperAndAnimate(text) {
    // Load the font
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        // Create a paper-like plane
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: 0.1
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 }); // Pink color
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Position the text initially at the bottom center
        textMesh.position.set(0, -10, 0);
        scene.add(textMesh);
        
        // Animate text towards the black hole
        const animateText = () => {
            const direction = new THREE.Vector3();
            direction.subVectors(blackHole.position, textMesh.position).normalize();
            textMesh.position.add(direction.multiplyScalar(0.05));

            if (textMesh.position.distanceTo(blackHole.position) < 5) {
                textMesh.scale.multiplyScalar(0.95);
            }

            if (textMesh.scale.length() < 0.01) {
                scene.remove(textMesh);
            } else {
                requestAnimationFrame(animateText);
            }
        };

        animateText();
    });
}









// // Import Three.js as a module
// import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';
// import { FontLoader } from 'https://unpkg.com/three@0.167.1/examples/jsm/loaders/FontLoader.js';

// // Clear the input field
// const clearButton = document.getElementById('clearButton');
// const messageInput = document.getElementById('messageInput');
// const throwButton = document.getElementById('throwButton');

// clearButton.addEventListener('click', () => {
//     messageInput.value = ''; 
// });

// // Scene, Camera, Renderer setup
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Create Black Hole
// const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32);
// const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
// const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
// scene.add(blackHole);

// // Create Absorbing Objects
// const objectGeometry = new THREE.SphereGeometry(0.2, 16, 16);
// const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const objects = [];

// for (let i = 0; i < 50; i++) {
//     const obj = new THREE.Mesh(objectGeometry, objectMaterial);
//     resetObjectPosition(obj);
//     scene.add(obj);
//     objects.push(obj);
// }

// camera.position.z = 30;

// // Function to reset object position
// function resetObjectPosition(obj) {
//     const spreadFactor = 50;
//     obj.position.set(
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor
//     );
//     obj.scale.set(1, 1, 1);
// }

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);

//     objects.forEach(obj => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, obj.position).normalize();
//         obj.position.add(direction.multiplyScalar(0.05));

//         if (obj.position.distanceTo(blackHole.position) < 3) {
//             obj.scale.multiplyScalar(0.95);
//         }

//         if (obj.scale.length() < 0.01) {
//             resetObjectPosition(obj);
//         }
//     });

//     renderer.render(scene, camera);
// }

// animate();

// // Handle window resize
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // Handle chatbox submission
// throwButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     if (message.trim()) {
//         createPaperAndAnimate(message);
//         messageInput.value = '';  // Clear the input field
//     }
// });

// function createPaperAndAnimate(text) {
//     const loader = new FontLoader();
//     loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
//         const textGeometry = new THREE.TextGeometry(text, {
//             font: font,
//             size: 1,
//             height: 0.1
//         });
//         const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 }); // Pink color
//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
//         textMesh.position.set(0, -10, 0);
//         scene.add(textMesh);
        
//         const animateText = () => {
//             const direction = new THREE.Vector3();
//             direction.subVectors(blackHole.position, textMesh.position).normalize();
//             textMesh.position.add(direction.multiplyScalar(0.05));

//             if (textMesh.position.distanceTo(blackHole.position) < 5) {
//                 textMesh.scale.multiplyScalar(0.95);
//             }

//             if (textMesh.scale.length() < 0.01) {
//                 scene.remove(textMesh);
//             } else {
//                 requestAnimationFrame(animateText);
//             }
//         };

//         animateText();
//     });
// }























// function createPaperAndAnimate(text) {
//     // Create a paper-like plane
//     const textGeometry = new THREE.TextGeometry(text, {
//         font: new THREE.FontLoader().parse({
//             // Font data can be added here or loaded from a JSON file
//             // Example: https://threejs.org/examples/fonts/helvetiker_regular.typeface.json
//         }),
//         size: 1,
//         height: 0.1
//     });
//     const textMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
//     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
//     // Position the text initially at the bottom center
//     textMesh.position.set(0, -10, 0);
//     scene.add(textMesh);
    
//     // Animate text towards the black hole
//     const animateText = () => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, textMesh.position).normalize();
//         textMesh.position.add(direction.multiplyScalar(0.05));

//         if (textMesh.position.distanceTo(blackHole.position) < 5) {
//             textMesh.scale.multiplyScalar(0.95);
//         }

//         if (textMesh.scale.length() < 0.01) {
//             scene.remove(textMesh);
//         } else {
//             requestAnimationFrame(animateText);
//         }
//     };

//     animateText();
// }





// function createPaperAndAnimate(text) {
//     // Create a paper-like plane
//     const textGeometry = new THREE.TextGeometry(text, {
//         font: new THREE.FontLoader().parse({
//             // Font data can be added here or loaded from a JSON file
//             // Example: https://threejs.org/examples/fonts/helvetiker_regular.typeface.json
//         }),
//         size: 1,
//         height: 0.1
//     });
//     const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
//     const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
//     // Position the text initially at the bottom center
//     textMesh.position.set(0, -10, 0);
//     scene.add(textMesh);
    
//     // Animate text towards the black hole
//     const animateText = () => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, textMesh.position).normalize();
//         textMesh.position.add(direction.multiplyScalar(0.05));

//         if (textMesh.position.distanceTo(blackHole.position) < 5) {
//             textMesh.scale.multiplyScalar(0.95);
//         }

//         if (textMesh.scale.length() < 0.01) {
//             scene.remove(textMesh);
//         } else {
//             requestAnimationFrame(animateText);
//         }
//     };

//     animateText();
// }

