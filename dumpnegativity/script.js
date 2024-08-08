// Import Three.js as a module
import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';

// Variables to hold the text mesh
let textMesh = null;

// Clear the input field
const clearButton = document.getElementById('clearButton');
const messageInput = document.getElementById('messageInput');
const throwButton = document.getElementById('throwButton');

clearButton.addEventListener('click', () => {
    messageInput.value = ''; 
});

throwButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        console.log("Throwing message:", message);
        if (textMesh) {
            // Remove the previous text mesh before creating a new one
            scene.remove(textMesh);
        }
        createTextAndAnimate(message);
        messageInput.value = '';  // Clear the input field
    }
});

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Black Hole
const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32);
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); 
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
scene.add(blackHole);

// Create Absorbing Objects (Particles)
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

// Create Canvas Texture for Text (Trash-like Paper)
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 100; // Adjust font size as needed
    context.font = `${fontSize}px Arial`;
    const textWidth = context.measureText(text).width;
    const textHeight = fontSize; // Height based on font size

    // Adjust canvas size
    canvas.width = textWidth; // Add padding
    canvas.height = textHeight;

    // Draw white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}






// function createTextTexture(text) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     const canvasWidth = 512;
//     const canvasHeight = 128;

//     // Set canvas dimensions
//     canvas.width = canvasWidth;
//     canvas.height = canvasHeight;

//     // Draw white background
//     context.fillStyle = 'white';
//     context.fillRect(0, 0, canvasWidth, canvasHeight);

//     // Draw text on top of the white background
//     context.font = '48px Arial';  // Adjust font size and family as needed
//     context.fillStyle = 'yellow';  // Text color
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     context.fillText(text, canvasWidth / 2, canvasHeight / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
// }







// Create and Animate Text Plane (Trash-like Paper)
function createTextAndAnimate(text) {
    const texture = createTextTexture(text);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(50, 30);  // Adjust dimensions as needed
    textMesh = new THREE.Mesh(geometry, material);
    
    // Start position of the text at the bottom of the screen
    textMesh.position.set(0, -30, 0);  // Adjust y-position as needed to start from the bottom
    textMesh.scale.set(1, 1, 1);  // Reset scale to original size
    scene.add(textMesh);

    // Log the text mesh to verify it's being added to the scene
    console.log("Created text mesh at position:", textMesh.position);

    // Animation loop for text (Trash-like Paper)
    const animateText = () => {
        const direction = new THREE.Vector3();
        direction.subVectors(blackHole.position, textMesh.position).normalize();
        textMesh.position.add(direction.multiplyScalar(0.05));

        // Scale down text as it approaches the black hole
        const distance = textMesh.position.distanceTo(blackHole.position);
        if (distance < 10) {  // Start scaling down when it gets within 10 units of the black hole
            textMesh.scale.setScalar(distance / 10);  // Scale down based on distance
        }

        if (textMesh.scale.length() < 0.01) {
            scene.remove(textMesh);
            console.log("Text mesh absorbed by black hole.");
        } else {
            requestAnimationFrame(animateText);
        }
    };

    animateText();
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

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});













// // Import Three.js as a module
// import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';

// // Variables to hold the text mesh
// let textMesh = null;

// // Clear the input field
// const clearButton = document.getElementById('clearButton');
// const messageInput = document.getElementById('messageInput');
// const throwButton = document.getElementById('throwButton');

// clearButton.addEventListener('click', () => {
//     messageInput.value = ''; 
// });

// throwButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     if (message.trim()) {
//         console.log("Throwing message", message);
//         if (textMesh) {
//             // Remove the previous text mesh before creating a new one
//             scene.remove(textMesh);
//         }
//         createTextAndAnimate(message);
//         messageInput.value = '';  // Clear the input field
//     }
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

// // Create Absorbing Objects (Particles)
// const objectGeometry = new THREE.SphereGeometry(0.2, 16, 16);
// const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const objects = [];

// for (let i = 0; i < 50; i++) {
//     const obj = new THREE.Mesh(objectGeometry, objectMaterial);
//     resetObjectPosition(obj);  // Initialize the object position
//     scene.add(obj);
//     objects.push(obj);
// }

// camera.position.z = 50;

