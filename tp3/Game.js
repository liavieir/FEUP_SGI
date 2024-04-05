import * as THREE from 'three';
import { Vehicle } from './Vehicle.js';
import { MyMovingVehicle } from './MovingVehicle.js';
import { MyRoute } from './Route.js';
import { Reader } from './Reader.js';
import { Sprites } from './Sprites.js';
import { ObstaclesPark } from './ObstaclesPark.js';
import { SpeedObstacle } from './SpeedObstacle.js';
import { ToggleObstacle } from './ToggleObstacle.js';

class Game {

    constructor(app, setPause, endGame) {
        this.app = app
        this.setPause = setPause
        this.endGame = endGame
        this.axis = null
        this.sameLapPlayer = false;
        this.sameLapOpponent = false;

        this.timer = new THREE.Clock();
        this.elapsedTime = 0;
        this.isPaused = false;
        this.selectObstacle = false;
        this.samePowerUp = false;
        this.addedTimePowerUp = 0;
        this.effectEnabled = false;
        
    }


    handleMouseClicks(intersects) {
        if(this.selectObstacle){
            const clickedObstacle = intersects.filter(obj => obj.object.parent.parent.name === "speedObstacle" || obj.object.parent.parent.name === "toggleObstacle");
            this.obstacleSelected = "";
            switch(clickedObstacle[0].object.parent.parent.name) {
                case 'speedObstacle':
                    this.obstacleSelected = "speedObstacle";
                    break;
                case 'toggleObstacle':
                    this.obstacleSelected = "toggleObstacle";
                    break;
            }

    
            if(this.obstacleSelected != "") {
                this.app.setActiveCamera('trackView');
                this.selectObstacle = false;
                this.putObstacle = true;
            }
        } else if(this.putObstacle){
            const track = intersects.filter(obj => obj.object.parent.name === "track");
            if(track.length === 0) {
                return;
            }

            this.timeoutIdSamePowerUp = setTimeout(() => {
                this.samePowerUp = false;
            }, 6000);

            switch(this.obstacleSelected) {
                case 'speedObstacle':
                    const speedObstacle = new SpeedObstacle(this.app, 'models/snail_obstacle/PK22NN9V1ETF8MWR0I26Q0YVZ.gltf');
                    speedObstacle.then((group) => {
                        group.scale.set(0.25, 0.25, 0.25);
                        group.position.copy(track[0].point);
                        group.position.y = 0.5;
                        this.app.scene.add(group);
                        this.speedObstacles.push(group);
                    });  
                    break;
                case 'toggleObstacle':
                    let toggleObstacle = new ToggleObstacle(this.app, 'models/crab_obstacle/CE2UVTBFPTMTA7LU1N2T22NNX.gltf');
                    toggleObstacle.then((group) => {
                        group.scale.set(0.25, 0.25, 0.25);
                        group.position.y = 2;
                        group.rotation.set(0, Math.PI, 0);
                        group.position.copy(track[0].point);
                        this.app.scene.add(group);
                        this.toggleObstacles.push(group);
                    });   
                    break;
            }

            this.putObstacle = false;
            this.removePause();
            this.app.setActiveCamera('PerspectiveCar'); 
            
        }

    }

    handleKeyDown(event) {
        switch (event.key) {
            case ' ':
                this.outdoor.updateDifferenceTime(this.timer.elapsedTime);
                this.timer.stop();
                this.route.stopClock();
                this.setPause();    
                this.outdoor.updateStateOfGame("PAUSED");    
                this.isPaused = true;
                break;
        }
    }

    handleKeyUp(event) {
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty
    }

    init(playerCar = 'car1', opponentCar = 'car2') {
        this.playerCar = playerCar;
        this.opponentCar = opponentCar;
        this.app.setActiveCamera('PerspectiveCar');
        this.toggleObstacles = []
        this.speedObstacles = []
        this.speedPowerUps = [];
        this.timePowerUpsMesh = []; 
        this.timePowerUps = [];

        this.timer.start();

        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        ambientLight.intensity = 30;
        this.app.scene.add(ambientLight);

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 20

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );

