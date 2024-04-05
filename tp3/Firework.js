import * as THREE from 'three'

class MyFirework {

    constructor(app, name) {
        this.app = app
        this.name = name

        this.done     = false 
        this.dest     = [] 
        
        this.vertices = null
        this.colors   = null
        this.geometry = null
        this.points   = null
        
        this.material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })
        
        this.height = 10
        this.speed = 60

        this.launch() 

    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL( THREE.MathUtils.randFloat( 0.1, 0.9 ), 1, 0.9 )
        let colors = [ color.r, color.g, color.b ]

        // let x = THREE.MathUtils.randFloat( -5, 5 ) 
        let x;
        do {
            x = THREE.MathUtils.randFloat(-20, 20);
        } while (x >= -10 && x <= 10);

        let y = THREE.MathUtils.randFloat( this.height * 0.9, this.height * 1.1)
        let z = THREE.MathUtils.randFloat( -5, 5 ) 
        this.dest.push( x, y, z ) 
        let vertices = [-4,-2.2,6]
        
        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material )
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add( this.points )  
    }

    /**
     * compute explosion
     * @param {*} vector 
     */


    explode(origin, n, rangeBegin, rangeEnd) {
        // Remove the original firework points
        this.app.scene.remove(this.points);
        this.points.geometry.dispose();
    
        // Create a new geometry and material for the explosion particles
        const explosionGeometry = new THREE.BufferGeometry();
        const explosionMaterial = new THREE.PointsMaterial({
            size: 0.1,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });
    
        // Set up arrays for vertices and colors
        const explosionVertices = [];
        const explosionColors = [];
    
        // Define color options
        const colors = [0xff0000, 0x00ff00, 0x0000ff]; // Red, Green, Blue
    
        // Create explosion particles in a radial pattern with a smaller radius
        for (let i = 0; i < n; i++) {
            const theta = Math.random() * Math.PI * 2; // Random angle
            const phi = Math.random() * Math.PI / 2; // Angle for radial direction
            const radius = THREE.MathUtils.randFloat(rangeBegin, rangeEnd) * 0.5; // Smaller radius
    
            const x = origin[0] + radius * Math.cos(theta) * Math.sin(phi);
            const y = origin[1] + radius * Math.cos(phi);
            const z = origin[2] + radius * Math.sin(theta) * Math.sin(phi);
    
            // Add vertex positions
            explosionVertices.push(x, y, z);
    
            // Add colors for each particle (choose from the predefined colors)
            const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
            explosionColors.push(color.r, color.g, color.b);
        }
    
        // Set attributes for the explosion geometry
        explosionGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(explosionVertices), 3));
        explosionGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(explosionColors), 3));
    
        // Create the explosion points
        this.explosionPoints = new THREE.Points(explosionGeometry, explosionMaterial);
        this.explosionPoints.name = this.name;
        this.explosionPoints.castShadow = true;
        this.explosionPoints.receiveShadow = true;
    
        // Add explosion points to the scene
        this.app.scene.add(this.explosionPoints);
    
        // Set a timeout to remove the explosion points after a certain time
        setTimeout(() => {
            this.app.scene.remove(this.explosionPoints);
            this.done = true;
        }, 1000); // Adjust the time as needed
    }
    

    /**
     * update firework
     * @returns 
     */
    update() {
        
        // do only if objects exist
        if( this.points && this.geometry )
        {
            let verticesAtribute = this.geometry.getAttribute( 'position' )
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // lerp particle positions 
            let j = 0
            for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed
            }
            verticesAtribute.needsUpdate = true
            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 40, this.height * 0.01, this.height * 0.2) 
                            // Set a timeout to remove the explosion points after a certain time
                    return
                }
            }
        }
    }
    
    
}

export { MyFirework }