// // Function to reset object position
// function resetObjectPosition(obj) {
//     const spreadFactor = 50; // Increase to spread objects wider 
//     obj.position.set(
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor
//     );
//     obj.scale.set(1, 1, 1); // Reset scale to original size
// }

// // Create Canvas Texture for Text (Trash-like Paper)
// function createTextTexture(text) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.font = '12px Arial';  // Adjust font size and family as needed
//     context.fillStyle = 'yellow';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     canvas.width = 512;
//     canvas.height = 128;
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
// }

// // Create and Animate Text Plane (Trash-like Paper)
// function createTextAndAnimate(text) {
//     const texture = createTextTexture(text);
//     const material = new THREE.MeshBasicMaterial({ map: texture, transparent: false });
//     const geometry = new THREE.PlaneGeometry(10, 2.5);  // Adjust dimensions as needed
//     textMesh = new THREE.Mesh(geometry, material);
    
//     // Start position of the text at the bottom of the screen
//     textMesh.position.set(0, -30, 0);  // Adjust y-position as needed to start from the bottom
//     textMesh.scale.set(1, 1, 1);  // Reset scale to original size
//     scene.add(textMesh);

//     // Animation loop for text (Trash-like Paper)
//     const animateText = () => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, textMesh.position).normalize();
//         textMesh.position.add(direction.multiplyScalar(0.05));

//         // Scale down text as it approaches the black hole
//         const distance = textMesh.position.distanceTo(blackHole.position);
//         if (distance < 10) {  // Start scaling down when it gets within 10 units of the black hole
//             textMesh.scale.setScalar(distance / 10);  // Scale down based on distance
//         }

//         if (textMesh.scale.length() < 0.01) {
//             scene.remove(textMesh);
//         } else {
//             requestAnimationFrame(animateText);
//         }
//     };

//     animateText();
// }

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);

//     objects.forEach(obj => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, obj.position).normalize();
//         obj.position.add(direction.multiplyScalar(0.05));

//         // Scale down objects as they approach the black hole
//         if (obj.position.distanceTo(blackHole.position) < 3) {
//             obj.scale.multiplyScalar(0.95);
//         }

//         // Reset object after it has been fully absorbed (disappeared)
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


















// // Import Three.js as a module
// import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';

// // Clear the input field
// const clearButton = document.getElementById('clearButton');
// const messageInput = document.getElementById('messageInput');
// const throwButton = document.getElementById('throwButton');

// clearButton.addEventListener('click', () => {
//     messageInput.value = ''; 
// });

// throwButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     if (message.trim()) {
//         console.log("Throwing message:", message);
//         createTextAndAnimate(message);
//         messageInput.value = '';  // Clear the input field
//     }
// });

// // Scene, Camera, Renderer setup
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Adjust camera position to ensure everything is in view
// camera.position.z = 50;  // Move the camera back to see more of the scene

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
//     resetObjectPosition(obj);  // Initialize the object position
//     scene.add(obj);
//     objects.push(obj);
// }

// // Function to reset object position
// function resetObjectPosition(obj) {
//     const spreadFactor = 50; // Increase to spread objects wider 
//     obj.position.set(
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor
//     );
//     obj.scale.set(1, 1, 1); // Reset scale to original size
// }

// // Create Canvas Texture for Text
// function createTextTexture(text) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.font = '48px Arial';  // Adjust font size and family as needed
//     context.fillStyle = 'yellow';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     canvas.width = 512;
//     canvas.height = 128;
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
// }

// // Create and Animate Text Plane
// function createTextAndAnimate(text) {
//     const texture = createTextTexture(text);
//     const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
//     const geometry = new THREE.PlaneGeometry(20, 5);  // Increase dimensions to make it more visible
//     const textMesh = new THREE.Mesh(geometry, material);
    
//     // Start position of the text below the screen
//     textMesh.position.set(0, -50, 0);  // Start well below the camera's view
//     textMesh.scale.set(3, 3, 3);  // Temporarily increase the scale to make it more visible
//     scene.add(textMesh);

//     console.log("Created text mesh at position:", textMesh.position);

//     // Animation loop for text
//     const animateText = () => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, textMesh.position).normalize();
//         textMesh.position.add(direction.multiplyScalar(0.5));  // Increase speed to make it more visible

//         // Continuously log the text mesh's position to track its movement
//         console.log("Text mesh current position:", textMesh.position);

