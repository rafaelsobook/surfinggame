const { Engine,DirectionalLight, Scene, MeshBuilder,Vector3, HemisphericLight, ArcRotateCamera, SceneLoader, Color3} = BABYLON
const canvas = document.getElementById("renderCanvas")
const log = console.log
log(canvas)


class App{
    constructor(){
        this._engine = new Engine(canvas, true)
        this._scene = new Scene(this._engine)
        this._engine.displayLoadingUI()

        const light = new HemisphericLight("lug", new Vector3(0,10,0), this._scene)
        const cam = new ArcRotateCamera("arc",1,1,5, new Vector3(0,0,0), this._scene)


        this.main()
    }

    async main(){



        await this._goToStart()

        this._engine.runRenderLoop( () => {
            this._scene.render()
        })
    }

    async _goToStart(){
        let floatingWaters = []
        const scene = new Scene(this._engine)

        const light = new HemisphericLight("lug", new Vector3(0,10,0), scene)
        const dirLight = new DirectionalLight("lug", new Vector3(2,-1,4), scene)

        const cam = new ArcRotateCamera("arc",-1,0,197, new Vector3(0,0,1), scene)
        cam.attachControl(canvas, true)

        const box = MeshBuilder.CreateBox("asd", {size: .5}, scene)
        const Wave = await SceneLoader.ImportMeshAsync("", "./models/", "waves.glb", scene)
        Wave.meshes[1].parent = null
        Wave.meshes[1].position.y += 1000
        for (let p = 0; p < 120; p++) {
            const mySpd = .009 + Math.random()*.005
            const newWave = Wave.meshes[1].clone('newWave')
            const fId = Math.random().toString()
            newWave.parent = null
      	    newWave.position.x = BABYLON.Scalar.RandomRange(-175, 175);
            newWave.position.y = BABYLON.Scalar.RandomRange(0,0);
            newWave.position.z = BABYLON.Scalar.RandomRange(-175, 175);
            floatingWaters.push({_id: fId, spd: mySpd, mesh: newWave, isDown: Math.random() > .05 ? true : false })
        }

        await scene.whenReadyAsync()
        this._scene.dispose()
        this._scene = scene
        
        this._engine.hideLoadingUI()


        scene.registerBeforeRender(() => {
            if(floatingWaters.length){
                floatingWaters.forEach(fwater => {
                    fwater.mesh.locallyTranslate(new Vector3(0,0,fwater.spd))
                   
                    if(fwater.mesh.position.z > 200) fwater.mesh.position.z = -150
                })
            }
        })

        window.addEventListener("keyup", e => {
            if(e.key === " "){
                log(cam.radius)
                log(cam.alpha)
                log(cam.beta)
            }
        })
    }
}


new App