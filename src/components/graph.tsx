/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { useStore } from "~/store";
import dynamic from "next/dynamic";
const Dynamic3DGraph = dynamic(() => import("./Dynamic3DGraph"), {
  ssr: false,
});

export default function Graph() {
  const { nodes, links } = useStore();
  if (typeof document === "undefined") return null;
  const extraRenderers = [new CSS2DRenderer()];
  return (
    <Dynamic3DGraph
      extraRenderers={extraRenderers}
      graphData={{ nodes, links }}
      nodeAutoColorBy="group"
      nodeThreeObject={(node) => {
        const nodeEl = document.createElement("div");
        nodeEl.textContent = node.name;
        nodeEl.style.color = node.color;
        nodeEl.className = "node-label";
        return new CSS2DObject(nodeEl);
      }}
      nodeThreeObjectExtend={true}
    />
  );
}
