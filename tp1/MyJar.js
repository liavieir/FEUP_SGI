import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

//Create the jar
class MyJar  {

    constructor(app) {
        
        this.jarTexture = new THREE.TextureLoader().load("textures/jar.jpg");
        this.jarTexture.wrapS = THREE.RepeatWrapping;
        this.jarTexture.wrapT = THREE.RepeatWrapping;
        this.jarMaterial= new THREE.MeshPhongMaterial({emissive: "#000000", shininess: this.planeShininess, map: this.jarTexture, side: THREE.DoubleSide})

        let jar = new THREE.Group();
     
        let jarFront = new MyNurbsBuilder(
            [[ // V = 0..3;
            [-0.5, -1.0, 0, 1],
            [-1.0, 0.0, 0, 1],
            [-0.125, 0.5, 0, 1],
            [-0.25, 1.0, 0, 1]
        ],

        // U = 1
        [ // V = 0..3;
            [-0.45, -1.0, 0.5, 1],
            [-0.45, -0.5, 1.0, 1],
            [-0.45, -0.5, 0, 1],
            [-0.25, 1.0, 0.35, 1]
        ],

        // U = 2
        [ // V = 0..3;
            [0.45, -1.0, 0.5, 1],
            [0.45, -1.0, 0.5, 1],
            [0.45, -0.5, 0, 1],
            [0.25, 1.0, 0.35, 1]
        ],
        // U = 3
        [ // V = 0..3;
            [0.5, -1.0, 0.0, 1],
            [1.0, 0.0, 0.0, 1],
            [0.125, 0.5, 0.0, 1],
            [0.25, 1.0, 0.0, 1]
        ],]
        ,3,3,40,40,this.jarMaterial, app); 
        
        this.frontMesh = jarFront.createNurbsSurfaces();
        this.frontMesh.castShadow = true;
        jar.add(this.frontMesh);
        

        let jarBack = new MyNurbsBuilder(
            [[ // V = 0..3;
            [-0.5, -1.0, 0, 1],
            [-1.0, 0.0, 0, 1],
            [-0.125, 0.5, 0, 1],
            [-0.25, 1.0, 0, 1]
        ],

        // U = 1
        [ // V = 0..3;
            [-0.45, -1.0, 0.5, 1],
            [-0.45, -0.5, 1.0, 1],
            [-0.45, -0.5, 0, 1],
            [-0.25, 1.0, 0.35, 1]
        ],

        // U = 2
        [ // V = 0..3;
            [0.45, -1.0, 0.5, 1],
            [0.45, -1.0, 0.5, 1],
            [0.45, -0.5, 0, 1],
            [0.25, 1.0, 0.35, 1]
        ],
        // U = 3
        [ // V = 0..3;
            [0.5, -1.0, 0.0, 1],
            [1.0, 0.0, 0.0, 1],
            [0.125, 0.5, 0.0, 1],
            [0.25, 1.0, 0.0, 1]
        ],]
        ,3,3,40,40,this.jarMaterial, app);    

        this.backMesh = jarBack.createNurbsSurfaces();
        this.backMesh.scale.set(-1,1,-1);
        this.backMesh.castShadow = true;
        jar.add(this.backMesh);

        this.jar = jar;

    }

}

export { MyJar }; 