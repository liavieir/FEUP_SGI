import * as THREE from 'three';

class MyRoute{

    constructor(app, keyPoints, carModel, animationMaxDuration = 9, times = [0,1,2,3,4,5,6,7,8,9]) {
		this.app = app;
        this.carModel = carModel;
		this.keyPoints = keyPoints;
        this.lap = 0;

		this.clips = []

		this.clock = new THREE.Clock()

        this.mixerTime = 0
        this.mixerPause = false

        this.enableAnimationPosition = true
        this.animationMaxDuration = animationMaxDuration
        this.times = times;

		this.boxMesh = null
        this.boxMeshSize = 0.5
        this.boxEnabled = false
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

		this.init();
	}

	init(){
        const positionKF = new THREE.VectorKeyframeTrack('.position', this.times,
            [
                ...this.keyPoints[0],
                ...this.keyPoints[1],
                ...this.keyPoints[2],
                ...this.keyPoints[3],
                ...this.keyPoints[4],
				...this.keyPoints[5],
                ...this.keyPoints[6],
                ...this.keyPoints[7],
                ...this.keyPoints[8], 
                ...this.keyPoints[9]
            ],
            THREE.InterpolateSmooth
        )

		//rotation
        const yAxis = new THREE.Vector3(0, 1, 0)
        const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0)
        const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI/4)
        const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, - Math.PI/2)
        const q4 = new THREE.Quaternion().setFromAxisAngle(yAxis, -5 * Math.PI/6)
        const q5 = new THREE.Quaternion().setFromAxisAngle(yAxis, -3.5 * Math.PI/3)
		const q6 = new THREE.Quaternion().setFromAxisAngle(yAxis, - Math.PI)
        const q7 = new THREE.Quaternion().setFromAxisAngle(yAxis, - Math.PI)
        const q8 = new THREE.Quaternion().setFromAxisAngle(yAxis, - 8 * Math.PI/6)
        const q9 = new THREE.Quaternion().setFromAxisAngle(yAxis, -2 * Math.PI)
        const q10 = new THREE.Quaternion().setFromAxisAngle(yAxis, -2 * Math.PI)

        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', this.times,
            [q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q5.x, q5.y, q5.z, q5.w,
			q6.x, q6.y, q6.z, q6.w,
            q7.x, q7.y, q7.z, q7.w,
            q8.x, q8.y, q8.z, q8.w,
            q9.x, q9.y, q9.z, q9.w,
            q10.x, q10.y, q10.z, q10.w
        ]
        );

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])

        this.clips.push(positionClip);
        this.clips.push(rotationClip);

        this.mixer = new THREE.AnimationMixer(this.carModel)
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)

        positionAction.play()
        rotationAction.play()

    }

    buildRotationClip(){
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [this.quaternionKF])
        this.clips.push(rotationClip);
    }

    buildPositionKeyFrame(){
        let keyPointsArray = []
        for(let i= 0; i < this.keyPoints.length; i++){
            keyPointsArray.push(...this.keyPoints[i]);
            times.push(i);
        }
        this.positionKF = new THREE.VectorKeyframeTrack('.position', times,
            keyPointsArray,
            THREE.InterpolateSmooth 
        )
    }

    buildPositionClip(){
        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [this.positionKF])

        this.clips.push(positionClip);
    }

    mix(){
        for(let i = 0; i < this.clips.length; i++){
            this.actions.push(this.mixer.clipAction(this.clips[i]));
        }
    }

    play(){
        for(let i = 0; i < this.actions.length; i++){
            this.actions[i].play()
        }
    }

    update() {
        const delta = this.clock.getDelta()
        this.mixer.update(delta)
    }

    stopClock(){
        this.clock.stop();
    }

    resumeClock(){
        this.clock.start();
    }

    getCarModel(){
        return this.carModel;
    }

	update() {

        const delta = this.clock.getDelta()
        this.mixer.update(delta)

    }


    updateLap(){
        this.lap++;
        return this.lap;
    }

}

export {MyRoute}