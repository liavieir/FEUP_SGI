import * as THREE from "three";
import { SpeedObstacle } from "./SpeedObstacle.js";
import { ToggleObstacle } from "./ToggleObstacle.js";

class ObstaclesPark {

    constructor(app) {
        this.app = app;

        this.group = new THREE.Group();

    }


    init() {

        this.createObstaclesPark();
        this.app.scene.add(this.group);
        
    }

    async createObstaclesPark() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        this.group.add(ambientLight);

        let raft = await new SpeedObstacle(this.app, 'models/wood_raft/AW3WLU7BDZ5XMZGFCD0ARZBYW.gltf');
        raft.name = "raft";
        raft.position.set(20, 0.1, 0.5);
        raft.scale.set(2.5, 2.5, 2.5);
        raft.rotation.set(Math.PI/2, 0, 0);
        this.group.add(raft);


        let speedObstacle = await new SpeedObstacle(this.app, 'models/snail_obstacle/PK22NN9V1ETF8MWR0I26Q0YVZ.gltf');
        speedObstacle.name = "speedObstacle";
        speedObstacle.position.set(20, 0.9, -1);
        speedObstacle.scale.set(0.7, 0.8, 0.7);
        speedObstacle.rotation.set(0, Math.PI, 0);
        this.group.add(speedObstacle);
        

        let toggleObstacle = await new ToggleObstacle(this.app, 'models/crab_obstacle/CE2UVTBFPTMTA7LU1N2T22NNX.gltf');
        toggleObstacle.name = "toggleObstacle";
        toggleObstacle.position.set(20, 0.7, 2);
        toggleObstacle.scale.set(0.7, 0.7, 0.7);
        toggleObstacle.rotation.set(0, -Math.PI/2, 0);
        this.group.add(toggleObstacle);
    }

    update(){}

}

export { ObstaclesPark };