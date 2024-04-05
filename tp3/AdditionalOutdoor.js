import * as THREE from 'three';

class AdditionalOutdoor {
    constructor(app) {
        this.app = app;

        // Create render targets for RGB and LGray images
        this.rgbRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.lGrayRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.depthMaterial = new THREE.MeshDepthMaterial();

        // Set up a clock to trigger the update every minute
        this.clock = new THREE.Clock();
        this.clock.start();
    }

    buildOutdoor() {
        const outdoorBox = new THREE.BoxGeometry(7.5, 4, 0.3);
        const outdoorBoxMaterial = new THREE.MeshPhongMaterial({ color: 0x800000, side: THREE.DoubleSide});
        const outdoorBoxMesh = new THREE.Mesh(outdoorBox, outdoorBoxMaterial);
        outdoorBoxMesh.position.set(20, 5, 40);
        outdoorBoxMesh.rotation.set(0, Math.PI/4, 0);
        this.app.scene.add(outdoorBoxMesh);

        const outdoorLeg = new THREE.BoxGeometry(0.5, 2, 0.3);
        const outdoorLegMesh = new THREE.Mesh(outdoorLeg, outdoorBoxMaterial);
        outdoorLegMesh.position.set(20, 2, 40);
        outdoorLegMesh.rotation.set(0, Math.PI/4, 0);
        this.app.scene.add(outdoorLegMesh);

        this.outdoor = new THREE.PlaneGeometry(6.5, 3.5, 50, 50);
        this.terrainShader = new THREE.TextureLoader().load("images/imageShader.png");
        this.bumpMapShader = new THREE.TextureLoader().load("images/heightmap2.png");

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                rgbTexture: { value: this.terrainShader },
                lGrayTexture: { value: this.bumpMapShader },
                maxHeight: { value: 1.0 },  // Adjust as needed
            },
            vertexShader: `
                varying vec2 fragTexCoord;

                uniform sampler2D rgbTexture;
                uniform sampler2D lGrayTexture; // Heightmap
                uniform float maxHeight; // Maximum height of the displacement

                void main() {
                    fragTexCoord = uv;

                    // Fetch height value from the grayscale texture
                    float height = texture2D(lGrayTexture, uv).r * maxHeight;

                    // Displace the vertex along the normal
                    vec3 displacedPosition = position + normal * height;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
                }
            `,
            fragmentShader: `
                varying vec2 fragTexCoord;

                uniform sampler2D rgbTexture;
                uniform sampler2D lGrayTexture; // Heightmap
                uniform float maxHeight; // Maximum height of the displacement

                void main() {
                    vec3 rgbColor = texture2D(rgbTexture, fragTexCoord).rgb;
                    gl_FragColor = vec4(rgbColor, 1.0);
                }
            `,
        });

        this.outdoorShader = new THREE.Mesh(this.outdoor, this.shader);
        this.outdoorShader.position.set(19.7, 5, 40);
        this.outdoorShader.rotation.set(0, -3*Math.PI/4, 0);
        this.app.scene.add(this.outdoorShader);

        return this.outdoorShader;
    }

    update() {
        // Check if a minute has passed
        if (this.clock.getElapsedTime() >= 5) {
            // Update clock
            this.clock.start();

            // Render scene to RGB and LGray textures
            this.app.renderer.setRenderTarget(this.rgbRenderTarget);
            this.app.renderer.render(this.app.scene, this.app.getActiveCamera());

            this.app.renderer.setRenderTarget(this.lGrayRenderTarget);
            this.app.renderer.render(this.app.scene, this.app.getActiveCamera(), this.depthMaterial);
            // Reset render target
            
            this.app.renderer.setRenderTarget(null);

            // Update shaders with the new textures
            this.shader.uniforms.rgbTexture.value = this.rgbRenderTarget.texture;
            this.shader.uniforms.lGrayTexture.value = this.lGrayRenderTarget.material;
        }

        // Call the update function recursively
        requestAnimationFrame(() => this.update());
    }
}

export { AdditionalOutdoor };
