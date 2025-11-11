let scene, camera, renderer, grandma, apples = [], stones = [], oranges = [];
let score = 0;

function createGrandma() {
    // Create grandma group
    grandma = new THREE.Group();
    
    // Body (dress)
    const dressGeometry = new THREE.ConeGeometry(1, 2, 8);
    const dressMaterial = new THREE.MeshPhongMaterial({ color: 0x800080 }); // Purple dress
    const dress = new THREE.Mesh(dressGeometry, dressMaterial);
    dress.position.y = 1;
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xFFE4B5 }); // Skin color
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    
    // Hair (grey bun)
    const hairGeometry = new THREE.SphereGeometry(0.4);
    const hairMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Grey hair
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 2.7;
    hair.position.z = -0.2;
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x800080 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-1, 1.8, 0);
    leftArm.rotation.z = Math.PI / 3;
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(1, 1.8, 0);
    rightArm.rotation.z = -Math.PI / 3;
    
    // Add all parts to grandma group
    grandma.add(dress);
    grandma.add(head);
    grandma.add(hair);
    grandma.add(leftArm);
    grandma.add(rightArm);
    
    // Position grandma
    grandma.position.y = -4;
    
    scene.add(grandma);
    return grandma;
}

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Replace basket creation with grandma
    grandma = createGrandma();
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 5);
    scene.add(directionalLight);
    
    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6;
    scene.add(ground);
    
    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
}

function createApple() {
    const appleGeometry = new THREE.SphereGeometry(0.5);
    const appleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const apple = new THREE.Mesh(appleGeometry, appleMaterial);
    apple.position.x = Math.random() * 20 - 10;
    apple.position.y = 10;
    apple.position.z = 0;
    scene.add(apple);
    apples.push(apple);
}

function createStone() {
    const stoneGeometry = new THREE.DodecahedronGeometry(0.5);
    const stoneMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        roughness: 0.8,
        metalness: 0.2
    });
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.x = Math.random() * 20 - 10;
    stone.position.y = 10;
    stone.position.z = 0;
    scene.add(stone);
    stones.push(stone);
}

function createOrange() {
    const orangeGeometry = new THREE.SphereGeometry(0.55);
    const orangeMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 }); // Orange color
    const orange = new THREE.Mesh(orangeGeometry, orangeMaterial);
    orange.position.x = Math.random() * 20 - 10;
    orange.position.y = 10;
    orange.position.z = 0;
    scene.add(orange);
    oranges.push(orange);
}

function onMouseMove(event) {
    const x = (event.clientX / window.innerWidth) * 20 - 10;
    grandma.position.x = x;
}

function onTouchMove(event) {
    event.preventDefault();
    const x = (event.touches[0].clientX / window.innerWidth) * 20 - 10;
    grandma.position.x = x;
}

function updateGame() {
    // Move and check apples
    apples.forEach((apple, index) => {
        apple.position.y -= 0.1;
        apple.rotation.x += 0.02;
        
        if (apple.position.y <= grandma.position.y + 3 &&
            apple.position.y >= grandma.position.y &&
            Math.abs(apple.position.x - grandma.position.x) < 1.5) {
            scene.remove(apple);
            apples.splice(index, 1);
            score++;
            document.getElementById('scoreValue').textContent = score;
        }
        
        if (apple.position.y < -6) {
            scene.remove(apple);
            apples.splice(index, 1);
        }
    });

    // Move and check oranges
    oranges.forEach((orange, index) => {
        orange.position.y -= 0.12; // Oranges fall slightly faster than apples
        orange.rotation.x += 0.03;

        if (orange.position.y <= grandma.position.y + 3 &&
            orange.position.y >= grandma.position.y &&
            Math.abs(orange.position.x - grandma.position.x) < 1.5) {
            scene.remove(orange);
            oranges.splice(index, 1);
            score += 2; // Oranges give more points
            document.getElementById('scoreValue').textContent = score;
        }

        if (orange.position.y < -6) {
            scene.remove(orange);
            oranges.splice(index, 1);
        }
    });

    // Move and check stones
    stones.forEach((stone, index) => {
        stone.position.y -= 0.15; // Stones fall slightly faster
        stone.rotation.x += 0.05;
        stone.rotation.y += 0.05;
        
        if (stone.position.y <= grandma.position.y + 3 &&
            stone.position.y >= grandma.position.y &&
            Math.abs(stone.position.x - grandma.position.x) < 1.5) {
            scene.remove(stone);
            stones.splice(index, 1);
            score--; // Decrease score when hitting stones
            document.getElementById('scoreValue').textContent = score;
            
            // Flash effect when hit by stone
            grandma.traverse((child) => {
                if (child.isMesh) {
                    const originalColor = child.material.color.getHex();
                    child.material.color.setHex(0xff0000);
                    setTimeout(() => {
                        child.material.color.setHex(originalColor);
                    }, 200);
                }
            });
        }
        
        if (stone.position.y < -6) {
            scene.remove(stone);
            stones.splice(index, 1);
        }
    });
    
    // Create new objects randomly
    if (Math.random() < 0.02) {
        createApple();
    }
    if (Math.random() < 0.015) { // Oranges appear occasionally
        createOrange();
    }
    if (Math.random() < 0.01) { // Stones appear less frequently
        createStone();
    }
    
    // Add subtle animation to grandma
    grandma.rotation.y = Math.sin(Date.now() * 0.002) * 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    updateGame();
    renderer.render(scene, camera);
}

init();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});