import * as THREE from 'three';

//Create the plate
class MyPlate  {

    constructor(radiusTop,radiusDown,height,numSeg) {


        this.diffusePlateColor = "#F5F5F5"
        this.plateMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlateColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })
     

        let plate = new THREE.CylinderGeometry(radiusTop,radiusDown,height,numSeg);
        this.plateMesh = new THREE.Mesh( plate, this.plateMaterial );

    }

}

export { MyPlate };