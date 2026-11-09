// ============================================
// SPELLCRAFT 0.1 – 3D OPEN WORLD
// Babylon.js
// ============================================

(() => {
    "use strict";

    const canvas = document.getElementById("gameCanvas");

    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
    });

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.48, 0.68, 0.86, 1);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.48, 0.68, 0.86);
    scene.fogDensity = 0.0025;

    // LICHT
    const hemi = new BABYLON.HemisphericLight(
        "Himmelslicht",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    hemi.intensity = 0.85;

    const sun = new BABYLON.DirectionalLight(
        "Sonnenlicht",
        new BABYLON.Vector3(-0.5, -1, 0.35),
        scene
    );
    sun.position = new BABYLON.Vector3(50, 80, -30);
    sun.intensity = 1.15;

    // MATERIALIEN
    function material(name, color) {
        const m = new BABYLON.StandardMaterial(name, scene);
        m.diffuseColor = BABYLON.Color3.FromHexString(color);
        m.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);
        return m;
    }

    const grassMat = material("Wiese", "#527C43");
    const darkGrassMat = material("Dunkles Gras", "#3E6338");
    const trunkMat = material("Baumrinde", "#60412D");
    const leafMat = material("Baumkronen", "#244D35");
    const leafLightMat = material("Helle Baumkronen", "#356846");
    const stoneMat = material("Stein", "#777D82");
    const castleMat = material("Burgstein", "#999A9A");
    const roofMat = material("Dach", "#493B46");
    const waterMat = material("See", "#287E9C");
    const robeMat = material("Magierrobe", "#342A62");
    const robeLightMat = material("Robenkante", "#8C6DD0");
    const skinMat = material("Gesicht", "#D5A77F");
    const hatMat = material("Zauberhut", "#211B43");
    const goldMat = material("Gold", "#E6BD63");
    const woodMat = material("Holz", "#76502E");

    // LANDSCHAFT
    const ground = BABYLON.MeshBuilder.CreateGround(
        "GrosseWiese",
        { width: 420, height: 420, subdivisions: 40 },
        scene
    );
    ground.material = grassMat;

    for (let i = 0; i < 70; i++) {
        const patch = BABYLON.MeshBuilder.CreateDisc(
            "Grasfleck",
            { radius: 2 + Math.random() * 5, tessellation: 16 },
            scene
        );

        patch.rotation.x = Math.PI / 2;
        patch.position.set(
            (Math.random() - 0.5) * 390,
            0.025,
            (Math.random() - 0.5) * 390
        );
        patch.material = darkGrassMat;
        patch.isPickable = false;
    }

    // HÜGEL
    for (let i = 0; i < 24; i++) {
        const hill = BABYLON.MeshBuilder.CreateSphere(
            "Hugel",
            {
                diameterX: 18 + Math.random() * 24,
                diameterY: 5 + Math.random() * 10,
                diameterZ: 18 + Math.random() * 24,
                segments: 12
            },
            scene
        );

        hill.position.set(
            (Math.random() - 0.5) * 360,
            -3.3,
            (Math.random() - 0.5) * 360
        );

        hill.material = i % 3 === 0 ? darkGrassMat : grassMat;
        hill.isPickable = false;
    }

    // BERGE
    for (let i = 0; i < 18; i++) {
        const mountain = BABYLON.MeshBuilder.CreateCylinder(
            "Berg",
            {
                height: 35 + Math.random() * 35,
                diameterTop: 0,
                diameterBottom: 25 + Math.random() * 25,
                tessellation: 7
            },
            scene
        );

        const angle = (i / 18) * Math.PI * 2;

        mountain.position.set(
            Math.cos(angle) * 175,
            12,
            Math.sin(angle) * 175
        );

        mountain.material = i % 2 ? stoneMat : darkGrassMat;
        mountain.isPickable = false;
    }

    // SEE
    const lake = BABYLON.MeshBuilder.CreateCylinder(
        "See",
        { diameter: 34, height: 0.35, tessellation: 48 },
        scene
    );

    lake.position.set(-48, 0.08, 30);
    lake.material = waterMat;

    // BÄUME
    function createTree(x, z, scale = 1) {
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
            "Baumstamm",
            {
                height: 4 * scale,
                diameterTop: 0.45 * scale,
                diameterBottom: 0.8 * scale
            },
            scene
        );

        trunk.position.set(x, 2 * scale, z);
        trunk.material = trunkMat;

        const crown = BABYLON.MeshBuilder.CreateSphere(
            "Baumkrone",
            { diameter: 4.5 * scale, segments: 7 },
            scene
        );

        crown.position.set(x, 4.5 * scale, z);
        crown.material = Math.random() > 0.5 ? leafMat : leafLightMat;

        const crown2 = BABYLON.MeshBuilder.CreateSphere(
            "BaumkroneOben",
            { diameter: 3.1 * scale, segments: 7 },
            scene
        );

        crown2.position.set(
            x + 0.5 * scale,
            6 * scale,
            z - 0.3 * scale
        );

        crown2.material = leafMat;
    }

    for (let i = 0; i < 150; i++) {
        const x = (Math.random() - 0.5) * 380;
        const z = (Math.random() - 0.5) * 380;

        if (Math.abs(x) < 13 && Math.abs(z) < 25) continue;
        if (Math.abs(x - 48) < 28 && Math.abs(z + 45) < 28) continue;
        if (Math.abs(x + 48) < 22 && Math.abs(z - 30) < 22) continue;

        createTree(x, z, 0.75 + Math.random() * 0.8);
    }

    // BURG
    function box(name, w, h, d, x, y, z, mat) {
        const mesh = BABYLON.MeshBuilder.CreateBox(
            name,
            { width: w, height: h, depth: d },
            scene
        );

        mesh.position.set(x, y, z);
        mesh.material = mat;

        return mesh;
    }

    function tower(x, z) {
        const base = BABYLON.MeshBuilder.CreateCylinder(
            "BurgTurm",
            { height: 13, diameter: 5, tessellation: 12 },
            scene
        );

        base.position.set(x, 6.5, z);
        base.material = castleMat;

        const roof = BABYLON.MeshBuilder.CreateCylinder(
            "Turmdach",
            {
                height: 5,
                diameterTop: 0,
                diameterBottom: 6,
                tessellation: 12
            },
            scene
        );

        roof.position.set(x, 15.5, z);
        roof.material = roofMat;

        box(
            "Turmfenster",
            0.7, 2.2, 0.15,
            x, 8, z - 2.52,
            roofMat
        );
    }

    const castleX = 48;
    const castleZ = -45;

    box("BurgmauerHinten", 48, 10, 3,
        castleX, 5, castleZ + 20, castleMat);

    box("BurgmauerLinks", 3, 10, 40,
        castleX - 22.5, 5, castleZ, castleMat);

    box("BurgmauerRechts", 3, 10, 40,
        castleX + 22.5, 5, castleZ, castleMat);

    box("BurgmauerVorneLinks", 17, 10, 3,
        castleX - 15.5, 5, castleZ - 20, castleMat);

    box("BurgmauerVorneRechts", 17, 10, 3,
        castleX + 15.5, 5, castleZ - 20, castleMat);

    tower(castleX - 22, castleZ - 20);
    tower(castleX + 22, castleZ - 20);
    tower(castleX - 22, castleZ + 20);
    tower(castleX + 22, castleZ + 20);

    box("Hauptgebaeude", 17, 17, 15,
        castleX, 8.5, castleZ + 2, castleMat);

    const mainRoof = BABYLON.MeshBuilder.CreateCylinder(
        "Hauptdach",
        {
            height: 8,
            diameterTop: 0,
            diameterBottom: 20,
            tessellation: 4
        },
        scene
    );

    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.position.set(castleX, 21, castleZ + 2);
    mainRoof.material = roofMat;

    for (const x of [castleX - 5, castleX, castleX + 5]) {
        box("Burgfenster", 1.2, 2.6, 0.15,
            x, 9, castleZ - 5.58, roofMat);
    }

    // WEG
    const roadMat = material("Weg", "#A99A7E");

    const road = BABYLON.MeshBuilder.CreateGround(
        "WegZurBurg",
        { width: 9, height: 65 },
        scene
    );

    road.position.set(25, 0.04, -13);
    road.rotation.y = -0.35;
    road.material = roadMat;

    // FELSEN
    for (let i = 0; i < 45; i++) {
        const rock = BABYLON.MeshBuilder.CreatePolyhedron(
            "Fels",
            { type: 1, size: 1 + Math.random() * 2.5 },
            scene
        );

        rock.position.set(
            (Math.random() - 0.5) * 350,
            0.7,
            (Math.random() - 0.5) * 350
        );

        rock.scaling.y = 0.5 + Math.random();
        rock.rotation.set(
            Math.random(),
            Math.random(),
            Math.random()
        );

        rock.material = stoneMat;
    }

    // MAGIER
    const player = new BABYLON.TransformNode("Magier", scene);
    player.position.set(0, 0, 0);

    const robe = BABYLON.MeshBuilder.CreateCylinder(
        "Umhang",
        {
            height: 2.1,
            diameterTop: 0.8,
            diameterBottom: 1.35,
            tessellation: 12
        },
        scene
    );

    robe.parent = player;
    robe.position.y = 1.05;
    robe.material = robeMat;

    const robeTrim = BABYLON.MeshBuilder.CreateCylinder(
        "UmhangSaum",
        {
            height: 0.12,
            diameter: 1.34,
            tessellation: 12
        },
        scene
    );

    robeTrim.parent = player;
    robeTrim.position.y = 0.12;
    robeTrim.material = robeLightMat;

    const head = BABYLON.MeshBuilder.CreateSphere(
        "Kopf",
        { diameter: 0.72, segments: 16 },
        scene
    );

    head.parent = player;
    head.position.y = 2.35;
    head.material = skinMat;

    const hat = BABYLON.MeshBuilder.CreateCylinder(
        "Hut",
        {
            height: 1.15,
            diameterTop: 0.05,
            diameterBottom: 1.05,
            tessellation: 12
        },
        scene
    );

    hat.parent = player;
    hat.position.y = 3.05;
    hat.material = hatMat;

    const hatBrim = BABYLON.MeshBuilder.CreateCylinder(
        "Hutkrempe",
        { height: 0.12, diameter: 1.25, tessellation: 16 },
        scene
    );

    hatBrim.parent = player;
    hatBrim.position.y = 2.63;
    hatBrim.material = hatMat;

    function makeArm(side) {
        const arm = BABYLON.MeshBuilder.CreateCylinder(
            "Arm",
            { height: 1.25, diameter: 0.27, tessellation: 10 },
            scene
        );

        arm.parent = player;
        arm.position.set(side * 0.58, 1.55, 0.05);
        arm.rotation.z = side * -0.65;
        arm.material = robeMat;

        return arm;
    }

    makeArm(-1);
    makeArm(1);

    const wand = BABYLON.MeshBuilder.CreateCylinder(
        "Zauberstab",
        { height: 1.35, diameter: 0.09, tessellation: 8 },
        scene
    );

    wand.parent = player;
    wand.position.set(0.9, 1.65, 0.12);
    wand.rotation.z = -0.25;
    wand.material = woodMat;

    const wandGem = BABYLON.MeshBuilder.CreateSphere(
        "ZauberstabKristall",
        { diameter: 0.25, segments: 10 },
        scene
    );

    wandGem.parent = player;
    wandGem.position.set(0.9, 2.34, 0.12);
    wandGem.material = goldMat;

    // KAMERA
    const camera = new BABYLON.ArcRotateCamera(
        "Spielkamera",
        -Math.PI / 2,
        1.12,
        11,
        new BABYLON.Vector3(0, 1.7, 0),
        scene
    );

    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 22;
    camera.lowerBetaLimit = 0.45;
    camera.upperBetaLimit = 1.48;
    camera.panningSensibility = 0;
    camera.wheelPrecision = 45;
    camera.checkCollisions = false;
    camera.inertia = 0.75;

    // STEUERUNG
    const keys = Object.create(null);

    let health = 100;
    let mana = 100;
    const playerSpeed = 0.13;
    let walkingTime = 0;

    window.addEventListener("keydown", event => {
        keys[event.key.toLowerCase()] = true;

        if (["w", "a", "s", "d", " "].includes(event.key.toLowerCase())) {
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", event => {
        keys[event.key.toLowerCase()] = false;
    });

    window.addEventListener("blur", () => {
        for (const key in keys) keys[key] = false;
    });

    // MAGIE
    const fireMat = new BABYLON.StandardMaterial(
        "FeuerMaterial",
        scene
    );

    fireMat.diffuseColor = new BABYLON.Color3(1, 0.24, 0.025);
    fireMat.emissiveColor = new BABYLON.Color3(1, 0.12, 0.01);

    const glow = new BABYLON.GlowLayer("MagischesLeuchten", scene);
    glow.intensity = 0.65;

    function castFireball() {
        if (mana < 18) {
            setSpellInfo("Nicht genug Mana!");
            return;
        }

        mana = Math.max(0, mana - 18);
        updateHUD();
        setSpellInfo("🔥 FEUERBALL!");

        const forward = camera.getForwardRay().direction;

        const start = player.position
            .add(new BABYLON.Vector3(0, 1.8, 0))
            .add(forward.scale(1.2));

        const orb = BABYLON.MeshBuilder.CreateSphere(
            "Feuerball",
            { diameter: 0.8, segments: 12 },
            scene
        );

        orb.position.copyFrom(start);
        orb.material = fireMat;

        const light = new BABYLON.PointLight(
            "Feuerlicht",
            orb.position.clone(),
            scene
        );

        light.diffuse = new BABYLON.Color3(1, 0.25, 0.03);
        light.intensity = 1.8;
        light.range = 12;

        const direction = forward.normalize();
        let age = 0;

        const observer = scene.onBeforeRenderObservable.add(() => {
            const dt = engine.getDeltaTime() / 1000;
            age += dt;

            orb.position.addInPlace(direction.scale(22 * dt));
            light.position.copyFrom(orb.position);

            if (Math.random() < 0.75) {
                const spark = BABYLON.MeshBuilder.CreateSphere(
                    "Feuerfunke",
                    {
                        diameter: 0.13 + Math.random() * 0.18,
                        segments: 5
                    },
                    scene
                );

                spark.position.copyFrom(orb.position);
                spark.material = fireMat;

                const drift = new BABYLON.Vector3(
                    (Math.random() - 0.5) * 1.8,
                    (Math.random() - 0.5) * 1.8,
                    (Math.random() - 0.5) * 1.8
                );

                let life = 0;

                const sparkObserver =
                    scene.onBeforeRenderObservable.add(() => {
                        const step = engine.getDeltaTime() / 1000;
                        life += step;

                        spark.position.addInPlace(drift.scale(step));
                        spark.scaling.scaleInPlace(0.96);

                        if (life > 0.45) {
                            scene.onBeforeRenderObservable.remove(sparkObserver);
                            spark.dispose();
                        }
                    });
            }

            if (age > 2.2 || orb.position.length() > 150) {
                scene.onBeforeRenderObservable.remove(observer);
                orb.dispose();
                light.dispose();
            }
        });
    }

    window.addEventListener("keydown", event => {
        if (event.key.toLowerCase() === "q" && !event.repeat) {
            castFireball();
        }
    });

    // ZAUBER ZEICHNEN
    let drawing = false;
    let drawPoints = [];
    let drawingCanvas;
    let drawingContext;

    function createDrawingOverlay() {
        drawingCanvas = document.createElement("canvas");
        drawingCanvas.id = "spellDrawing";

        drawingCanvas.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;" +
            "pointer-events:none;z-index:5;";

        document.body.appendChild(drawingCanvas);
        drawingContext = drawingCanvas.getContext("2d");

        function resizeDrawing() {
            drawingCanvas.width =
                Math.floor(window.innerWidth * devicePixelRatio);

            drawingCanvas.height =
                Math.floor(window.innerHeight * devicePixelRatio);

            drawingContext.setTransform(
                devicePixelRatio,
                0,
                0,
                devicePixelRatio,
                0,
                0
            );
        }

        resizeDrawing();
        window.addEventListener("resize", resizeDrawing);
    }

    createDrawingOverlay();

    canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;

        drawing = true;
        drawPoints = [{
            x: event.clientX,
            y: event.clientY
        }];

        drawingContext.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", event => {
        if (!drawing) return;

        drawPoints.push({
            x: event.clientX,
            y: event.clientY
        });

        drawingContext.strokeStyle = "#ffb347";
        drawingContext.lineWidth = 6;
        drawingContext.lineCap = "round";
        drawingContext.lineJoin = "round";
        drawingContext.shadowColor = "#ff6b16";
        drawingContext.shadowBlur = 18;

        drawingContext.beginPath();

        const previous = drawPoints[drawPoints.length - 2];

        drawingContext.moveTo(previous.x, previous.y);
        drawingContext.lineTo(event.clientX, event.clientY);
        drawingContext.stroke();
    });

    function finishDrawing() {
        if (!drawing) return;

        drawing = false;

        if (drawPoints.length > 5) {
            castFireball();
        }

        window.setTimeout(() => {
            drawingContext.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );
        }, 500);

        drawPoints = [];
    }

    canvas.addEventListener("pointerup", finishDrawing);
    canvas.addEventListener("pointercancel", finishDrawing);

    // HUD
    function setSpellInfo(text) {
        const element = document.getElementById("spellInfo");

        if (element) {
            element.textContent = text;
        }
    }

    function updateHUD() {
        const hp = document.getElementById("healthBar");
        const mp = document.getElementById("manaBar");

        if (hp) hp.style.width = health + "%";
        if (mp) mp.style.width = mana + "%";
    }

    // SPIELSCHLEIFE
    scene.onBeforeRenderObservable.add(() => {
        const dt = Math.min(
            engine.getDeltaTime() / 16.6667,
            2
        );

        const forward = camera.getForwardRay().direction;

        const flatForward = new BABYLON.Vector3(
            forward.x,
            0,
            forward.z
        ).normalize();

        const right = BABYLON.Vector3.Cross(
            flatForward,
            BABYLON.Axis.Y
        ).normalize();

        let move = BABYLON.Vector3.Zero();

        if (keys.w || keys.arrowup) {
            move.addInPlace(flatForward);
        }

        if (keys.s || keys.arrowdown) {
            move.subtractInPlace(flatForward);
        }

        if (keys.d || keys.arrowright) {
            move.addInPlace(right);
        }

        if (keys.a || keys.arrowleft) {
            move.subtractInPlace(right);
        }

        if (move.lengthSquared() > 0) {
            move.normalize();

            const sprint = keys.shift ? 1.75 : 1;

            player.position.addInPlace(
                move.scale(playerSpeed * sprint * dt)
            );

            player.rotation.y = Math.atan2(move.x, move.z);

            walkingTime += dt * 0.18;

            robe.position.y =
                1.05 + Math.sin(walkingTime * 2) * 0.025;
        }

        player.position.x = BABYLON.Scalar.Clamp(
            player.position.x,
            -198,
            198
        );

        player.position.z = BABYLON.Scalar.Clamp(
            player.position.z,
            -198,
            198
        );

        camera.target = BABYLON.Vector3.Lerp(
            camera.target,
            player.position.add(
                new BABYLON.Vector3(0, 1.7, 0)
            ),
            0.12
        );

        if (mana < 100) {
            mana = Math.min(100, mana + 0.035 * dt);
            updateHUD();
        }
    });

    // START
    const loading = document.getElementById("loading");

    if (loading) {
        window.setTimeout(() => {
            loading.style.opacity = "0";

            window.setTimeout(() => {
                loading.remove();
            }, 1000);
        }, 700);
    }

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });

    setSpellInfo("🪄 WASD bewegen · Q oder Linksklick zeichnen");
    updateHUD();
})();
