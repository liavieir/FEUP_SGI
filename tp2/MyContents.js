import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MySceneData } from './parser/MySceneData.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { loadTextures, loadMaterials, loadColoredPolygonGeometry, loadCameras }from './AuxiliarLoadFunctions.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.app.scene.add(ambientLight);
        
        this.textures = [];
        this.materials = [];
        this.lights = [];
        this.cameras = [];

    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }



// Function to load a point light based on the provided child object
    loadPointLight(child) {
        // Create a new PointLight with parameters from the child object
        let light = new THREE.PointLight(child.color, child.intensity, child.distance, child.decay);
        
        // Set the position of the light using the child's position array
        light.position.set(child.position[0], child.position[1], child.position[2]);

        // Set whether the light should cast shadows based on the child's castshadow property
        light.castShadow = child.castshadow;

        // Set the far property of the shadow camera based on the child's shadowfar property
        light.shadow.camera.far = child.shadowfar;

        // Set the height and width of the shadow map based on the child's shadowmapsize property
        light.shadow.mapSize.height = child.shadowmapsize;
        light.shadow.mapSize.width = child.shadowmapsize;

        // Create a PointLightHelper for visualization purposes and add it to the scene
        const pointLightHelper = new THREE.PointLightHelper(light);
        this.app.scene.add(pointLightHelper);

        // Store the light in the lights object with the provided child's id as the key
        this.lights[child.id] = light;

        // Return the created light
        return light;
    }


    // Function to load a spot light based on the provided child object
    loadSpotLight(child) {
        // Create a new SpotLight with parameters from the child object
        let light = new THREE.SpotLight(
            child.color,            // Light color
            child.intensity,        // Light intensity
            child.distance,         // Light distance
            (child.angle * Math.PI) / 180,   // Convert angle to radians
            child.penumbra,         // Light penumbra
            child.decay             // Light decay
        );
        
        // Set the position of the light using the child's position array
        light.position.set(child.position[0], child.position[1], child.position[2]);

        // Set whether the light should cast shadows based on the child's castshadow property
        light.castShadow = child.castshadow;

        // Set the far property of the shadow camera based on the child's shadowfar property
        light.shadow.camera.far = child.shadowfar;

        // Set the height and width of the shadow map based on the child's shadowmapsize property
        light.shadow.mapSize.height = child.shadowmapsize;
        light.shadow.mapSize.width = child.shadowmapsize;

        // Create a target for the spot light based on the child's target array
        let target = new THREE.Object3D();
        target.position.set(child.target[0], child.target[1], child.target[2]);
        
        // Set the target for the spot light
        light.target = target;

        // Add the target to the scene
        this.app.scene.add(target);

        // Create a SpotLightHelper for visualization purposes and add it to the scene
        const spotLightHelper = new THREE.SpotLightHelper(light);
        this.app.scene.add(spotLightHelper);

        // Store the light in the lights object with the provided child's id as the key
        this.lights[child.id] = light;

        // Return the created light
        return light;
    }


    // Function to load a directional light based on the provided child object
    loadDirectionalLight(child) {
        // Create a new DirectionalLight with parameters from the child object
        let light = new THREE.DirectionalLight(child.color, child.intensity);
        
        // Set the position of the light using the child's position array
        light.position.set(child.position[0], child.position[1], child.position[2]);

        // Set whether the light should cast shadows based on the child's castshadow property
        light.castShadow = child.castshadow;

        // Set the properties of the shadow camera based on the child's shadowleft, shadowright, shadowtop, shadowbottom, and shadowfar properties
        light.shadow.camera.left = child.shadowleft;
        light.shadow.camera.right = child.shadowright;
        light.shadow.camera.top = child.shadowtop;
        light.shadow.camera.bottom = child.shadowbottom;
        light.shadow.camera.far = child.shadowfar;

        // Set the height and width of the shadow map based on the child's shadowmapsize property
        light.shadow.mapSize.height = child.shadowmapsize;
        light.shadow.mapSize.width = child.shadowmapsize;

        // Create a DirectionalLightHelper for visualization purposes and add it to the scene
        const directionalLightHelper = new THREE.DirectionalLightHelper(light);
        this.app.scene.add(directionalLightHelper);

        // Store the light in the lights object with the provided child's id as the key
        this.lights[child.id] = light;

        // Return the created light
        return light;
    }

    // Function to be executed after the scene is loaded and before rendering
    onAfterSceneLoadedAndBeforeRender(data) {
        // Set global options from the provided data
        this.globals = data.options;

        // Set the background of the scene to the specified background color or texture
        this.app.scene.background = this.globals.background;

        // Set the fog of the scene based on the provided fog data
        this.app.scene.fog = data.fog;

        // Initialize arrays for textures, materials, cameras, and lights
        this.textures = [];
        this.materials = [];
        this.cameras = [];
        this.lights = [];

        // Load textures from the provided data
        this.textures = loadTextures(data.textures);

        // Load materials using the loaded textures
        this.materials = loadMaterials(data.materials, this.textures);

        // Load cameras from the provided data
        this.cameras = loadCameras(data.cameras);

        // Add the loaded cameras to the application
        this.app.addCamera(this.cameras);

        // Load nodes (objects) and create a group based on the provided scene data
        this.group = this.loadNodes(data.nodes.scene, data);

        // Add the loaded group to the scene
        this.app.scene.add(this.group);

        // Add lights to the application based on the loaded lights
        this.app.addLights(this.lights);

    }

    // Function to load nodes and create a group of objects based on the provided node data
    loadNodes(node, data, material) {
        // Create a new THREE.Group to hold the objects
        let group = new THREE.Group();

        // Check if the node is not of type "lod" (Level of Detail)
        if (node.type !== "lod") {
            // Check if the node has a valid material ID
            if (node.materialIds[0] !== undefined) {
                // Use the specified material based on the material ID
                material = this.materials[node.materialIds[0]];
            }
        }

        // Loop through each child of the node
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];

            // Load point light if the child is of type "pointlight"
            if (child.type === "pointlight") {
                let light = this.loadPointLight(child);
                group.add(light);
            }
            // Load spot light if the child is of type "spotlight"
            else if (child.type === "spotlight") {
                let light = this.loadSpotLight(child);
                group.add(light);
            }
            // Load directional light if the child is of type "directionallight"
            else if (child.type === "directionallight") {
                let light = this.loadDirectionalLight(child);
                group.add(light);
            }
            // Load primitive (mesh) if the child is of type "primitive"
            else if (child.type === "primitive") {
                let mesh = this.loadPrimitives(child, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                group.add(mesh);
            }
            // Load LOD node if the child is of type "lod"
            else if (child.type === "lod") {
                group.add(this.loadLODNodeRefs(child, material));
            }
            // Recursively load nodes for other types
            else {
                group.add(this.loadNodes(child, data, material));
            }
        }

        // Apply transformations to the group based on the provided transformations
        for (let i = 0; i < node.transformations.length; i++) {
            let trans = node.transformations[i];
            if (trans.type == "T") {
                group.translateX(trans.translate[0]);
                group.translateY(trans.translate[1]);
                group.translateZ(trans.translate[2]);
            } else if (trans.type == "R") {
                group.rotateX((trans.rotation[0] * Math.PI) / 180);
                group.rotateY((trans.rotation[1] * Math.PI) / 180);
                group.rotateZ((trans.rotation[2] * Math.PI) / 180);
            } else if (trans.type == "S") {
                group.scale.set(trans.scale[0], trans.scale[1], trans.scale[2]);
            }
        }

        // Enable casting and receiving shadows for the group
        group.castShadow = true;
        group.receiveShadow = true;

        // Return the created group
        return group;
    }


    // Function to load Level of Detail (LOD) nodes and create a LOD object based on the provided node data
    loadLODNodeRefs(node, material) {
        // Check if the node or its children are undefined
        if (node === undefined || node.children === undefined) {
            return;
        }

        // Create a new THREE.LOD (Level of Detail) object
        let lod = new THREE.LOD();

        // Loop through each child of the LOD node
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];

            // Load nodes and create a group based on the child's node data and material
            let group = this.loadNodes(child.node, material);

            // Check if the child has a minimum distance (mindist) defined
            if (child.mindist !== undefined) {
                // Add the group to the LOD with the specified minimum distance
                lod.addLevel(group, child.mindist);
            }
        }

        // Return the created LOD object
        return lod;
    }


    // Function to load primitive geometries (e.g., cylinder, sphere, box) based on the provided child data and material
    loadPrimitives(child, material) {
        const rep = child.representations[0];

        // Switch based on the subtype of the primitive
        switch (child.subtype) {
            case "cylinder":
                // Create a CylinderGeometry
                const geometryCylinder = new THREE.CylinderGeometry(rep.top, rep.base, rep.height, rep.stacks,
                    rep.slices, rep.capsclose, rep.thetastart, rep.thetalength);

                // Create a Mesh using the geometry and material
                let meshCylinder = new THREE.Mesh(geometryCylinder, material);
                meshCylinder.castShadow = true;
                meshCylinder.receiveShadow = true;
                return meshCylinder;

            case "rectangle":
                // Create a PlaneGeometry for a rectangle
                const xy1 = rep.xy1;
                const xy2 = rep.xy2;

                let width = Math.abs(xy2[0] - xy1[0]);
                let height = Math.abs(xy2[1] - xy1[1]);
                const geometryRectangle = new THREE.PlaneGeometry(width, height, rep.parts_x, rep.parts_y);

                let centerX = parseFloat((xy1[0] + xy2[0]) / 2);
                let centerY = parseFloat((xy1[1] + xy2[1]) / 2);
                geometryRectangle.translate(centerX, centerY, 0);

                // Create a Mesh using the geometry and material
                let meshRectangle = new THREE.Mesh(geometryRectangle, material);
                meshRectangle.castShadow = true;
                meshRectangle.receiveShadow = true;
                return meshRectangle;

            case "triangle":
                // Create a BufferGeometry for a triangle
                const xyz1Triangle = new THREE.Vector3().fromArray(rep.xyz1);
                const xyz2Triangle = new THREE.Vector3().fromArray(rep.xyz2);
                const xyz3Triangle = new THREE.Vector3().fromArray(rep.xyz3);

                const geometryTriangle = new THREE.BufferGeometry();
                const vertices = new Float32Array([...xyz1Triangle.toArray(), ...xyz2Triangle.toArray(), ...xyz3Triangle.toArray()]);
                geometryTriangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

                // Create a Mesh using the geometry and material
                const meshTriangle = new THREE.Mesh(geometryTriangle, material);
                meshTriangle.castShadow = true;
                meshTriangle.receiveShadow = true;
                return meshTriangle;

            case "sphere":
                // Create a SphereGeometry
                const geometrySphere = new THREE.SphereGeometry(rep.radius, rep.slices, rep.stacks,
                    rep.thetastart, rep.thetalength, rep.phistart, rep.philength);

                // Create a Mesh using the geometry and material
                let meshSphere = new THREE.Mesh(geometrySphere, material);
                meshSphere.castShadow = true;
                meshSphere.receiveShadow = true;
                return meshSphere;

            case "nurbs":
                // Create a NURBS surface using MyNurbsBuilder
                let controlpoints = [];
                let k = 0;
                for (let i = 0; i <= rep.degree_u; i++) {
                    const uRow = [];
                    for (let j = 0; j <= rep.degree_v; j++) {
                        const point = [rep.controlpoints[k].xx, rep.controlpoints[k].yy, rep.controlpoints[k].zz, 1];
                        uRow.push(point);
                        k++;
                    }
                    controlpoints.push(uRow);
                }

                // Use MyNurbsBuilder to create NURBS geometry
                let nurb = new MyNurbsBuilder(controlpoints, rep.degree_u, rep.degree_v, rep.parts_u, rep.parts_v);
                let geometryNurbs = nurb.createNurbsSurfaces();

                // Create a Mesh using the NURBS geometry and material
                let meshNurbs = new THREE.Mesh(geometryNurbs, material);
                meshNurbs.castShadow = true;
                meshNurbs.receiveShadow = true;
                return meshNurbs;

            case "box":
                // Create a BoxGeometry
                let xyz1 = rep.xyz1;
                let xyz2 = rep.xyz2;
                let geometryBox = new THREE.BoxGeometry(Math.abs(xyz2[0] - xyz1[0]), Math.abs(xyz2[1] - xyz1[1]), Math.abs(xyz2[2] - xyz1[2]), rep.parts_x, rep.parts_y, rep.parts_z);

                // Create a Mesh using the geometry and material
                let meshBox = new THREE.Mesh(geometryBox, material);
                return meshBox;

            case "skybox":
                // Create a Mesh for a skybox
                const center = rep.center;
                const geometrySkybox = new THREE.BoxGeometry(rep.size[0], rep.size[1], rep.size[2]);

                // Create an array of materials for each face of the skybox
                const materialsSkybox = [
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.front], side: THREE.DoubleSide }),
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.back], side: THREE.DoubleSide }),
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.up], side: THREE.DoubleSide }),
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.down], side: THREE.DoubleSide }),
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.left], side: THREE.DoubleSide }),
                    new THREE.MeshStandardMaterial({ map: this.textures[rep.right], side: THREE.DoubleSide })
                ];

                // Create a Mesh using the geometry and materials
                const meshSkybox = new THREE.Mesh(geometrySkybox, materialsSkybox);
                meshSkybox.position.set(...center);
                meshSkybox.emissive = rep.emissive;
                meshSkybox.emissiveIntensity = rep.emissiveIntensity;
                return meshSkybox;

            case "polygon":
                // Load a colored polygon geometry using custom function
                let polygonGeometry = loadColoredPolygonGeometry(rep.radius, rep.stacks, rep.slices, rep.color_c, rep.color_p);
                const materialPolygon = new THREE.MeshStandardMaterial({ flatShading: true });
                materialPolygon.vertexColors = true;

                // Create a Mesh using the geometry and material
                const polygonMesh = new THREE.Mesh(polygonGeometry, materialPolygon);
                return polygonMesh;

            default:
                // Log a warning for an unsupported primitive type
                console.warn(`Primitive type ${child.subtype} not found`);
                return null;
        }
    }

    
    update() {
        
    }
}

export { MyContents };

