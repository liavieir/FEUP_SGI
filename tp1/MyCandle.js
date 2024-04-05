import * as THREE from 'three';

//Create the candle
class MyCandle  {

    constructor() {

        this.diffuseCandleColor = "#fcc15e"
        this.candleMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCandleColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })

        this.diffuseFlameColor = "#FF0000"
        this.flameMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFlameColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })
            

        //Create the candle body
        let candle = new THREE.Group();
        let candleBase = new THREE.CylinderGeometry( 0.05, 0.05, 0.4, 32 );
        this.candleBaseMesh = new THREE.Mesh( candleBase, this.candleMaterial );
        this.candleBaseMesh.castShadow = true;
        candle.add( this.candleBaseMesh );

        //Create the flame
        let flame = new THREE.ConeGeometry( 0.03, 0.15, 32 );
        this.flameMesh = new THREE.Mesh( flame, this.flameMaterial );
        this.flameMesh.position.y = 0.25;
        this.flameMesh.castShadow = true;
        candle.add( this.flameMesh );


        this.candle = candle;  

    }

}

export { MyCandle };