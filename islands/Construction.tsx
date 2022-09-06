/** @jsx h */
import { h } from "preact";

import * as THREE from "https://esm.sh/three@0.144.0";

import Illustration from "./Illustration.tsx";

function layer(
  width: number,
  height: number,
  depth: number,
  color: THREE.ColorRepresentation,
) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  return mesh;
}

function stack(mesh: THREE.Mesh[], direction: "x" | "y" | "z", offset: number) {
  const group = new THREE.Group();
  mesh.forEach((m, i, arr) => {
    m.geometry.computeBoundingBox();
    const previous = arr.reduce((acc, m, j) => {
      m.geometry.computeBoundingBox();
      return j < i ? acc + m.geometry.boundingBox!.max[direction] * 2 : acc;
    }, 0);
    m.position[direction] = previous + m.geometry.boundingBox!.max[direction] + (offset * i)
    group.add(m);
  });
  return group;
}

export default function (
  { children, ...props }: h.JSX.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div>
      <Illustration {...props}>
        {({ scene, compose }) => {
          const offset = 0.05;

          const base = layer(0.25, 0.03, 0.25, "green");
          const middle = layer(0.25, 0.03, 0.25, "blue");
          const top = layer(0.25, 0.03, 0.25, "magenta");

          const group = stack([base, middle, top], "y", offset);

          compose(base);
          compose(middle);
          compose(top);

          scene.add(group);
        }}
      </Illustration>
    </div>
  );
}