//         // Scale down text as it approaches the black hole
//         const distance = textMesh.position.distanceTo(blackHole.position);
//         if (distance < 10) {  // Start scaling down when it gets within 10 units of the black hole
//             textMesh.scale.setScalar(distance / 10);  // Scale down based on distance
//         }

//         if (textMesh.scale.length() < 0.01) {
//             scene.remove(textMesh);
//             console.log("Text mesh removed after absorption.");
//         } else {
//             requestAnimationFrame(animateText);
//         }
//     };

//     animateText();
// }

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);

//     objects.forEach(obj => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, obj.position).normalize();
//         obj.position.add(direction.multiplyScalar(0.05));

//         // Scale down objects as they approach the black hole
//         if (obj.position.distanceTo(blackHole.position) < 3) {
//             obj.scale.multiplyScalar(0.95);
//         }

//         // Reset object after it has been fully absorbed (disappeared)
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












// // Import Three.js as a module
// import * as THREE from 'https://unpkg.com/three@0.167.1/build/three.module.js';

// // Clear the input field
// const clearButton = document.getElementById('clearButton');
// const messageInput = document.getElementById('messageInput');
// const throwButton = document.getElementById('throwButton');

// clearButton.addEventListener('click', () => {
//     messageInput.value = ''; 
// });

// throwButton.addEventListener('click', () => {
//     const message = messageInput.value;
//     if (message.trim()) {
//         console.log("Throwing message:", message);
//         createTextAndAnimate(message);
//         messageInput.value = '';  // Clear the input field
//     }
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
//     resetObjectPosition(obj);  // Initialize the object position
//     scene.add(obj);
//     objects.push(obj);
// }

// camera.position.z = 30;

// // Function to reset object position
// function resetObjectPosition(obj) {
//     const spreadFactor = 50; // Increase to spread objects wider 
//     obj.position.set(
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor,
//         (Math.random() - 0.5) * spreadFactor
//     );
//     obj.scale.set(1, 1, 1); // Reset scale to original size
// }

// // Create Canvas Texture for Text
// function createTextTexture(text) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
//     context.font = '12px Arial';  // Adjust font size and family as needed
//     context.fillStyle = 'yellow';
//     context.textAlign = 'center';
//     context.textBaseline = 'middle';
//     canvas.width = 100;
//     canvas.height = 100;
//     context.fillText(text, canvas.width / 2, canvas.height / 2);
    
//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
// }

// // Create and Animate Text Plane
// function createTextAndAnimate(text) {
//     const texture = createTextTexture(text);
//     const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
//     const geometry = new THREE.PlaneGeometry(10, 2.5);  // Adjust dimensions as needed
//     const textMesh = new THREE.Mesh(geometry, material);
    
//     // Start position of the text at the bottom of the screen
//     textMesh.position.set(0, -100, 0);  // Adjust y-position as needed to start from the bottom
//     textMesh.scale.set(1, 1, 1);  // Reset scale to original size
//     scene.add(textMesh);

//     console.log("Created text mesh at position:", textMesh.position);

//     // Animation loop for text
//     const animateText = () => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, textMesh.position).normalize();
//         textMesh.position.add(direction.multiplyScalar(0.5));  // Increase speed to make it more visible

//         // Scale down text as it approaches the black hole
//         const distance = textMesh.position.distanceTo(blackHole.position);
//         if (distance < 10) {  // Start scaling down when it gets within 10 units of the black hole
//             textMesh.scale.setScalar(distance / 10);  // Scale down based on distance
//         }

//         if (textMesh.scale.length() < 0.01) {
//             scene.remove(textMesh);
//             console.log("Text mesh removed after absorption.");
//         } else {
//             requestAnimationFrame(animateText);
//         }
//     };

//     animateText();
// }

// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);

//     objects.forEach(obj => {
//         const direction = new THREE.Vector3();
//         direction.subVectors(blackHole.position, obj.position).normalize();
//         obj.position.add(direction.multiplyScalar(0.05));

//         // Scale down objects as they approach the black hole
//         if (obj.position.distanceTo(blackHole.position) < 3) {
//             obj.scale.multiplyScalar(0.95);
//         }

//         // Reset object after it has been fully absorbed (disappeared)
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
