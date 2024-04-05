import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';


class MyCurve  {

    constructor(geometry, points, position, scale,numberOfSamples,material,app) {
        this.app = app;
        this.geometry = geometry;
        this.position = position;
        this.scale = scale;
        this.points = points;
        this.numberOfSamples = numberOfSamples;
        this.material = material;
    }


    init() {
        this.quadraticBezierCurve = null
        this.cubicBezierCurve = null
        this.catmullRomCurve = null

        // number of samples to use for the curves
        this.numberOfSamples = this.numberOfSamples;

        // hull material and geometry
        this.hullMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, opacity: 0.5, transparent: true} );

        // curve recomputation
        this.recompute();
    }



    // Deletes the contents of the line if it exists and recreates them
    recompute() {

        if(this.geometry == "quadratic")
            this.initQuadraticBezierCurve()
        if(this.geometry == "cubic")
            this.initCubicBezierCurve()
        if(this.geometry == "catmull")
            this.initCatmullRomCurve()

    }


    drawHull(position, points) {

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( geometry, this.hullMaterial );

        // set initial position
        line.position.set(position.x, position.y, position.z);
    
        this.app.scene.add( line );

    }


    initQuadraticBezierCurve() {
    
        let curve = new THREE.QuadraticBezierCurve3( this.points[0], this.points[1], this.points[2])
    
        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( this.numberOfSamples );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
    
        this.lineMaterial = new THREE.LineBasicMaterial( this.material )
    
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
    
        this.lineObj.position.set(this.position.x,this.position.y,this.position.z)
        
        this.app.scene.add( this.lineObj );
    
    }

    initCubicBezierCurve() {
    
        let curve = new THREE.CubicBezierCurve3( this.points[0], this.points[1], this.points[2], this.points[3])
    
        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( this.numberOfSamples );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )
    
        this.lineMaterial = new THREE.LineBasicMaterial( this.material )
    
        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )
    
        this.lineObj.position.set(this.position.x,this.position.y,this.position.z)
    
        this.app.scene.add( this.lineObj );

    }

    initCatmullRomCurve(){

        let curve = new THREE.CatmullRomCurve3( this.points )

        // sample a number of points on the curve
        let sampledPoints = curve.getPoints( this.numberOfSamples );
    
        this.curveGeometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        this.lineMaterial = new THREE.LineBasicMaterial( this.material )

        this.lineObj = new THREE.Line( this.curveGeometry, this.lineMaterial )

        this.lineObj.position.set(this.position.x,this.position.y,this.position.z)

        this.lineObj.scale.set(this.scale, this.scale, this.scale)
        
        this.app.scene.add( this.lineObj );

    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {    

    }

}

export { MyCurve };
