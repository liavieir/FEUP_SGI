import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class Vehicle {
    constructor(app, path) {

        this.app = app;
        this.path = path;

        var group = new THREE.Group();
        var wheelFrontLeft = new THREE.Group();

        const pivotCube = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), new THREE.MeshBasicMaterial({ visible: false }));
        pivotCube.position.set(0, 0, 0); // Adjust the position according to the car's geometry
        group.add(pivotCube);

        const cylinderSide = new THREE.CylinderGeometry(0.09, 0.09, 0.001, 32);
        const tireTextureSide = new THREE.TextureLoader().load('images/tireSide.png');
        const tireSideMaterial = new THREE.MeshStandardMaterial({ map: tireTextureSide });
        const tireSide = new THREE.Mesh(cylinderSide, tireSideMaterial);
        tireSide.position.set(0, -0.025, -0.001);
        wheelFrontLeft.add(tireSide);
        wheelFrontLeft.name = "wheel1";
        
        const cylinder = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 32);
        const tireTexture = new THREE.TextureLoader().load('images/tireTexture.png');
        const wheelMaterial = new THREE.MeshStandardMaterial({ map: tireTexture });
        const wheelFrontLeftMesh = new THREE.Mesh(cylinder, wheelMaterial);
        wheelFrontLeft.add(wheelFrontLeftMesh);

        wheelFrontLeft.rotation.z = Math.PI/2;
        wheelFrontLeft.position.set(0.22, -0.15, 0.35);
        const wheelBackLeft = wheelFrontLeft.clone();
        wheelBackLeft.position.set(0.22, -0.15, -0.37);
        const wheelFrontRight = wheelFrontLeft.clone();
        wheelFrontRight.position.set(-0.22, -0.15, 0.35);
        wheelFrontRight.rotation.z = -Math.PI/2;
        const wheelBackRight = wheelFrontLeft.clone();
        wheelBackRight.position.set(-0.22, -0.15, -0.37);
        wheelBackRight.rotation.z = -Math.PI/2;

    
        var wheels = new THREE.Group();
        wheels.add(wheelFrontLeft);
        wheels.add(wheelBackLeft);
        if(this.path.includes("cadillac")){
            wheels.position.z += 0.04;
        }
        wheels.add(wheelFrontRight);
        wheels.add(wheelBackRight);

        pivotCube.add(wheels);
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                const model = gltf.scene.children[0];
                model.rotation.y = Math.PI/2;
                model.scale.set(0.5, 0.5, 0.5);
                pivotCube.add(model);
                group.position.set(5, 0.5, 5);

                resolve(group);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
                }
            );
        });
    }
    
}

export { Vehicle };