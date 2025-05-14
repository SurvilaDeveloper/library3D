const aviso = document.getElementById("aviso")

async function maingl() {

    const MyCanvas = new Frame("marco", "canvas_container", "afterbegin", "gl", 600, 300);

    const objArray = ['animation/mujer_walking_0000.obj', 'objs/pisoCountry.obj'];
    const imagesArray = [];
    const vertexShaderArray = ['shaders/vertex0.glsl', 'shaders/vShadow.glsl'];
    const fragmentShaderArray = ['shaders/fragment0.glsl', 'shaders/fShadow.glsl'];
    const animationsArray = [mujer_walking];
    const transformsArray = [];//['trajectory/trayectoria.txt', 'trajectory/trayectoria.try'];
    const aviso1 = setTimeout(() => {
        aviso.innerText = "Ten paciencia. Podría tardar porque la animación cuenta con varios archivos .obj"
    }, 6000)
    const aviso2 = setTimeout(() => {
        aviso.innerText = "Ten paciencia. Falta menos."
    }, 12000)
    const aviso3 = setTimeout(() => {
        aviso.innerText = "Sí. Es verdad que está tardando, pero vale la pena esperar."
    }, 18000)
    const aviso4 = setTimeout(() => {
        aviso.innerText = "Un poco más y estamos."
    }, 24000)
    const filesData = await initGL(vertexShaderArray, fragmentShaderArray, objArray, imagesArray, animationsArray, transformsArray, () => { }); //myDiv.destroy(); pressAKey.insert(); 
    console.log("listo");
    clearTimeout(aviso1)
    clearTimeout(aviso2)
    clearTimeout(aviso3)
    clearTimeout(aviso4)
    aviso.innerText = "Listo. Presione una tecla para ver."
    aviso.style.color = "green"
    document.addEventListener('keydown', principalHandler);

    function principalHandler() {
        console.log("se presionó una tecla");
        aviso.innerText = ""
        aviso.remove()
        document.removeEventListener('keydown', principalHandler);
        pressAKey.destroy();
        principal(filesData);
    }

    async function principal(d) {

        const obj = d[0];
        //const ima = d[1];
        const ver = d[2];
        const fra = d[3];
        const ani = d[4];
        //const tra = d[5];

        const keysDown = new KeyUpAndDown();

        scaleAnimation(ani[0], 0.04);

        const gl = MyCanvas.canvas.gl;

        console.log("gl.MAX_TEXTURE_SIZE", gl.getParameter(gl.MAX_TEXTURE_SIZE));
        console.log("gl.MAX_CUBE_MAP_TEXTURE_SIZE", gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
        console.log("gl.MAX_RENDERBUFFER_SIZE", gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
        const panel = new ControlPanel(MyCanvas);
        panel.console.fontSize("18px");
        const infoDisplay = new Display("info");
        infoDisplay.log(gl.getParameter(gl.VERSION));
        const infoDisplay2 = new Display("controles:")
        infoDisplay2.log(`
            teclas para mover la cámara:
            w: hacia adelante
            s: hacia atrás
            a: hacia la izquierda
            d: hacia la derecha
            
            Para mirar en otra dirección, puede hacer click sobre el lienzo,
            y manteniendo click izquierdo presionado, mueva el mouse
            
            Con las teclas "o" y "l" haga caminar al modelo.
            
            Es probable que en navegadores como Chrome o Edge, la animación sea lenta.
            Funciona bien en el navegador Firefox porque tiene un mejor motor de renderizado
            
            Cierre este panel con el botón "Hide Console" que está arriba.`)

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        try {
            function main() {
                try {

                    const mainProgram = new DrawerProgram(gl, ver[0], fra[0]);

                    const shadowProgram = new ShadowProgram(gl, ver[1], fra[1]);

                    const cBv = new Float32Array(ani[0][0].vertexArray);
                    const cBn = new Float32Array(ani[0][0].normalArray);

                    const cBi = new Uint16Array(ani[0][0].indexArray);

                    const mujer1 = new DiffuseObject('mujer1', gl, mainProgram, cBv, cBn, cBi, new Float32Array([1, 1, 1]));

                    const fva = new Float32Array(obj[1].vertexArray);
                    const fna = new Float32Array(obj[1].normalArray);
                    const fua = new Float32Array(obj[1].uvArray);
                    const fia = new Uint16Array(obj[1].indexArray);
                    const floor = new Terrain("floor", gl, mainProgram, fva, fna, fua, fia);
                    floor.isTextured = 0;

                    floor.brightness = 16;

                    const eye = new Float32Array([0.0, 2.0, 4.0]);
                    const target = new Float32Array([0, 1.2, 0.0]);
                    const up = new Float32Array([0, 1, 0]);

                    const cam = new Camera(gl, mainProgram, eye, target, up, 'perspective', obj[1]);

                    const pointLight = new PointLight(gl, mainProgram, 'luz1');

                    const lighting = new Lighting(gl, mainProgram);
                    lighting.ambientLight.intensity = 0.3;
                    lighting.directionalLight.intensity = 0.5;

                    lighting.pointLightsSet.includeLight(pointLight);

                    pointLight.scope = 20.0;
                    pointLight.intensity = 0.3;
                    pointLight.color = new Float32Array([1.0, 1.0, 1.0]);
                    pointLight.position = new Float32Array([-7.8, 4.0, -7.8]);

                    lighting.createControls();
                    lighting.ambientLight.createControls();
                    lighting.directionalLight.createControls();
                    lighting.pointLightsSet.createControls();

                    const moveMouse = new MouseMovement();
                    const mouseClick = new MouseClicks();

                    const moveCam = new WalkingCam(cam, keysDown, moveMouse, mouseClick, floor);////////
                    const moveWoman = new WalkingObject(mujer1, keysDown, moveMouse, mouseClick, floor, 0.04, 80);
                    moveWoman.setKeys('e', '', 'f', '')

                    const secuencia = [...ani[0], ...ani[0].reverse()]
                    console.log(ani[0].length)
                    console.log(secuencia);
                    const aniWoman = new AnimationIdleLoopEnd(mujer1, secuencia, 0, 24, 5);

                    const ren = new RENDER(MyCanvas, mainProgram, shadowProgram, cam, lighting, 4, 7, [pointLight]);

                    function renderEscena() {

                        let kd_o = keysDown.down('e', () => {
                            aniWoman.startLoop(0, 24, 24, 25, 26, 39, 40, 42);
                        })


                        let kd_l = keysDown.down('f', () => {
                            aniWoman.startLoop(0, 24, 43, 45, 46, 59, 60, 60);
                        })

                        if (!kd_l) {
                            keysDown.up('e', () => {
                                aniWoman.endLoop();
                            })
                        }
                        if (!kd_o) {
                            keysDown.up('f', () => {
                                aniWoman.endLoop();
                            })
                        }

                        aniWoman.active()

                        ren.clearViewport();
                        moveCam.active();
                        moveWoman.active();

                        cam.active();
                        lighting.active();

                        ren.draw(cam.box);

                        ren.draw(mujer1);

                        ren.draw(floor);
                    }

                    function renderSombra() {

                        ren.clearDepthBuffer6();

                        ren.depthDraw6(mujer1);
                    }
                    //////////////////////////////////////////////////////RENDER///////////////////////////////////////////////
                    function render() {
                        try {
                            renderSombra();
                            renderEscena();
                            requestAnimationFrame(render);
                        } catch (e) {
                            panel.console.error(e);
                        }
                    }
                    requestAnimationFrame(render);
                } catch (error) {
                    panel.console.error(error);
                }
            }

            main();
        } catch (e) { panel.console.error(e) }
    }
}


const pressStyle = 'font-size: 140px; position: absolute; z-index:2; margin:40px';
const pressAKeyProperties = {
    id: 'pressKeyTo3DId',
    className: 'pressKeyTo3DClass',
    style: pressStyle,
    innerHTML: 'presione una tecla.'
}
const pressAKey = new HTMLElementBuilder('div', pressAKeyProperties, '#body', 'beforeend')

maingl();