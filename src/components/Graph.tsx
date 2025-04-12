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
import { Vector2 } from "three";
const Dynamic3DGraph = dynamic(() => import("./Dynamic3DGraph"), {
  ssr: false,
});

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
      nodeResolution={32}
      linkOpacity={0.5}
      linkWidth={2}
      linkCurvature={0.25}
      nodeThreeObject={(node) => {
        const nodeEl = document.createElement("div");
        nodeEl.textContent = node.name;
        nodeEl.style.color = "black";
        nodeEl.className = "node-label";
        return new CSS2DObject(nodeEl);
      }}
      showNavInfo={false}
      backgroundColor="#00000000"
      nodeThreeObjectExtend={true}
    />
  );
}
