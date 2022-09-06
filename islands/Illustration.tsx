/** @jsx h */
import { h } from "preact";

import * as THREE from "https://esm.sh/three@0.144.0";

import { OrbitControls } from "https://esm.sh/three@0.144.0/addons/controls/OrbitControls.js";

import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import MeshReflectorMaterial from "../static/MeshReflectorMaterial.js";

function debounce<T extends () => void>(fn: T, ms: number): () => void {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = -1;
      // @ts-ignore: this is a function
      fn.apply(this, arguments);
    }, ms);
  };
}

type Context = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  compose: (mesh: THREE.Mesh) => void;
};

export default function (
  { children, ...props }: h.JSX.HTMLAttributes<HTMLDivElement> & {
    children: (context: Context) => void;
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    if (isLoaded) return;
    setLoaded(true);

    const container = ref.current!;
    const innerWidth = container.clientWidth;
    const innerHeight = container.clientHeight;

    const selects: THREE.Mesh[] = [];
    const scene = new THREE.Scene();

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xFFFFFF, 1);

    renderer.shadowMap.enabled = true;
    scene.background = new THREE.Color(0xFFFFFF);

    container.appendChild(renderer.domElement);

    // Camara

    const camera = new THREE.PerspectiveCamera(
      35,
      innerWidth / innerHeight,
      0.1,
      15,
    );

    // Controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 2;
    controls.maxPolarAngle = (Math.PI / 2) * 0.9;

    window!.addEventListener("resize", () => resize());

    // Lights
    const hemiLight = new THREE.HemisphereLight(0x443333, 0x111122);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.35);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.intensity = 0.6;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.far = 20;
    spotLight.shadow.radius = 4;
    spotLight.position.set(-8, 8, 8);
    scene.add(spotLight);

    children({
      renderer,
      camera,
      scene,
      compose: (mesh) => selects.push(mesh),
    });

    // Ground
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShadowMaterial({ color: 0xFFFFFF, opacity: 0.1 }),
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.001;
    plane.receiveShadow = true;
    scene.add(plane);

    // @ts-ignore: javascript
    plane.material = new MeshReflectorMaterial(renderer, camera, scene, plane, {
      resolution: 1024,
      blur: [512, 128],
      mixBlur: 2.5,
      mixContrast: 1.5,
      depthScale: 4.1,
      depthToBlurRatioBias: 1.7,
    });

    render();

    function onWindowResize() {
      const innerWidth = container.clientWidth;
      const innerHeight = container.clientHeight;

      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(innerWidth, innerHeight);
    }

    const resize = debounce(onWindowResize, 100);

    function render() {
      requestAnimationFrame(render);

      controls.update();
      renderer.render(scene, camera);

      // @ts-ignore: javascript
      plane.material.update();
    }
  }, [isLoaded]);

  useEffect(() => {
    window!.addEventListener("mousemove", trigger);
    function trigger() {
      window!.removeEventListener("mousemove", trigger);
      load();
    }
  }, [])

  return (
    <div
      ref={ref}
      {...props}
    />
  );
}
