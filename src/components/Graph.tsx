/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { useStore } from "~/store";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type { ForceGraphMethods } from "react-force-graph-3d";
import {
  Mesh,
  Vector2,
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  MeshLambertMaterial,
} from "three";
const Dynamic3DGraph = dynamic(() => import("./Dynamic3DGraph"), {
  ssr: false,
});

const DEF_MATERIAL = new MeshLambertMaterial({
  color: Math.round(Math.random() * Math.pow(2, 24)),
  transparent: true,
  opacity: 0.75,
});

export const SHAPES = [
  { id: "cube", geometry: new BoxGeometry(16, 16, 16) },
  { id: "cone", geometry: new ConeGeometry(8, 16) },
  { id: "cylinder", geometry: new CylinderGeometry(8, 8, 16) },
  { id: "dodecahedron", geometry: new DodecahedronGeometry(10) },
  { id: "sphere", geometry: new SphereGeometry(10) },
  { id: "torus", geometry: new TorusGeometry(10, 2) },
  { id: "knot", geometry: new TorusKnotGeometry(6, 2) },
];

export default function Graph() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const { nodes, links } = useStore();
  const extraRenderers = [new CSS2DRenderer()];
  useEffect(() => {
    if (!fgRef.current) return;
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth / 1000, window.innerHeight / 1000),
      0.2,
      0.1,
      0,
    );
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);
  return (
    <Dynamic3DGraph
      ref={fgRef}
      extraRenderers={extraRenderers}
      graphData={{ nodes, links }}
      nodeAutoColorBy="group"
      linkOpacity={0.5}
      linkWidth={2}
      linkCurvature={0.1}
      nodeThreeObject={(node) => {
        const nodeMesh = new Mesh(
          node.group === "tags"
            ? new SphereGeometry(5)
            : (SHAPES.find((shape) => shape.id === node.shape)?.geometry ??
              new SphereGeometry(10)),
          node.color
            ? new MeshLambertMaterial({
                color: node.color,
                transparent: true,
                opacity: 0.9,
              })
            : DEF_MATERIAL,
        );
        const nodeEl = document.createElement("div");
        nodeEl.textContent = node.name;
        nodeEl.style.color = "white";
        nodeEl.style.fontSize = node.group === "tags" ? "1rem" : "2rem";
        nodeEl.style.textShadow =
          "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
        nodeEl.className = "node-label";
        const nodeLabel = new CSS2DObject(nodeEl);
        nodeMesh.add(nodeLabel);
        return nodeMesh;
      }}
      showNavInfo={false}
      backgroundColor="#00000000"
      cooldownTicks={40}
      onEngineStop={() => fgRef?.current?.zoomToFit(400)}
    />
  );
}
