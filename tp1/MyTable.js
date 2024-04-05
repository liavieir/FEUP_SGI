import * as THREE from 'three';

//Create the cake
class MyTable  {

    constructor() {
        this.tableTexture = new THREE.TextureLoader().load('textures/wood-table.jpg');
        this.tableTexture.wrapS = THREE.RepeatWrapping;
        this.tableTexture.wrapT = THREE.RepeatWrapping;

        this.tableLegsMaterial = new THREE.MeshPhongMaterial({ color: "#6F4E37", 
        specular: "#FFFFFF", emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })

        this.tableMaterial = new THREE.MeshLambertMaterial({ map : this.tableTexture });



        let table = new THREE.Group();

        let tableTop = new THREE.BoxGeometry( 2.5, 5, 0.25 );
        this.tableTopMesh = new THREE.Mesh( tableTop, this.tableMaterial );
        this.tableTopMesh.rotation.x = Math.PI/2;
        this.tableTopMesh.rotation.z = Math.PI/2;
        this.tableTopMesh.position.y = 2.5;
        this.tableTopMesh.receiveShadow = true;
        this.tableTopMesh.castShadow = true;
        table.add( this.tableTopMesh );

        let tableLegBackLeft = new THREE.CylinderGeometry( 0.1, 0.1, 2.375, 32 );
        this.tableLegBackLeftMesh = new THREE.Mesh( tableLegBackLeft, this.tableLegsMaterial );
        this.tableLegBackLeftMesh.position.x = -2.3;
        this.tableLegBackLeftMesh.position.y = 1.1875;
        this.tableLegBackLeftMesh.position.z = -1;
        table.add( this.tableLegBackLeftMesh);

        let tableLegBackRight = new THREE.CylinderGeometry( 0.1, 0.1, 2.375, 32 );
        this.tableLegBackRightMesh = new THREE.Mesh( tableLegBackRight, this.tableLegsMaterial );
        this.tableLegBackRightMesh.position.x = 2.3;
        this.tableLegBackRightMesh.position.y = 1.1875;
        this.tableLegBackRightMesh.position.z = -1;
        table.add( this.tableLegBackRightMesh );

        let tableLegFrontLeft = new THREE.CylinderGeometry( 0.1, 0.1, 2.375, 32 );
        this.tableLegFrontLeftMesh = new THREE.Mesh( tableLegFrontLeft, this.tableLegsMaterial );
        this.tableLegFrontLeftMesh.position.x = -2.3;
        this.tableLegFrontLeftMesh.position.y = 1.1875;
        this.tableLegFrontLeftMesh.position.z = 1;
        table.add( this.tableLegFrontLeftMesh );

        let tableLegFrontRight = new THREE.CylinderGeometry( 0.1, 0.1, 2.375, 32 );
        this.tableLegFrontRightMesh = new THREE.Mesh( tableLegFrontRight, this.tableLegsMaterial );
        this.tableLegFrontRightMesh.position.x = 2.3;
        this.tableLegFrontRightMesh.position.y = 1.1875;
        this.tableLegFrontRightMesh.position.z = 1;
        table.add( this.tableLegFrontRightMesh );

        this.table = table;

    }

}

export { MyTable };