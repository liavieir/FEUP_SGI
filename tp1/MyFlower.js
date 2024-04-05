import * as THREE from 'three';
import { MyCurve } from './MyCurve.js';

//Create the flower
class MyFlower  {

    constructor(app) {

        const middleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide, transparent: true, opacity: 1 })

        const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 1 }); 

            
        let petals = new THREE.Group();
        let flower = new THREE.Group();
        
        const petalGeometry = new THREE.CircleGeometry( 0.2, 32);

        // Position and create petals
        for (var i = 0; i < 6; i++) {
            const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
            petalMesh.scale.set(1, 0.5, 1); 
            petalMesh.rotation.z = (Math.PI / 3) * i;
            petalMesh.position.set(0.2 * Math.cos((Math.PI / 3) * i), 0.2 * Math.sin((Math.PI / 3) * i), 0);

            petalMesh.castShadow = true;
            petals.add(petalMesh);
        }

        flower.add(petals);

        const middleFront = new THREE.CircleGeometry( 0.1, 32);
        const middleFrontMesh = new THREE.Mesh( middleFront, middleMaterial );

        middleFrontMesh.translateZ(0.05);
        
        flower.add(middleFrontMesh);

        flower.rotateX(-Math.PI / 4);
        flower.rotateY(-Math.PI / 4);

        const stalk = new MyCurve("cubic", [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, -0.25, 0), new THREE.Vector3(-0, -0.5, 0), new THREE.Vector3(0, -1, 0)], new THREE.Vector3(0,0,0), 1, 160, { color: 0x1e4620, linewidth: 2 },app);
        stalk.recompute();  
        stalk.lineObj.position.set(7,5.8,2);
        stalk.lineObj.castShadow = true;
        
        this.flower = flower;  

    }

}

export { MyFlower };