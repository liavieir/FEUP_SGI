import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";

/**
 *  This class contains the contents of out application
 */
class MyTrack {

  constructor(app) {
    this.app = app;
    this.axis = null;

    //Curve related attributes
    this.segments = 100;
    this.width = 2;
    this.textureRepeat = 1;
    this.showWireframe = true;
    this.showMesh = true;
    this.showLine = true;
    this.closedCurve = false;

    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0, 5),
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 0, 5),
      new THREE.Vector3(5, 0, 15),
      new THREE.Vector3(10, 0, 20),
      new THREE.Vector3(5, 0, 30),
      new THREE.Vector3(-15, 0, 25),
      new THREE.Vector3(-5, 0, 15),
      new THREE.Vector3(-5, 0, 5),
    ]);

    this.buildCurve();
    this.createStartLine();
  }

  buildCurve() {
    this.createCurveMaterialsTextures();
    this.createCurveObjects();
  }

  createCurveMaterialsTextures() {
    const texture = new THREE.TextureLoader().load("./images/sand_texture.jpg");
    texture.wrapS = THREE.RepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({ map: texture });
    this.material.map.repeat.set(3, 3);
    this.material.map.wrapS = THREE.RepeatWrapping;
    this.material.map.wrapT = THREE.RepeatWrapping;

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  }

  /**
   * Creates the mesh, the line and the wireframe used to visualize the curve
   */
  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3,
      this.closedCurve
    );
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    this.line = new THREE.Line(bGeometry, this.lineMaterial);

    this.curve = new THREE.Group();

    this.mesh.visible = this.showMesh;
    this.wireframe.visible = this.showWireframe;
    this.line.visible = this.showLine;

    this.curve.add(this.mesh);
    this.curve.add(this.line);

    this.curve.rotateZ(Math.PI);
    this.curve.scale.set(1,0.2,1);
    this.curve.name = "track";
    this.app.scene.add(this.curve);
  }

  createStartLine() {
    const startLineGeometry = new THREE.PlaneGeometry(3.35, 1);
    const startLineTexture = new THREE.TextureLoader().load('images/start_line.jpg');
    const startLineMaterial = new THREE.MeshBasicMaterial({ map: startLineTexture, side: THREE.DoubleSide });
    const startLine = new THREE.Mesh(startLineGeometry, startLineMaterial);
    startLine.position.set(5, 0.22, 5);
    startLine.rotateX(Math.PI / 2);
    this.app.scene.add(startLine);

    return startLine;

  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {}
}

export { MyTrack };
