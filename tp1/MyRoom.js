import * as THREE from 'three';

//Create the room
class MyRoom  {

    constructor() {

        this.wallMaterial = new THREE.MeshPhongMaterial({ color: "#F8F6F0", 
            specular: "#000000", emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide 
        })

        this.floorTexture = new THREE.TextureLoader().load('textures/wood-floor.jpg');
        this.floorMaterial = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: this.planeShininess, map: this.floorTexture })


        let room = new THREE.Group();


        //Create the floor
        let floor = new THREE.PlaneGeometry(15,10);
        this.floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        room.add( this.floorMesh );

        // Create 4 walls
        let backWall = new THREE.PlaneGeometry( 15, 7 );
        this.backWallMesh = new THREE.Mesh( backWall, this.wallMaterial );
        this.backWallMesh.rotation.x = -Math.PI;
        this.backWallMesh.position.y = 3.5;
        this.backWallMesh.position.z = -5;
        this.backWallMesh.receiveShadow = true;
        room.add( this.backWallMesh );

        let frontWall = new THREE.PlaneGeometry( 15, 7 );
        this.frontWallMesh = new THREE.Mesh( frontWall, this.wallMaterial );
        this.frontWallMesh.rotation.x = -Math.PI;
        this.frontWallMesh.position.y = 3.5;
        this.frontWallMesh.position.z = 5;
        this.frontWallMesh.receiveShadow = true;
        room.add( this.frontWallMesh );

        let rightWall = new THREE.PlaneGeometry( 10, 7 );
        this.rightWallMesh = new THREE.Mesh( rightWall, this.wallMaterial );
        this.rightWallMesh.rotation.y = -Math.PI/2;
        this.rightWallMesh.position.y = 3.5;
        this.rightWallMesh.position.x = 7.5;
        this.rightWallMesh.receiveShadow = true;
        room.add( this.rightWallMesh );

        let leftWall = new THREE.PlaneGeometry( 10, 7 );
        this.leftWallMesh = new THREE.Mesh( leftWall, this.wallMaterial );
        this.leftWallMesh.rotation.y = -Math.PI/2;
        this.leftWallMesh.position.y = 3.5;
        this.leftWallMesh.position.x = -7.5;
        this.leftWallMesh.receiveShadow = true;
        room.add( this.leftWallMesh );

        this.room = room;

    }

}

export { MyRoom };