        const reader = new Reader(this.app);
        this.track = reader.readTrack();
        this.speedObstacles = reader.readSpeedObstacles();
        this.toggleObstacles = reader.readToggleObstacles();
        this.speedPowerUps = reader.readSpeedPowerUps();
        this.timePowerUpsMesh = reader.readTimePowerUpsMesh();
        this.timePowerUps = reader.getTimePowerUps();
        this.outdoor = reader.readOutdoor();
        this.palmTrees = reader.readPalmTrees();
        this.rock = reader.readRock();
        this.skybox = reader.readSkyBox();
        this.additionalOutdoor = reader.readAdditionalOutdoor();
        this.water = reader.readWater();

        this.outdoor.getTimer(this.getTime.bind(this));
        this.outdoor.getSpeed(this.getSpeed.bind(this));
        this.outdoor.init();

        this.obstaclesPark = new ObstaclesPark(this.app);
        this.obstaclesPark.init();
        
        
        this.playerCarGroup = new Vehicle(this.app, this.getCarModel(this.playerCar));
        this.playerCarGroup.then((group) => {
            group.add(this.app.cameras['PerspectiveCar']);
            this.app.cameras['PerspectiveCar'].position.set(0, 0.5, -1);
            this.app.scene.add(group);

            this.playerCarMoving = new MyMovingVehicle(this.app, group);
        });

        

