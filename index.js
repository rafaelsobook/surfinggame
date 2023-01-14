const { Engine,DirectionalLight, ParticleSystem, Scene, ExecuteCodeAction, ActionManager, MeshBuilder,Vector3, HemisphericLight, ArcRotateCamera, SceneLoader, Color3} = BABYLON
const canvas = document.getElementById("renderCanvas")
const log = console.log
log(canvas)

let boardMoving = false
let intervalForSplash
let steerLeft = 0
let steerRight = 0

let goingRight = false
let goingLeft = false
class App{
    constructor(){
        this._engine = new Engine(canvas, true)
        this._scene = new Scene(this._engine)
        this._engine.displayLoadingUI()

        this.boardSpd = -.03
        this.windSpd = .29
        this.windDir = 'left'
        this.main()
    }

    async main(){
        await this._goToStart()

        this._engine.runRenderLoop( () => {
            this._scene.render()
        })
    }

    createSplashSmall(toCloneMesh, toClonePS, scene){

        const boxClone = MeshBuilder.CreateBox("asd", {size: .5}, scene)
        let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const splashPs = ParticleSystem.Parse(boardSplashJson, scene, "")
        splashPs.emitter = boxClone
        splashPs.stop()
        boxClone.isVisible = false
        return {box: boxClone, ps: splashPs}
    }
    async _goToStart(){
        let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}

        let floatingWaters = []
        let leftWindz = []
        let rightWindz = []
        let waves = []
        const scene = new Scene(this._engine)

        const light = new HemisphericLight("lug", new Vector3(0,10,0), scene)
        const dirLight = new DirectionalLight("lug", new Vector3(2,-1,4), scene)

        const cam = new ArcRotateCamera("arc",-1,0,197, new Vector3(0,0,1), scene)
        // cam.attachControl(canvas, true)

        const boardSplashPS = ParticleSystem.Parse(boardSplashJson, scene, "")
    
        const box = MeshBuilder.CreateBox("asd", {size: .5}, scene)
        const farent = MeshBuilder.CreateBox("farent", {size: 10.5}, scene)
        const Wave = await SceneLoader.ImportMeshAsync("", "./models/", "waves.glb", scene)
        Wave.meshes[1].parent = null
        Wave.meshes[1].position.y += 1000
        for (let p = 0; p < 140; p++) {
            const mySpd = .009 + Math.random()*.005
            const newWave = Wave.meshes[1].createInstance('newWave')
            const fId = Math.random().toString()
            newWave.parent = null
      	    newWave.position.x = BABYLON.Scalar.RandomRange(-175, 175);
            newWave.position.y = BABYLON.Scalar.RandomRange(0,0);
            newWave.position.z = BABYLON.Scalar.RandomRange(-175, 175);
            newWave.actionManager = new ActionManager(scene)
            newWave.freezeWorldMatrix()
            floatingWaters.push({_id: fId, spd: mySpd, mesh: newWave, isDown: Math.random() > .05 ? true : false })
        }
        const Board = await SceneLoader.ImportMeshAsync("", "./models/", "board.glb", scene)
        const theBoard = Board.meshes[0]
        theBoard.parent = farent
        farent.position = new Vector3(0,6.9,25)
        box.parent =  theBoard
        boardSplashPS.emitter = box
        // boardSplashPS.gravity = new Vector3(0,20,0)
        box.position = new Vector3(0,0,4.6)
        box.isVisible = false
        farent.isVisible = false


        const theFront = this.createSplashSmall(box, boardSplashPS, scene)
        theFront.box.parent = theBoard;theFront.box.position = new Vector3(0,0,-4.4)

        const fPos = theFront.box.position
        cam.setTarget(new Vector3(fPos.x,fPos.y,fPos.z))
        cam.alpha = Math.PI + Math.PI/2
        cam.beta = .47

