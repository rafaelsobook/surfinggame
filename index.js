const { Engine,DirectionalLight, ParticleSystem, Scene, ExecuteCodeAction, ActionManager, MeshBuilder,Vector3, HemisphericLight, ArcRotateCamera, SceneLoader, Color3} = BABYLON
const canvas = document.getElementById("renderCanvas")
const startBtn = document.getElementById("startBtn")
const log = console.log
log(canvas)

let canKeyPress = true
let boardMoving = false
let surfingTo = undefined
let isSurfing = false
let doNotMove = true
let intervalForSplash
let intervalForSurferSplash

let steeringNum = 0
let sharkRadius = 70
let sharkRotatSpd = -.01
let isHunting = true
let sharKToChase = undefined

let goingRight = false
let goingLeft = false
let onBoard = true
let actionMode = "sitting"
let falling = false

// MAIN MESH IN THE GAME
let farent
let surferBody


class App{
    constructor(){
        this._engine = new Engine(canvas, true)
        this._scene = new Scene(this._engine)
        this._engine.displayLoadingUI()

        this.boardSpd = -.03
    
        this.windSpd = .29
        this.windDir = 'left'
        this.anims = []
        this.main()
    }
    setCamera(cam, meshTarg){
        const fPos = meshTarg.box.position
        cam.setTarget(new Vector3(fPos.x,fPos.y,fPos.z))
        cam.alpha = Math.PI + Math.PI/2
        cam.beta = .47
    }
    setUpCharacter(actionName, toParent, charBody, loc){

        actionMode = actionName

        charBody.parent = toParent
        charBody.position.y = loc.y
        charBody.position.z = loc.z
    }
    async main(){
        await this._goToStart()

        this._engine.runRenderLoop( () => {
            this._scene.render()
        })
    }

