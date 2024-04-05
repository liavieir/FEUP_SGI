import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyPlate } from './MyPlate.js';
import { MyRoom } from './MyRoom.js';
import { MyCake }  from './MyCake.js';
import { MyCandle } from './MyCandle.js';
import { MyTable } from './MyTable.js';
import { MyPainting } from './MyPainting.js';
import { MyCarocha } from './MyCarocha.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyCurve } from './MyCurve.js';
import { MyFlower } from './MyFlower.js';
import { MyJar } from './MyJar.js';


/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null


        this.newspaperTexture = new THREE.TextureLoader().load("textures/newspaper.jpg");
        this.newspaperTexture.wrapS = THREE.RepeatWrapping;
        this.newspaperTexture.wrapT = THREE.RepeatWrapping;

        this.newspaperMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: this.planeShininess, map: this.newspaperTexture, side: THREE.DoubleSide    })


        this.springMaterial = new THREE.MeshPhongMaterial({ color: "#000000",
        specular: "#000000", emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })

        this.shelfTexture = new THREE.TextureLoader().load('textures/wood-table.jpg');

        this.shelfMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: this.planeShininess, map: this.shelfTexture, side: THREE.DoubleSide    })

    }


    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 100, 100 );
        pointLight.position.set( 0, 10, 0 );
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 2000;
        pointLight.shadow.mapSize.height = 2000;
        this.app.scene.add( pointLight );


        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 7 );
        this.app.scene.add( ambientLight );


        // add a spotLight on top of the cake
        this.cakeSpotLight = new THREE.SpotLight(0xffffff, 8, 5,(20 * Math.PI) / 180, 0.2, 0);
        this.cakeSpotLight.position.set(1.5,6,1);
        this.cakeSpotLight.castShadow = true; 
        this.app.scene.add(this.cakeSpotLight);

        this.spotLightTarget = new THREE.Object3D();
        this.spotLightTarget.position.set(1.5,0,-1);
        this.app.scene.add(this.spotLightTarget);
        this.cakeSpotLight.target = this.spotLightTarget;
        
        //SpotLightHelper
        // this.spotLightHelper = new THREE.SpotLightHelper(this.cakeSpotLight);
        // this.app.scene.add(this.spotLightHelper);

        
        //Create the room
        this.room = new MyRoom();
        this.app.scene.add(this.room.room);

        // Create the table
        this.table = new MyTable();
        this.app.scene.add(this.table.table);

        //Create the cake
        this.cake = new MyCake();
        this.app.scene.add( this.cake.cake);
        this.cake.cake.position.y = 2.98;
        this.cake.cake.position.x = 1.5;
        

        //Create the plate
        this.plate = new MyPlate(0.75,0.75,0.1,32);
        this.plate.plateMesh.receiveShadow = true;
        this.plate.plateMesh.castShadow = true;
        this.app.scene.add( this.plate.plateMesh );
        this.plate.plateMesh.position.x = 1.5;
        this.plate.plateMesh.position.y = 2.675;
        
        
        //Create the candle
        this.candle = new MyCandle();
        this.app.scene.add( this.candle.candle );
        this.candle.candle.position.x = 1.5;
        this.candle.candle.position.y = 3.43; 

        
        //Create the paintings
        this.paintingLia = new MyPainting(-2,4,4.93,"textures/img_lia.jpg",2, 3, 0.125);
        this.paintingHugo = new MyPainting(2,4,4.93,"textures/img_hugo.jpg",2, 3, 0.125);
        this.app.scene.add( this.paintingLia.paintingMesh );
        this.app.scene.add( this.paintingHugo.paintingMesh );


        //Create the window
        this.window = new MyPainting(0,4,-4.93,"textures/window-garden.jpg",6, 3, 0.075);
        this.app.scene.add( this.window.paintingMesh );

        
        //Create the rug
        this.rug = new MyPainting(0,0.1,0,"textures/rug.jpg",10, 6, 0);
        this.app.scene.add( this.rug.paintingMesh );
        this.rug.paintingMesh.rotation.x = -Math.PI / 2;
        this.rug.paintingMesh.rotateY(Math.PI);
        this.rug.paintingMesh.receiveShadow = true;

        
        //Create the carocha painting
        this.carocha = new MyCarocha(this.app);
        this.app.scene.add( this.carocha.carocha );
        this.carocha.carocha.translateY(3.5);
        this.carocha.carocha.translateX(-7.4687);
        this.carocha.carocha.rotation.y = -Math.PI / 2;
        this.carocha.carocha.scale.set(0.75,0.75,0.75);

                
        //Create the newspaper
        const newspaper = new MyNurbsBuilder(
            [[[-0.5, 0.0, -0.5, 1],[-0.5, 0.0, 0.5, 1],[-0.5, 0.1, -0.5, 1 ]],[[0.5, 0.0, -0.5, 1],[0.5, 0.0, 0.5, 1],[0.5, 0.1, -0.5, 1]]]
            ,1,2,8,8,this.newspaperMaterial,this.app);  
         
        this.newspaperMesh = newspaper.createNurbsSurfaces();
        this.newspaperMesh.position.set(6.7,5.1,-2);
        this.newspaperMesh.rotateY(-Math.PI/4);
        this.app.scene.add(this.newspaperMesh);
        

        //Create the spring
        let springPoints = [];
        const numPoints = 200;
        const radius = 2;
        const height = 10;
        const numTurns = 5; 
        
        for (let i = 0; i < numPoints; i++) {
            const t = (i / (numPoints - 1)) * numTurns * Math.PI * 2;
            const x = radius * Math.cos(t);
            const y = radius * Math.sin(t);
            const z = (i / (numPoints - 1)) * height - height / 2;
            springPoints.push(new THREE.Vector3(x, y, z));
        }

        this.spring = new MyCurve("catmull",springPoints,new THREE.Vector3(0,1.25,0),1, 200, { color: 0x3f3f3f, linewidth: 2},this.app);
        this.spring.recompute();
        this.app.scene.add( this.spring.lineObj );
        this.spring.lineObj.position.set(-1.5,2.85,0);
        this.spring.lineObj.scale.set(0.1,0.1,0.1);
        this.spring.lineObj.rotation.set(0,-Math.PI/8,0);


        //Create the flower
        this.flower = new MyFlower(this.app);
        this.app.scene.add( this.flower.flower );
        this.flower.flower.position.set(7,5.8,2);


        //Create the jar
        this.jar = new MyJar(this.app);
        this.app.scene.add(this.jar.jar );
        this.jar.jar.position.set(7,4.6,2);
        this.jar.jar.scale.set(0.5,0.5,0.5);

        
        //Create the shelfs
        const shelfLeft = new THREE.BoxGeometry( 1, 0.2, 2.5 );
        this.shelfLeftMesh = new THREE.Mesh( shelfLeft, this.shelfMaterial );
        this.shelfLeftMesh.position.set(6.99,5,-1.5);
        this.shelfLeftMesh.castShadow = true;
        this.app.scene.add(this.shelfLeftMesh);

        const shelfRight = new THREE.BoxGeometry( 1, 0.2, 2.5 );
        this.shelfRightMesh = new THREE.Mesh( shelfRight, this.shelfMaterial );
        this.shelfRightMesh.position.set(6.99,4,2);
        this.shelfRightMesh.castShadow = true;
        this.app.scene.add(this.shelfRightMesh);
    

    }
    update(){

    }

}

export { MyContents };