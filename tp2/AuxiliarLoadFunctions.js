import * as THREE from 'three';

/**
 * Loads a mipmap texture for a specific level and sets it in the parent texture.
 * @param {THREE.Texture} parentTexture - The parent texture to which the mipmap will be added.
 * @param {number} level - The mipmap level for which the texture is loaded.
 * @param {string} path - The path to the image file for the mipmap.
 */
function loadMipmap(parentTexture, level, path) {
    // Load the texture. On loaded, call the function to create the mipmap for the specified level.
    new THREE.TextureLoader().load(
        path,
        function (mipmapTexture) { // onLoad callback
            // Create a canvas and get its 2D context
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.scale(1, 1);

            // Set the canvas size based on the loaded image
            const img = mipmapTexture.image;
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Set the mipmap image in the parent texture at the appropriate level
            parentTexture.mipmaps[level] = canvas;
        },
        undefined, // onProgress callback (currently not supported)
        function (err) {
            console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err);
        }
    );
}


/**
 * Loads textures based on the provided texture data.
 * @param {Object} dataTextures - The data containing information about the textures.
 * @returns {Array} An array of loaded textures.
 */
export function loadTextures(dataTextures) {
    // Array to store loaded textures
    let textures = [];

    // Iterate over each texture in the provided data
    for (var key in dataTextures) {
        let texture = dataTextures[key];

        // Check if the texture is a video texture
        if (texture.isVideo) {
            // Get video and video source elements from the HTML document
            let video = document.getElementById("some-video");
            let source = document.getElementById("video-source");

            // Update the source attribute with the texture filepath
            source.src = texture.filepath;
            
            // Load the video
            video.load();

            // Create a VideoTexture using the loaded video
            let videoTexture = new THREE.VideoTexture(video);
            videoTexture.colorSpace = THREE.SRGBColorSpace;

            // Store the video texture in the textures array
            textures[texture.id] = videoTexture;

            // Continue to the next iteration of the loop
            continue;
        }

        // If the texture is not a video texture, load a regular texture
        let stillTexture = new THREE.TextureLoader().load(texture.filepath);

        // Apply texture filtering and anisotropy settings
        if (texture.magFilter !== "LinearFilter") {
            stillTexture.magFilter = THREE[texture.magFilter];
        }
        if (texture.minFilter !== "LinearMipmapLinearFilter") {
            stillTexture.minFilter = THREE[texture.minFilter];
        }
        if (texture.anisotropy !== 1) {
            stillTexture.anisotropy = texture.anisotropy;
        }

        // If mipmaps are not provided, generate them or load them individually
        if (!texture.mipmaps) {
            stillTexture.generateMipmaps = false;

            // Array of mipmap levels
            const mipmaps = ["mipmap0", "mipmap1", "mipmap2", "mipmap3", "mipmap4", "mipmap5", "mipmap6", "mipmap7"];

            // Iterate over each potential mipmap level
            for (const mipmap of mipmaps) {
                if (texture[mipmap]) {
                    // Load the mipmap for the specified level
                    loadMipmap(texture, parseInt(mipmap.charAt(mipmap.length - 1)), texture.filepath);
                }
            }
        }

        // Store the loaded texture in the textures array
        textures[texture.id] = stillTexture;
    }

    // Return the array of loaded textures
    return textures;
}


/**
 * Loads materials based on the provided material data and textures.
 * @param {Object} dataMaterials - The data containing information about the materials.
 * @param {Array} textures - An array of loaded textures to be used in materials.
 * @returns {Array} An array of loaded materials.
 */
export function loadMaterials(dataMaterials, textures) {
    // Array to store loaded materials
    let materials = [];

    // Iterate over each material in the provided data
    for (var key in dataMaterials) {
        let material = dataMaterials[key];

        // Create a new MeshPhongMaterial with specified properties
        let mat = new THREE.MeshPhongMaterial({
            color: material.color,
            emissive: material.emissive,
            wireframe: material.wireframe,
            shininess: material.shininess,
            specular: material.specular,
        });

        // Configure shading type based on the provided shading property
        if (material.shading === "flat") {
            mat.flatShading = true;
            mat.shading = THREE.FlatShading;
        } else if (material.shading === "smooth") {
            mat.shading = THREE.SmoothShading;
        } else if (material.shading === "none") {
            mat.shading = THREE.NoShading;
        } else {
            mat.shading = THREE.SmoothShading;
        }

        // Set material to be double-sided if specified
        if (material.twosided) {
            mat.side = THREE.DoubleSide;
        }

        // Check if the material has a texture reference
        if (material.textureref) {
            // Clone the texture from the textures array
            let texture = textures[material.textureref].clone();
            
            // Configure texture wrapping and repetition
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat = new THREE.Vector2(material.texlength_s, material.texlength_t);
            
            // Assign the texture to the material
            mat.map = texture;
            mat.needsUpdate = true;
        }

        // Check if the material has a bump map reference
        if (material.bumpref) {
            // Assign the bump map and scale to the material
            mat.bumpMap = textures[material.bumpref];
            mat.bumpScale = material.bumpscale;
        }


        // Check if the material has a specular map reference
        if (material.specularref) {
            // Assign the specular map to the material
            mat.specularMap = textures[material.specularref];
        }

        // Store the loaded material in the materials array
        materials[material.id] = mat;
    }

    // Return the array of loaded materials
    return materials;
}


