import * as THREE from 'three';

//Create the paintings
class MyPainting  {

    constructor(x,y,z,texturePath, width, height, depth) {

        this.paintingTexture = new THREE.TextureLoader().load(texturePath);
        this.paintingTexture.wrapS = THREE.RepeatWrapping;
        this.paintingTexture.wrapT = THREE.RepeatWrapping;


        this.paintingMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: this.planeShininess, map: this.paintingTexture})


        let painting = new THREE.BoxGeometry( width, height, depth );
        this.paintingMesh = new THREE.Mesh( painting, this.paintingMaterial);
        this.paintingMesh.position.x = x;
        this.paintingMesh.position.y = y;
        this.paintingMesh.position.z = z;

    }

}

export { MyPainting };