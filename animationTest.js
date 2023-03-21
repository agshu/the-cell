import "./style.css";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import { gL } from "mind-ar/dist/controller-939e6d85";

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
      container: document.querySelector("#app"), //body om fullskärm
      imageTargetSrc: "/assets/targets.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(pointLight, ambientLight, directionalLight);

    const gltf = await loadGTLF("/assets/stemcellSplit.glb");
    console.log(gltf);
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.userData.clickable = true;

    const anchor = mindarThree.addAnchor(0); // index noll pga först i listan av target markers från mindAR
    anchor.group.add(gltf.scene);

    anchor.onTargetFound = () => {
      console.log("on target found");
    };

    anchor.onTargetLost = () => {
      console.log("on target lost");
    };

    // gltf animations
    const mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);

    document.querySelector("#app").addEventListener("click", (event) => {
      event.preventDefault();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.z = 0.5;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let o = intersects[0].object;
        while (o.parent && !o.userData.clickable) {
          o = o.parent;
          if (o.userData.clickable) {
            if (o === gltf.scene) {
              action.play();
            }
          }
        }
      }
    });

    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      // gltf.scene.rotation.x += 0.01;
      // gltf.scene.rotation.y += 0.005;
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  };
  start();
});
