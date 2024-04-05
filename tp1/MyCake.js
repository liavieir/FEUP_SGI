import * as THREE from 'three';

//Create the cake
class MyCake  {

    constructor() {

        this.diffuseCakeColor = "#7B3F00"
        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCakeColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide})
         
     
        let cake = new THREE.Group();

        let cakeBody = new THREE.CylinderGeometry( 0.5, 0.5, 0.5, 32, 1, false, 0, Math.PI*5/3 );
        this.cakeBodyMesh = new THREE.Mesh( cakeBody, this.cakeMaterial );
        this.cakeBodyMesh.castShadow = true;
        this.cakeBodyMesh.receiveShadow = true;
        cake.add( this.cakeBodyMesh );
        
        let cakeSide = new THREE.PlaneGeometry( 0.5, 0.5 );
        this.cakeSideMesh = new THREE.Mesh( cakeSide, this.cakeMaterial );
        this.cakeSideMesh.rotation.y = Math.PI / 2;
        this.cakeSideMesh.position.z = 0.25;
        this.cakeSideMesh.castShadow = true;
        cake.add( this.cakeSideMesh );  

        let cakeSide2 = new THREE.PlaneGeometry( 0.5, 0.5 );
        this.cakeSide2Mesh = new THREE.Mesh( cakeSide2, this.cakeMaterial );
        this.cakeSide2Mesh.rotation.y = -Math.PI / 3 -Math.PI / 2;
        this.cakeSide2Mesh.translateX(0.25);
        this.cakeSide2Mesh.castShadow = true;
        cake.add( this.cakeSide2Mesh );
        
        this.cake = cake;
    }

}

export { MyCake };