/**
 * Loads cameras based on the provided camera data.
 * @param {Object} dataCameras - The data containing information about the cameras.
 * @returns {Array} An array of loaded camera instances.
 */
export function loadCameras(dataCameras) {
    // Array to store loaded camera instances
    let cameras = [];

    // Calculate the aspect ratio based on the current window size
    const aspect = window.innerWidth / window.innerHeight;

    // Iterate over each camera in the provided data
    for (var key in dataCameras) {
        let camera = dataCameras[key];

        // Check the type of the camera
        if (camera.type === "perspective") {
            // Create a new PerspectiveCamera with specified properties
            let cam = new THREE.PerspectiveCamera(camera.angle, aspect, camera.near, camera.far);
            
             // Set the position and target of the camera
            cam.position.set(camera.location[0], camera.location[1], camera.location[2]);
            cam.lookAt(camera.target[0], camera.target[1], camera.target[2]);
            
            // Store the camera instance in the cameras array
            cameras[camera.id] = cam;
        } else if (camera.type === "orthogonal") {
            // Create a new OrthographicCamera with specified properties
            let cam = new THREE.OrthographicCamera(
                camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far
            );
            
            // Set the position and target of the camera
            cam.position.set(camera.location[0], camera.location[1], camera.location[2]);
            cam.lookAt(new THREE.Vector3(camera.target[0], camera.target[1], camera.target[2]));
            
            // Store the camera instance in the cameras array
            cameras[camera.id] = cam;
        }
    }

    // Return the array of loaded camera instances
    return cameras;
}


/**
 * Creates a colored polygon geometry with specified parameters.
 * @param {number} radius - The radius of the polygon.
 * @param {number} stacks - The number of stacks (vertical subdivisions) in the polygon.
 * @param {number} slices - The number of slices (horizontal subdivisions) in the polygon.
 * @param {THREE.Color} color_c - The center color of the polygon.
 * @param {THREE.Color} color_p - The outer color of the polygon.
 * @returns {THREE.BufferGeometry} The colored polygon geometry.
 */
export function loadColoredPolygonGeometry(radius, stacks, slices, color_c, color_p) {
    // Create buffers for positions, colors, and indices
    const positions = [];
    const colors = [];
    const indices = [];
    const geometry = new THREE.BufferGeometry();

<<<<<<< HEAD

=======
>>>>>>> ad07bdd08f8009b75c9dcbd5cecd89f91f7efc6a
    // Create vertices for the polygon based on stacks and slices
    for (let i = 0; i <= stacks; i++) {
        const radiusAux = radius * (i / stacks);
        for (let j = 0; j <= slices; j++) {
            const theta = (j / slices) * 2 * Math.PI;
            const x = radiusAux * Math.cos(theta);
            const y = radiusAux * Math.sin(theta);
            positions.push(x, y, 0);

            // Calculate the interpolation factor based on the distance from the center
            const distanceFromCenter = Math.sqrt(x * x + y * y);
            const interpolationFactor = distanceFromCenter / radius;

            // Manually interpolate between color_c and color_p
            const interpolatedColor = new THREE.Color();
            interpolatedColor.r = color_c.r + (color_p.r - color_c.r) * interpolationFactor;
            interpolatedColor.g = color_c.g + (color_p.g - color_c.g) * interpolationFactor;
            interpolatedColor.b = color_c.b + (color_p.b - color_c.b) * interpolationFactor;

<<<<<<< HEAD
=======
            colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);
>>>>>>> ad07bdd08f8009b75c9dcbd5cecd89f91f7efc6a
        }
    }

    // Add indices for the faces
    for (let i = 0; i < stacks; i++) {
        for (let j = 0; j < slices; j++) {
            const a = i * (slices + 1) + j;
            const b = a + slices + 1;

            indices.push(a, b, a + 1);
            indices.push(b, b + 1, a + 1);
        }
    }

    // Set attributes and index for the geometry
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);

    return geometry;
}

