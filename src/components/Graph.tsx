/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { useGraphStore, useCustomLinksStore } from "~/store";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type { ForceGraphMethods } from "react-force-graph-3d";
import {
  Mesh,
  Vector2,
  SphereGeometry,
  MeshLambertMaterial,
  Vector3,
} from "three";
import SpriteText from "three-spritetext";
const Dynamic3DGraph = dynamic(() => import("./Dynamic3DGraph"), {
  ssr: false,
});
import { DEF_MATERIAL, SHAPES } from "./_consts";

export default function Graph() {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const { nodes, characterLinks } = useGraphStore();
  const { customLinks } = useCustomLinksStore();
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
  const combinedLinks = [...characterLinks, ...customLinks];
  console.log(combinedLinks);
  return (
    <Dynamic3DGraph
      ref={fgRef}
      extraRenderers={extraRenderers}
      graphData={{ nodes, links: combinedLinks }}
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
        nodeEl.style.fontSize = node.group === "tags" ? "1rem" : "1.5rem";
        nodeEl.style.textShadow =
          "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000";
        nodeEl.className = "node-label";
        const nodeLabel = new CSS2DObject(nodeEl);
        nodeMesh.add(nodeLabel);
        return nodeMesh;
      }}
      linkThreeObjectExtend={true}
      showNavInfo={false}
      backgroundColor="#00000000"
      cooldownTicks={40}
      onEngineStop={() => fgRef?.current?.zoomToFit(400)}
      linkDirectionalParticles={4}
      linkDirectionalParticleWidth={(link) => (link.group === "custom" ? 1 : 0)}
      linkThreeObject={(link) => {
        // extend link with text sprite
        const sprite = new SpriteText(link.title as string);
        sprite.color = "black";
        sprite.textHeight = 1.5;
        return sprite;
      }}
      linkPositionUpdate={(sprite, { start, end }) => {
        const calcMiddle = (a: number, b: number) => b + (a - b) / 2;
        Object.assign(
          sprite.position,
          new Vector3(
            calcMiddle(start.x, end.x),
            calcMiddle(start.y, end.y),
            calcMiddle(start.z, end.z),
          ),
        );
      }}
      onNodeDragEnd={(node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }}
    />
  );
}