    createSplashSmall(scene){

        const box = MeshBuilder.CreateBox("asd", {size: .5}, scene)
        let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const splashPs = ParticleSystem.Parse(boardSplashJson, scene, "")
        splashPs.emitter = box
        splashPs.stop()
        box.isVisible = false
        return {box: box, ps: splashPs}
    }
    introStart(){
        actionMode = undefined
        this.playAnim(this.anims, "sittostand")
        setTimeout(() => {
            
            doNotMove = false
            this.setUpCharacter('surfing', farent, surferBody, {z: 1, y: -4.5})
        }, 2000)
    }
    async _goToStart(){
        
        let floatingWaters = []
        let leftWindz = []
        let rightWindz = []
        let waves = []
        const scene = new Scene(this._engine)

        const light = new HemisphericLight("lug", new Vector3(0,10,0), scene)
        const dirLight = new DirectionalLight("lug", new Vector3(2,-1,4), scene)

        const cam = new ArcRotateCamera("arc",-1,0,197, new Vector3(0,0,1), scene)
        // cam.attachControl(canvas, true)
        const { box, theFront, farent, boardSplashPS} = await this.createBoard(scene)
        
        // CREATING THE WATER THAT LOOPS
        const Wave = await SceneLoader.ImportMeshAsync("", "./models/", "waves.glb", scene)
        Wave.meshes[1].parent = null

        this.createWaters(60, Wave.meshes[1], floatingWaters, scene);  

        this.setCamera(cam, theFront)

        // start of babylon js playground
        this.createSkyBox(scene)

        const windMat = this.createWindMat(scene, 'smoke.png')

        const  { surferPs, surferBody, surferPsmesh, surfer, rightHand, leftHand} = await this.createSurfer(farent,scene)

        const Kite = await SceneLoader.ImportMeshAsync("", "./models/", "kite.glb", scene)
        const theKite = Kite.meshes[0]
        theKite.addRotation(.5,0,0);
        clearInterval(intervalForSurferSplash)
        intervalForSurferSplash = setInterval(() => {
            if(onBoard) return
            surferPs.emitRate = 500 + Math.random()* 500
            surferPs.start()
            surferPs.targetStopDuration = .5
        }, 2000)

        surferPsmesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger, 
                    parameter: { 
                        mesh: farent, 
                        usePreciseIntersection: true
                    }
                }, () => { 
                    if(falling) return log("i am falling stop climb")
                    canKeyPress = false
                    actionMode = "none"
                    doNotMove = true
                    const bPos = surferBody.getAbsolutePosition()
                    farent.position = new Vector3(bPos.x,6.9,bPos.z)
                    onBoard = true
                    
                    surferBody.lookAt(new Vector3(farent.position.x, surferBody.position.y, farent.position.z),0,0,0)
                    this.playAnim(this.anims, 'climb')
                    setTimeout(() =>{
                        canKeyPress = true
                        this.resetRotatAndDir(farent, surferBody)
                        surferBody.parent = farent
                        surferBody.position = new Vector3(0,0,3)

                        this.boardSpd = -.03
                        doNotMove = false
                        this.setUpCharacter('surfing', farent, surferBody, {z: 4, y: -4.5})
                    }, 1200)
                }
            )
        );
                
        this.setUpCharacter('sitting', farent, surferBody, {z: 4, y: -4.5})

        const {killerMesh,killerAnims, rotatingMesh} = await this.createKiller(scene, surferPsmesh)        

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        this._engine.hideLoadingUI()

        // changing wind direction every 7s
        setInterval(() => {
            sharkRotatSpd = BABYLON.Scalar.RandomRange(-.008,-.02)
            if(Math.random() > .1){
                log("changing the wind direction")
                if(this.windDir === "left"){
                    setTimeout(() =>{
                        this.windDir = "right"
                        
                    } , 1000)
                    this.showPrecaution(4000, "incoming wind from right")
                }else{
                    setTimeout(() =>{
                        this.windDir = "left"
                    }, 1000)  
                    this.showPrecaution(4000, "incoming wind from left")
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
          
        let bigSplashWaveJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":45,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":4,"maxLifeTime":4,"emitRate":1000,"gravity":[0,-4,0],"noiseStrength":[10,10,10],"color1":[0.00784313725490196,0.2823529411764706,0.2823529411764706,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.13725490196078433,0.15294117647058825,0.23529411764705882,1],"updateSpeed":0.045,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":1,"factor2":1.5},{"gradient":0.5,"factor1":2,"factor2":2.5},{"gradient":1,"factor1":0.01,"factor2":0.5}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const bigSplashWave = ParticleSystem.Parse(bigSplashWaveJson, scene, "")
            
        // making big waves
        setInterval(() => {
            if(doNotMove) return
            const bigwavePsClone = bigSplashWave.clone('bigSplashWave')
            const forPSMesh = MeshBuilder.CreateBox("bigwave", {size: .5}, scene)
            bigwavePsClone.emitter = forPSMesh
            bigwavePsClone.emitRate = BABYLON.Scalar.RandomRange(400, 2000)
           
            const movingWave = MeshBuilder.CreateBox("movingWave", {size: 5.5, width: 34}, scene)
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
                    }, () => {
                        if(!onBoard) return
                        farent.rotationQuaternion = null
                        if(goingLeft) farent.rotation = new Vector3(0,Math.PI/2,.76)
                        if(goingRight) farent.rotation = new Vector3(0,-Math.PI/2,-.76)
                        // farent.rotation.x = .7
                        // farent.rotation.y = Math.PI/2
                        if(goingLeft && this.windDir === 'left') return this.fall(farent,surferBody, Kite, surferPs, killerMesh, rotatingMesh)
                        if(goingRight && this.windDir === 'right') return this.fall(farent,surferBody, Kite, surferPs, killerMesh, rotatingMesh)
                        if(!boardMoving && onBoard) return this.fall(farent,surferBody, Kite, surferPs, killerMesh, rotatingMesh)
                        this.surfUp(movingWave, .6, 400)
                    }
                )
            );
            farent.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionExitTrigger, 
                        parameter: { 
                            mesh: movingWave, 
                            usePreciseIntersection: true
                        }
                    }, () => {
                        
                        if(!onBoard) return
                        if(onBoard){
                            farent.rotation.x = 0
                            farent.rotationQuaternion = null
       
                            farent.rotation.z = 0
                            farent.position.y = 6.9
                        }
                        log("farent left the wave")
                        this.surfDown(farent, .6)
                    }
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
                   
                    if(fwater.mesh.position.z > 150) fwater.mesh.position.z = -105
                })
            }
            leftWindz.forEach(wnd => {
                wnd.mesh.locallyTranslate(new Vector3(this.windSpd+wnd.spd*this._engine.getDeltaTime(),0,0))
            })
            rightWindz.forEach(wnd => {
                wnd.mesh.locallyTranslate(new Vector3(-this.windSpd-wnd.spd*this._engine.getDeltaTime(),0,0))
            })

            if(actionMode !== undefined){
                this.playAnim(this.anims, actionMode)
            }
            if(surfingTo) farent.position.z = surfingTo.getAbsolutePosition().z
            if(doNotMove) return

            if(falling){
                farent.addRotation(.09,0,0)
                farent.position.y -= .06
                
                surferBody.addRotation(.14,0,0)
                surferBody.position.y -= .06
                surferBody.position.z += .06
                return
            }

            // RELATED TO STEERING
            if(onBoard){
                const bodyPos = surferBody.getAbsolutePosition()
                theKite.position.x = bodyPos.x
                theKite.position.z = bodyPos.z - 15
                theKite.position.y = bodyPos.y
                this.playAnim(Kite.animationGroups, this.windDir)
                if(isHunting){
                    this.playAnim(killerAnims, "hunting")
                    rotatingMesh.addRotation(0,sharkRotatSpd,0)
                } 
                if(boardMoving){ 
                    farent.locallyTranslate(new Vector3(0,0,this.boardSpd*this._engine.getDeltaTime()))
                }else if(!boardMoving && surfingTo === undefined){ 
                    if(farent.position.z < 40) farent.position.z += .4 
                    this.windDir === "left" ? farent.position.x += this.windSpd : farent.position.x -= this.windSpd
                }
            }else if(!onBoard){
                if(farent.position.y < 6.8) farent.position.y += .05
                if(sharKToChase !== undefined){
                    const surfPos = surferBody.getAbsolutePosition()
                    killerMesh.lookAt(new Vector3(surfPos.x, killerMesh.position.y, surfPos.z),0,0,0)
                    killerMesh.locallyTranslate(new Vector3(0,0,.3))
                    this.playAnim(killerAnims, "charging")
                }
                this.playAnim(Kite.animationGroups, 'onsea')
                if(boardMoving){ 
                    actionMode = "swimming"
                    surferBody.locallyTranslate(new Vector3(0,0,this.boardSpd*this._engine.getDeltaTime()))
                }else{ 
                    if(surferBody.position.z < 40) surferBody.position.z += .4 
                }
            }
            if(goingRight){
                steeringNum-=.02                
                boardMoving = true
               
                if(steeringNum < -.239) return        
            }
            if(goingLeft){
                steeringNum+=.02                
                boardMoving = true
              
                if(steeringNum > .239) return 
            }
            !onBoard ? surferBody.addRotation(0,steeringNum,0) : farent.addRotation(0,steeringNum,0)         
        })
        
        this.pressControllers(killerMesh, rotatingMesh, Kite, boardSplashPS, theFront, farent, surferBody,surferPs, surferPsmesh)
    }
    pressControllers(killerMesh, rotatingMesh, Kite,boardSplashPS, theFront, farent, surferBody,surferPs, surferPsmesh){
        window.addEventListener("keyup", e => {
            if(e.key === " "){
                log(surferBody.getAbsolutePosition())
            }
            if(!canKeyPress) return
            if(surfingTo !== undefined){
                log("will fall after keyup")
                return this.fall(farent, surferBody, Kite, surferPs,killerMesh, rotatingMesh, surferBody)
            } 
            if(e.key === "ArrowRight" || e.key === "ArrowLeft"){
                this.boardSpd = -.03
                steeringNum = 0
                if(onBoard){
                    log('on board tayo kaya surfing dapat')
                    actionMode = "surfing"
                }else{
                    actionMode = "0sinking"
                }
                boardSplashPS.stop()
                this.resetRotatAndDir(farent, surferBody)
                clearInterval(intervalForSplash)
                surferPsmesh.position.z = 0
                surferPs.stop()
            }
        })
        window.addEventListener("keydown", e => {
            if(!canKeyPress) return log('cankeypress false')
            if(!boardMoving){
            
                clearInterval(intervalForSplash)
                intervalForSplash = setInterval(() => {
                    theFront.ps.emitRate = 1000 + Math.random()* 1000
                    theFront.ps.start()
                    theFront.ps.targetStopDuration = .8 + Math.random()*.5
                }, 500)
                
            } 
            if(!onBoard) surferPsmesh.position.z = -7.5
            surferPs.stop()
            if(e.key === "ArrowRight"){
                goingRight = true
                
                if(onBoard) actionMode = "surfright"
  
                if(this.windDir === 'right'){      
                    log("wind is coming from right")              
                    if(this.boardSpd < 0 && onBoard) this.boardSpd += .0004
                }else{
                    this.boardSpd -= .001
                }
                
                boardSplashPS.stop()
            }
            if(e.key === "ArrowLeft") {
                goingLeft = true
     
                if(onBoard) actionMode = "surfleft"

                if(this.windDir === 'left'){       
                    log("wind is coming from left")             
                    if(this.boardSpd < 0 && onBoard) this.boardSpd += .0004
                }else{
                    this.boardSpd -= .001
                }
                
                boardSplashPS.stop()
            }
        })
    }
    resetRotatAndDir(farent, surferBody){
        farent.rotationQuaternion = null
        farent.rotation = new Vector3(0,0,0)
        surferBody.rotationQuaternion = null
        surferBody.rotation = new Vector3(0,0,0)
        goingRight = false
        goingLeft = false
        boardMoving = false
        steeringNum = 0
    }
    showPrecaution(dura, mes){
        const windPrec = document.querySelector(".wind-details")

        windPrec.innerHTML = mes
        windPrec.style.display = "block"
        setTimeout(() => {
            windPrec.style.display = "none"
        }, dura)
    }
    playAnim(anims, animName, isPerma){
        anims.forEach(ani=> ani.name === animName && ani.play(isPerma))
    }
    stopAnim(anims, animName){
        anims.forEach(ani => ani.name === animName && ani.stop())
    }
    fall(farent, surferBody, Kite, surferPs, killerMesh, rotatingMesh){
        let recoveryInterval
        actionMode = 'none'
        this.stopAnim(this.anims, 'surfing')
        surfingTo = undefined
        canKeyPress = false
        const fPos = farent.getAbsolutePosition()
        surferBody.parent = null
        surferBody.position = new Vector3(fPos.x, 1.8,fPos.z)
        falling = true
        Kite.animationGroups.forEach(ani => {
            if(ani.name === "falling"){
                ani.play()
            }else{
                ani.stop()
            }
        })
        surferPs.start()
        surferPs.targetStopDuration = .5
        setTimeout(() =>{
            const bPos = surferBody.getAbsolutePosition()
            this.resetRotatAndDir(farent, surferBody)
            farent.position.y = -5
            if(bPos.z > 35) surferBody.position.z = 34
            surferBody.position.y = -4
            this.boardSpd -.01
            falling = false 
            onBoard = false
            actionMode = "0sinking"
            canKeyPress = true
            steeringNum = 0
            this.sharkAlert(killerMesh, rotatingMesh, surferBody)
            clearInterval(recoveryInterval)
            recoveryInterval = setInterval(() => {
                if(onBoard) return clearInterval(recoveryInterval)
                if(surferBody.position.y < .6){
                    surferBody.position.y += .08
                    log('recovering')
                }else{
                    clearInterval(recoveryInterval)
                }
            },100)
        }, 4000)
    }
    surfUp(farent, toAddRotat, dura){
        surfingTo = farent
        isSurfing = true
        // farent.addRotation(0,0, goingLeft ? toAddRotat : -toAddRotat)
        // // farent.rotation.x = Math.PI/2
        // setTimeout( () => {
        //     farent.rotation.x =0
        //     farent.addRotation(0,0, goingLeft ? -toAddRotat : toAddRotat)
        // }, 200)
        // setTimeout(() => canKeyPress= true, 1000)
    }
    surfDown(farent, toAddRotat){
        surfingTo = undefined
        isSurfing = false
        // farent.rotation.x = 0
        // farent.rotation.y = 6.8
        // setTimeout( () => {
        //     // farent.addRotation(toAddRotat,0,0)
        //     farent.position.y = 6.9
        // }, 300)
    }
    sharkAlert(killerMesh, rotatingMesh, surferBody){
        const sharkPos = killerMesh.getAbsolutePosition()
        killerMesh.parent = null
        killerMesh.position = new Vector3(sharkPos.x, sharkPos.y,sharkPos.z)
        const surfPos = surferBody.getAbsolutePosition()
        killerMesh.lookAt(new Vector3(surfPos.x, killerMesh.position.y,surfPos.z),0,0,0)
        
        sharKToChase = surferBody
    }

    // CREATIONS
    createSkyBox(scene){
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("https://assets.babylonjs.com/textures/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }
    createWaters(length, toClone, floatingWaters, scene){
        for (let p = 0; p < length; p++) {
            const mySpd = .009 + Math.random()*.005
            const newWave = toClone.createInstance('newWave')
            const fId = Math.random().toString()
            newWave.parent = null
      	    newWave.position.x = BABYLON.Scalar.RandomRange(-145, 145);
            newWave.position.y = BABYLON.Scalar.RandomRange(0,0);
            newWave.position.z = BABYLON.Scalar.RandomRange(-105, 155);
            newWave.actionManager = new ActionManager(scene)
            newWave.freezeWorldMatrix()
            
            floatingWaters.push({_id: fId, spd: mySpd, mesh: newWave, isDown: Math.random() > .05 ? true : false })
        }
    }
    createWindMat(scene, image){
        var windMat = new BABYLON.StandardMaterial('spheremat', scene);
        windMat.useAlphaFromDiffuseTexture = true;
        // windMat.useSpecularOverAlpha = true;
        windMat.alphaCutOff = 0.1;
        windMat.diffuseTexture = new BABYLON.Texture(`imagez/${image}`, scene);
        windMat.diffuseTexture.hasAlpha = true;

        return windMat
    }
    async createKiller(scene, surferPsmesh){

        const killerMesh = MeshBuilder.CreateBox("killerMesh", {size: 8, depth: 30}, scene)
        const Killer = await SceneLoader.ImportMeshAsync("", "./models/", "surferkiller.glb", scene)
        const theKiller = Killer.meshes[0]
        
        theKiller.parent = killerMesh
        theKiller.rotationQuaternion = null
        const killerAnims = Killer.animationGroups

        killerMesh.position.x = sharkRadius

        const rotatingMesh = MeshBuilder.CreateBox("rotatingMesh", {size: 8, depth: 30}, scene)
        killerMesh.parent = rotatingMesh
        rotatingMesh.position = new Vector3(0,5,0)
        killerMesh.isVisible=false
        rotatingMesh.isVisible=false

        killerMesh.actionManager = new ActionManager(scene)
        killerMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnIntersectionEnterTrigger, 
                    parameter: { 
                        mesh: surferPsmesh, 
                        usePreciseIntersection: true
                    }
                }, () => { 
                    log("rawr")
                    killerAnims.forEach(ani => {
                        if(ani.name === `eat${Math.random() > .5? 1 : 2}`){
                            ani.play()
                        }else{
                            ani.stop()
                        }
                    })
                    sharKToChase = undefined
                    surferPsmesh.parent.position.y = -70
                }
            )
        );

        return {killerMesh, killerAnims, rotatingMesh}
    }
    async createBoard(scene){
        let boardSplashJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.5,"radiusRange":1,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":1,"maxLifeTime":1.5,"emitRate":1000,"gravity":[0,1,10],"noiseStrength":[10,10,10],"color1":[0.12156862745098039,0.45098039215686275,0.403921568627451,1],"color2":[0.0196078431372549,0.1568627450980392,0.20784313725490197,1],"colorDead":[0.5372549019607843,0.5764705882352941,0.5686274509803921,1],"updateSpeed":0.029,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0.01,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.1,"factor2":0.71},{"gradient":0.87,"factor1":0.1,"factor2":0.3},{"gradient":1,"factor1":0.009,"factor2":0.01}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const boardSplashPS = ParticleSystem.Parse(boardSplashJson, scene, "")
        const theBack = MeshBuilder.CreateBox("asd", {size: .5}, scene)
        farent = MeshBuilder.CreateBox("farent", {size: 4}, scene)

        const Board = await SceneLoader.ImportMeshAsync("", "./models/", "board.glb", scene)
        const theBoard = Board.meshes[0]
        theBoard.parent = farent
        farent.position = new Vector3(0,6.9,25)
        theBack.parent =  theBoard
        boardSplashPS.emitter = theBack; boardSplashPS.gravity.y = -.5
        theBack.position = new Vector3(0,0,4.6)
        theBack.isVisible = false
        farent.isVisible = false

        farent.actionManager = new ActionManager(scene)

        const theFront = this.createSplashSmall(scene)
        theFront.box.parent = theBoard; theFront.box.position = new Vector3(0,0,-4.7)
        return { theBack,theFront, farent, boardSplashPS}
    }
    async createSurfer(farent,scene){
        const surferJson = {"name":"CPU particle system","id":"default system","capacity":10000,"disposeOnStop":false,"manualEmitCount":-1,"emitter":[0,0,0],"particleEmitterType":{"type":"CylinderParticleEmitter","radius":1,"height":0.4,"radiusRange":0,"directionRandomizer":1},"texture":{"tags":null,"url":"https://assets.babylonjs.com/textures/flare.png","uOffset":0,"vOffset":0,"uScale":1,"vScale":1,"uAng":0,"vAng":0,"wAng":0,"uRotationCenter":0.5,"vRotationCenter":0.5,"wRotationCenter":0.5,"homogeneousRotationInUVTransform":false,"isBlocking":true,"name":"https://assets.babylonjs.com/textures/flare.png","hasAlpha":false,"getAlphaFromRGB":false,"level":1,"coordinatesIndex":0,"optimizeUVAllocation":true,"coordinatesMode":0,"wrapU":1,"wrapV":1,"wrapR":1,"anisotropicFilteringLevel":4,"isCube":false,"is3D":false,"is2DArray":false,"gammaSpace":true,"invertZ":false,"lodLevelInAlpha":false,"lodGenerationOffset":0,"lodGenerationScale":0,"linearSpecularLOD":false,"isRenderTarget":false,"animations":[],"invertY":true,"samplingMode":3,"_useSRGBBuffer":false},"isLocal":false,"animations":[],"beginAnimationOnStart":false,"beginAnimationFrom":0,"beginAnimationTo":60,"beginAnimationLoop":false,"startDelay":0,"renderingGroupId":0,"isBillboardBased":true,"billboardMode":7,"minAngularSpeed":0,"maxAngularSpeed":0,"minSize":0.1,"maxSize":0.1,"minScaleX":2,"maxScaleX":1,"minScaleY":1,"maxScaleY":1,"minEmitPower":2,"maxEmitPower":2,"minLifeTime":3,"maxLifeTime":3.3,"emitRate":700,"gravity":[0,-0.3,0],"noiseStrength":[10,10,10],"color1":[0,0.25098039215686274,0.2784313725490196,1],"color2":[0.011764705882352941,0.24705882352941178,0.34901960784313724,1],"colorDead":[0.3333333333333333,0.4470588235294118,0.4588235294117647,1],"updateSpeed":0.028,"targetStopDuration":0,"blendMode":0,"preWarmCycles":0,"preWarmStepOffset":1,"minInitialRotation":0,"maxInitialRotation":0,"startSpriteCellID":0,"spriteCellLoop":true,"endSpriteCellID":0,"spriteCellChangeSpeed":1,"spriteCellWidth":0,"spriteCellHeight":0,"spriteRandomStartCell":false,"isAnimationSheetEnabled":false,"useLogarithmicDepth":false,"sizeGradients":[{"gradient":0,"factor1":0.03,"factor2":0.05},{"gradient":0.54,"factor1":0.7,"factor2":1.1},{"gradient":1,"factor1":0.01,"factor2":0.2}],"textureMask":[1,1,1,1],"customShader":null,"preventAutoStart":false}
        const surferPs = ParticleSystem.Parse(surferJson, scene, "")
        const Surfer = await SceneLoader.ImportMeshAsync("", "./models/", "surfer.glb", scene)

        const rightHand = Surfer.meshes[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[2].getChildren()[0].getChildren()[0].getChildren()[0]
        const leftHand = Surfer.meshes[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[0].getChildren()[0]

        surferBody = MeshBuilder.CreateBox("surferBody", {size: .5}, scene)
        const surferPsmesh = MeshBuilder.CreateBox("surferPsmesh", {size: .5}, scene)

        surferPs.emitter = surferPsmesh;
        surferPsmesh.parent = surferBody;
        surferPsmesh.position.y += 7.6
        surferPsmesh.isVisible = false
        surferBody.parent = farent

        surferPs.stop()
        Surfer.animationGroups.forEach(an => this.anims.push(an))
        Surfer.meshes.forEach(wve => wve.rotationQuaternion = null)
        const surfer = Surfer.meshes[0]
        surfer.position.y = 6.4
        surfer.scaling = new Vector3(7.5,7.5,7.5)
        surfer.parent = surferBody

        surferPsmesh.actionManager = new ActionManager(scene)

        return { surferPs, surferBody, surferPsmesh, surfer, rightHand, leftHand}
    }
}


const theGame = new App()

function changeMode(){
    onBoard = !onBoard

}


// ELEMENTS
startBtn.addEventListener("click", e => {
    theGame.introStart()
    startBtn.style.display = "none"
})