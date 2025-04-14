import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  MeshLambertMaterial,
} from "three";

export const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "white",
];

export const DEF_MATERIAL = new MeshLambertMaterial({
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