        this.getRoute();
        this.opponentCarGroup = new Vehicle(this.app, this.getCarModel(this.opponentCar));
        this.opponentCarGroup.then((group) => {
            this.app.scene.add(group);
            const routeParameters = this.getRoute();
            this.route = new MyRoute(this.app, routeParameters[0], group, routeParameters[1], routeParameters[2]);
        });

    }

    getRoute(){
        let routeParameters = [];
        switch(this.difficulty){
            case 1:
                this.endtimeOpponent = 3 * 20;
                routeParameters.push(this.keypoints);
                routeParameters.push(20);
                routeParameters.push([0,2,4,7,10,12,14,16,18,20]);
                return routeParameters;

            case 2:
                this.endtimeOpponent = 3 * 17;
                routeParameters.push(this.keypoints);
                routeParameters.push(17);
                routeParameters.push([0,2,4,7,10,12,14,15,16,17]);
                return routeParameters;

            case 3:
                this.endtimeOpponent = 3 * 13;
                routeParameters.push(this.keypoints);
                routeParameters.push(13);
                routeParameters.push([0,2,3,5,7,9,10,11,12,13]);
                return routeParameters;
        }
    }

    getCarModel(carOption){
        switch(carOption){
            case 'car1':
                this.keypoints= [
                    new THREE.Vector3(5, 0.5, 5),
                    new THREE.Vector3(4, 0.5, 15),
                    new THREE.Vector3(15, 0.5, 25),
                    new THREE.Vector3(-5, 0.5, 30),
                    new THREE.Vector3(-10, 0.5, 20),
                    new THREE.Vector3(-5, 0.5, 15),
                    new THREE.Vector3(-5, 0.5, 5),
                    new THREE.Vector3(0, 0.5, 0),
                    new THREE.Vector3(5, 0.5, 0),
                    new THREE.Vector3(5, 0.5, 5)
                ];
                return 'models/audi_car/CTZKCN1GJAU5KE5XYBXPWEQTQ.gltf';
            case 'car2':
                this.keypoints= [
                    new THREE.Vector3(5, 0.5, 5),
                    new THREE.Vector3(5, 0.5, 15),
                    new THREE.Vector3(15, 0.5, 25),
                    new THREE.Vector3(-5, 0.5, 30),
                    new THREE.Vector3(-10, 0.5, 20),
                    new THREE.Vector3(-5, 0.5, 15),
                    new THREE.Vector3(-5, 0.5, 5),
                    new THREE.Vector3(0, 0.5, 0),
                    new THREE.Vector3(5, 0.5, 0),
                    new THREE.Vector3(5, 0.5, 5)
                ];
                return 'models/cadillac_car/YUQZG80W41TON5XS1UHM3LE7K.gltf';
        }
    }

    checkOnTrack(position) {
        this.raycaster = new THREE.Raycaster();

        position.y+= 1;
        
        this.raycaster.set(position, new THREE.Vector3(0, -1, 0));
        
        const intersections = this.raycaster.intersectObjects([this.track.mesh]);
        
        return intersections.length === 0;
    }

    checkCollisions() {
        let durationCollision = 0;
        const car = this.playerCarMoving.getCar();
        const carBox = new THREE.Box3().setFromObject(car);
        const centerCar = new THREE.Vector3();
        carBox.getCenter(centerCar);
        this.carBoundingSphere = carBox.getBoundingSphere(new THREE.Sphere(centerCar));

        const opponentCar = this.route.getCarModel();
        const opponentCarBox = new THREE.Box3().setFromObject(opponentCar);
        const centerOpponentCar = new THREE.Vector3();
        opponentCarBox.getCenter(centerOpponentCar);
        this.opponentCarBoundingSphere = opponentCarBox.getBoundingSphere(new THREE.Sphere(centerOpponentCar));

        
        const dist = centerCar.distanceTo(centerOpponentCar);
        if(dist < (this.carBoundingSphere.radius + this.opponentCarBoundingSphere.radius)){
            this.playerCarMoving.updateMaxSpeed(0.2*0.7);
            durationCollision = 2000;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                this.playerCarMoving.updateMaxSpeed(0.2);
            }, durationCollision); // 2000 milliseconds = 2 seconds
        }


        for(const obstacle of this.toggleObstacles){
            if(this.effectEnabled){
                continue;
            }
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            const centerObstacle = new THREE.Vector3();
            obstacleBox.getCenter(centerObstacle);
            this.obstacleBoundingSphere = obstacleBox.getBoundingSphere(new THREE.Sphere(centerObstacle));

            const dist = centerCar.distanceTo(centerObstacle);
            if(dist < (this.carBoundingSphere.radius + this.obstacleBoundingSphere.radius)){
                this.effectEnabled = true;
                durationCollision = 3000;
                this.playerCarMoving.setToggleControls(true);
                this.outdoor.updateEffect(durationCollision);
                if (this.timeoutIdReverse) {
                    clearTimeout(this.timeoutIdReverse);
                }

                this.timeoutIdReverse = setTimeout(() => {
                    this.playerCarMoving.setToggleControls(false);
                    this.effectEnabled = false;
                }, durationCollision); // 5000 milliseconds = 5 seconds
            }
        }

        for(const obstacle in this.speedObstacles){
            if(this.effectEnabled){
                continue;
            }
            const obstacleBox = new THREE.Box3().setFromObject(this.speedObstacles[obstacle]);
            const centerObstacle = new THREE.Vector3();
            obstacleBox.getCenter(centerObstacle);
            this.obstacleBoundingSphere = obstacleBox.getBoundingSphere(new THREE.Sphere(centerObstacle));

            const dist = centerCar.distanceTo(centerObstacle);
            if(dist < (this.carBoundingSphere.radius + this.obstacleBoundingSphere.radius)){
                this.playerCarMoving.updateMaxSpeed(0.05);
                durationCollision = 5000;
                this.effectEnabled = true;
                this.outdoor.updateEffect(durationCollision);
                // Clear any existing timeout
                if (this.timeoutIdSpeedLow) {
                    clearTimeout(this.timeoutIdSpeedLow);
                }
        
                // Set a new timeout for 6 seconds
                this.timeoutIdSpeedLow = setTimeout(() => {
                    this.playerCarMoving.updateMaxSpeed(0.2);
                    this.effectEnabled = false;
                }, durationCollision); // 5000 milliseconds = 5 seconds
                
            }
        }

        for (const powerUp of this.speedPowerUps) {
            if(this.effectEnabled){
                continue;
            }
            const powerUpBox = new THREE.Box3().setFromObject(powerUp);
            const centerPowerUp = new THREE.Vector3();
            powerUpBox.getCenter(centerPowerUp);
            this.powerUpBoundingSphere = powerUpBox.getBoundingSphere(new THREE.Sphere(centerPowerUp));

            const dist = centerCar.distanceTo(centerPowerUp);
            if(dist < (this.carBoundingSphere.radius + this.powerUpBoundingSphere.radius)){
                durationCollision = 5000;
                this.effectEnabled = true;
                this.playerCarMoving.updateMaxSpeed(0.4);
                this.outdoor.updateEffect(durationCollision);
                
                if (this.timeoutIdSpeedIncrease) {
                    clearTimeout(this.timeoutIdSpeedIncrease);
                }
                
                this.timeoutIdSpeedIncrease = setTimeout(() => {
                    this.playerCarMoving.updateMaxSpeed(0.2);
                    this.effectEnabled = false;
                }, durationCollision); // 5000 milliseconds = 5 seconds
            }
        }


        for (const powerUp of this.timePowerUpsMesh) {
            if(this.effectEnabled){
                continue;
            }
            const powerUpBox = new THREE.Box3().setFromObject(powerUp);
            const centerPowerUp = new THREE.Vector3();
            powerUpBox.getCenter(centerPowerUp);
            this.powerUpBoundingSphere = powerUpBox.getBoundingSphere(new THREE.Sphere(centerPowerUp));

            const dist = centerCar.distanceTo(centerPowerUp);
            if((dist < (this.carBoundingSphere.radius + this.powerUpBoundingSphere.radius)) && !this.samePowerUp){
                this.samePowerUp = true;
                this.addedTimePowerUp -= 5;
                this.selectObstacle = true;
                this.outdoor.updateDifferenceTime(this.timer.elapsedTime);
                this.timer.stop();
                this.route.stopClock();
                this.isPaused = true;
                this.app.setActiveCamera('ObstaclesPark');
            }
            
        }

    }

    checkLapOver(){
        const carPosition = this.playerCarMoving.getCar().position.clone();
        const opponentCarPosition = this.route.getCarModel().position.clone();

        if(carPosition.x > 3.5 && carPosition.x < 6.5 && carPosition.z > 4 && carPosition.z < 6.5 && !this.sameLapPlayer){
            this.sameLapPlayer = true;
            this.lap = this.playerCarMoving.updateLap();
            this.outdoor.updateLap();
            this.timeoutIdSameLapPlayer = setTimeout(() => {
                this.sameLapPlayer = false;
            }, 5000); // 5000 milliseconds = 5 seconds
            if(this.lap > 3){
                this.removeEverythingScene();
                this.elapsedTime = this.outdoor.getExactTime() + this.addedTimePowerUp;
                this.endGame(this.endtimeOpponent, this.elapsedTime, this.playerCar, this.opponentCar);
            }

        }

        if(opponentCarPosition.x > 3.5 && opponentCarPosition.x < 6.5 && opponentCarPosition.z > 4 && opponentCarPosition.z < 6.5 && !this.sameLapOpponent){
            this.opponentLap = this.route.updateLap();
            this.sameLapOpponent = true;
            this.timeoutIdSameLapOpponent = setTimeout(() => {
                this.sameLapOpponent = false;
            }, 5000); // 5000 milliseconds = 5 seconds

            if(this.opponentLap > 3){
                this.route.stopClock();

            }
        }

    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());
    }

    removePause() {
        if (this.isPaused) {
            this.outdoor.updateStateOfGame("PLAYING"); 
            this.route.resumeClock();
            this.timer.start();
            this.isPaused = !this.isPaused;
        }

        return this.timer;
    }


    getTime() {
        return this.timer;
    }

    getSpeed() {
        if(this.route && this.playerCarMoving) {
            return this.playerCarMoving.getSpeed();
        }
    }

    removeEverythingScene() {
        while (this.app.scene.children.length > 0) {
            this.app.scene.remove(this.app.scene.children[0]);
        }
    }


    update() {
        if(this.selectObstacle || this.putObstacle){
        } 
        else if(this.route && this.playerCarMoving) {
            this.route.update();
            this.playerCarMoving.update();
            this.checkCollisions();
            this.outdoor.update();
            this.checkLapOver();
            this.carOnTrack = this.checkOnTrack(new THREE.Vector3().copy(this.playerCarMoving.getCar().position));
            this.additionalOutdoor.update(); 
            if(this.carOnTrack){
                this.playerCarMoving.updateMaxSpeed(0.2*0.7);
            }else{
                this.playerCarMoving.updateMaxSpeed(0.2);
            }

            if (!this.isPaused) {
                this.elapsedTime += this.timer.getDelta();
            }
            for(const powerUp of this.timePowerUps){
                powerUp.update();
            }
        } 
    }

}

export { Game };