        // start of babylon js playground
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

            
        var windMat = new BABYLON.StandardMaterial('spheremat', scene);
        windMat.useAlphaFromDiffuseTexture = true;
        // windMat.useSpecularOverAlpha = true;
        windMat.alphaCutOff = 0.1;
        windMat.diffuseTexture = new BABYLON.Texture("imagez/smoke.png", scene);
        windMat.diffuseTexture.hasAlpha = true;

        const Surfer = await SceneLoader.ImportMeshAsync("", "./models/", "surfer.glb", scene)

        Surfer.meshes.forEach(wve => wve.rotationQuaternion = null)
        const surfer = Surfer.meshes[0]
        surfer.position.y = 6.4
        surfer.scaling = new Vector3(7.5,7.5,7.5)

        farent.actionManager = new ActionManager(scene)



        // farent.actionManager.registerAction(new ExecuteCodeAction(
        //     {
        //         trigger: ActionManager.OnIntersectionenterTrigger,
        //         parameter: Surfer.meshes[1]
        //     }, e => {
        //         log('surfer is hit')
        //     }
        // ))
        
        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        this._engine.hideLoadingUI()

        setInterval(() => {
            if(Math.random() > .4){
                log("changing the wind direction")
                if(this.windDir === "left"){
                    setTimeout(() => this.windDir = "right", 1000)
                    this.showPrecaution(4000, "incoming wind from " + "right")
                }else{
                    setTimeout(() => this.windDir = "left", 1000)  
                    this.showPrecaution(4000, "incoming wind from " + "left")
                }
                   
            }
        }, 7000)

        // making clouds
        setInterval(() => {
            for (let win = 0; win < 5; win++) {
                const addSpd = Math.random()*.07
                const wind = BABYLON.MeshBuilder.CreateGround("wind", { height: 15, width: 90})
                wind.material = windMat
                wind.visibility = .2 + Math.random()*.3
        
                if(this.windDir === "left"){
                    wind.position.x = BABYLON.Scalar.RandomRange(-170, -200);
                }else if(this.windDir === "right"){
                    wind.position.x = BABYLON.Scalar.RandomRange(170, 200);
                }
                wind.position.y = BABYLON.Scalar.RandomRange(19,19);
                wind.position.z = BABYLON.Scalar.RandomRange(-80, 80);
    
                if(this.windDir === "left") leftWindz.push({mesh: wind, spd: addSpd})
                if(this.windDir === "right") rightWindz.push({mesh: wind, spd: addSpd})
                setTimeout(() => wind.dispose(), 10000)
            }
        }, 500)
          
        let bigSplashWaveJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":15,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":4,"maxLifeTime":4,"emitRate":1000,"gravity":[0,-4,0],"noiseStrength":[10,10,10],"color1":[0.00784313725490196,0.2823529411764706,0.2823529411764706,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.13725490196078433,0.15294117647058825,0.23529411764705882,1],"updateSpeed":0.045,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":1,"factor2":1.5},{"gradient":0.5,"factor1":2,"factor2":2.5},{"gradient":1,"factor1":0.01,"factor2":0.5}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const bigSplashWave = ParticleSystem.Parse(bigSplashWaveJson, scene, "")
            

