import * as THREE from 'three';
import { MyPainting } from './MyPainting.js';
import { MyCurve } from './MyCurve.js';


//Create the carocha painting
class MyCarocha  {

    constructor(app) {
        this.app = app;
        let carocha = new THREE.Group();

        //Create the painting
        let carochaPainting = new MyPainting(0,0,0,"textures/painting.jpg",7, 4, 0.0625);
        carocha.add(carochaPainting.paintingMesh);
        
        let halfCircle = [];

        for (let i = 0; i <= 50; i++) {
            let angle = i * Math.PI / 50;
            halfCircle.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
        }

        let quarterCircle = [];

        for (let i = 0; i < 9; i++) {
            let angle = i * Math.PI / 16;
            quarterCircle.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0.0));
        }

        let leftWheel = new MyCurve("catmull",halfCircle, new THREE.Vector3(-1.5,0,0),1, 160, { color: "#3d2b24" },app);
        let rightWheel = new MyCurve("catmull",halfCircle, new THREE.Vector3(1.5,0,0),1, 160, { color: "#3d2b24" },app);
        leftWheel.recompute();
        rightWheel.recompute();
        leftWheel.lineObj.translateZ(-0.1);
        leftWheel.lineObj.translateY(-1.3);
        rightWheel.lineObj.translateZ(-0.1);
        rightWheel.lineObj.translateY(-1.3);
        carocha.add(leftWheel.lineObj); 
        carocha.add(rightWheel.lineObj);



        // draw hood
        const hood = new MyCurve("catmull", quarterCircle, new THREE.Vector3(1.25,0,0),1, 160, { color: "#3d2b24" },app);

        hood.recompute();
        carocha.add(hood.lineObj); 
        hood.lineObj.translateZ(-0.1);
        hood.lineObj.translateX(-1.25);  
        hood.lineObj.translateY(0.2);  
        hood.lineObj.rotateZ(Math.PI/2);
 

        // draw windshield
        const windshield = new MyCurve("catmull", quarterCircle, new THREE.Vector3(0,1.25,0),1, 160, { color: "#3d2b24" },app);

        windshield.recompute();
        carocha.add(windshield.lineObj);  
        windshield.lineObj.translateZ(-0.1);  
        windshield.lineObj.scale.set(1.5,1.5,1.5);
        windshield.lineObj.translateY(-2.55); 
        windshield.lineObj.translateX(-1); 
        windshield.lineObj.rotateZ(Math.PI/2);

        
        // draw roof
        const roof = new MyCurve("catmull", quarterCircle, new THREE.Vector3(0,0,0),2.5, 200, { color: "#3d2b24" },app);

        roof.recompute();
        carocha.add(roof.lineObj);
        roof.lineObj.translateZ(-0.1);
        roof.lineObj.translateY(-1.3);

        this.carocha = carocha;

        
    }


}

export { MyCarocha };