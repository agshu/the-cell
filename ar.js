import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

const loadGTLF = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(path, (gltf) => {
      resolve(gltf);
    });
  });
};

const loadAudio = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.AudioLoader();
    loader.load(path, (buffer) => {
      resolve(buffer);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new MindARThree({
      container: document.body, //body om fullskärm
      imageTargetSrc: "./targets.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(pointLight, ambientLight, directionalLight);

    const gltf = await loadGTLF("./stemcell.glb");
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.userData.clickable = true;

    const anchor = mindarThree.addAnchor(0); // index noll pga först i listan av target markers från mindAR
    anchor.group.add(gltf.scene);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    //const audioClip = await loadAudio("./confettiSound.m4a");
    //const audio = new THREE.Audio(listener);
    // audio.setBuffer(audioClip);

    anchor.onTargetFound = () => {
      console.log("on target found");
    };

    anchor.onTargetLost = () => {
      console.log("on target lost");
    };

    // för att registerara event handeling
    document.body.addEventListener("click", (event) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      //const mouseX = (e.clientX / window.innerWidth) * 2 - 1; // x-coords för klicket, normaliserar för att få range -1 till1
      //const mouseY = -1 * ((e.clientY / window.innerWidth) * 2 - 1); // -1 för går åt andra hållet av ngn anledning

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let o = intersects[0].object;
        while (o.parent && !o.userData.clickable) {
          o = o.parent;
          if (o.userData.clickable) {
            if (o === gltf.scene) {
              console.log("här e jag");
            }
          }
        }
      }
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      gltf.scene.rotation.x += 0.01;
      gltf.scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    });
  };
  start();
});