        // making big waves
        setInterval(() => {
            const bigwavePsClone = bigSplashWave.clone('bigSplashWave')
            const forPSMesh = MeshBuilder.CreateBox("bigwave", {size: .5}, scene)
            bigwavePsClone.emitter = forPSMesh
            bigwavePsClone.emitRate = BABYLON.Scalar.RandomRange(400, 2000)
           
            const movingWave = MeshBuilder.CreateBox("movingWave", {size: 5.5, width: 14}, scene)
            forPSMesh.parent = movingWave
            forPSMesh.rotation.z = Math.PI/2
            forPSMesh.position.y += 4
            

            movingWave.position.x = BABYLON.Scalar.RandomRange(-95, 95);
            movingWave.position.z = BABYLON.Scalar.RandomRange(-90, -120);
            // movingWave.position.z = BABYLON.Scalar.RandomRange(-40, 60);
            movingWave.position.y = BABYLON.Scalar.RandomRange(2,2);
            

            waves.push({mesh: movingWave, spdRise: Math.random()*.1})
            movingWave.isVisible = false
            
            farent.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger, 
                        parameter: { 
                            mesh: movingWave, 
                            usePreciseIntersection: true
                        }
                    }, () => { log("yahooo")}
                )
            );

            setTimeout(() => {
                bigwavePsClone.dispose()
                movingWave.dispose()
            }, 50000)
        },5000)
        // bigSplashWave.disposeOnStop = true
        bigSplashWave.stop()
        this.showPrecaution(4000, "incoming wind from left")

        scene.registerBeforeRender(() => {
            waves.forEach(wve => {
                wve.mesh.locallyTranslate(new Vector3(0,0,.5))
                if(wve.mesh.position.y < 8.8) wve.mesh.position.y += wve.spdRise
                
            })
            if(floatingWaters.length){
                floatingWaters.forEach(fwater => {
                    fwater.mesh.locallyTranslate(new Vector3(0,0,fwater.spd))
                   
                    if(fwater.mesh.position.z > 200) fwater.mesh.position.z = -150
                })
            }

            leftWindz.forEach(wnd => {
                wnd.mesh.locallyTranslate(new Vector3(this.windSpd+wnd.spd*this._engine.getDeltaTime(),0,0))
            })
            rightWindz.forEach(wnd => {
                wnd.mesh.locallyTranslate(new Vector3(-this.windSpd-wnd.spd*this._engine.getDeltaTime(),0,0))
            })
            if(boardMoving){ 
                farent.locallyTranslate(new Vector3(0,0,this.boardSpd*this._engine.getDeltaTime()))
            }else{ 
                if(farent.position.z < 40) farent.position.z += .4 
                this.windDir === "left" ? farent.position.x += this.windSpd : farent.position.x -= this.windSpd
            }

            if(goingRight){
                steerRight-=.02                
                boardMoving = true
                if(steerRight < -.239) return 
                // farent.rotation.y = -Math.PI/2 + .2
                farent.addRotation(0,steerRight,0)
            }
            if(goingLeft){
                steerLeft+=.02                
                boardMoving = true
                if(steerLeft > .239) return 
                // farent.rotation.y = -Math.PI/2 + .2
    
                farent.addRotation(0,steerLeft,0)
            }
        })

        this.pressControllers(boardSplashPS, theFront, farent)
    }
    pressControllers(boardSplashPS, theFront, farent){
        window.addEventListener("keyup", e => {
            if(e.key === " "){
                log(cam.radius)
                log(cam.alpha)
                log(cam.beta)
            }
            goingRight = false
            goingLeft = false
            steerRight = 0
            steerLeft = 0
            boardMoving = false
            boardSplashPS.stop()
            farent.rotationQuaternion = null
            farent.rotation.y = 0
            clearInterval(intervalForSplash)
        })
        window.addEventListener("keydown", e => {
            if(!boardMoving){
                boardSplashPS.start()
                clearInterval(intervalForSplash)
                intervalForSplash = setInterval(() => {
                    theFront.ps.emitRate = 1000 + Math.random()* 1000
                    theFront.ps.start()
                    theFront.ps.targetStopDuration = .8 + Math.random()*.5
            
                }, 2000)
            } 
            
            if(e.key === "ArrowRight"){
                goingRight = true
            }
            if(e.key === "ArrowLeft") {
                goingLeft = true
            }
        })
    }
    showPrecaution(dura, mes){
        const windPrec = document.querySelector(".wind-details")

        windPrec.innerHTML = mes
        windPrec.style.display = "block"
        setTimeout(() => {
            windPrec.style.display = "none"
        }, dura)
    }
}


new App