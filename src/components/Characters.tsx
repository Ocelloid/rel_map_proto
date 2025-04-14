"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  FaTimes,
  FaPencilAlt,
  FaTrashAlt,
  FaList,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  useCharFormStore,
  useGraphStore,
  useCustomLinksStore,
  type Character,
} from "~/store";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SHAPES, COLORS } from "./_consts";
import { MeshStandardMaterial, SphereGeometry } from "three";

export default function Characters() {
  const [isOpen, setIsOpen] = useState(false);
  const { characters } = useGraphStore();
  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        className="cursor-pointer rounded-full px-2 text-white hover:text-blue-50"
        title="Персонажи"
      >
        <FaList className="size-8 sm:size-12" />
      </DrawerTrigger>
      <DrawerContent
        data-vaul-no-drag
        className="data-[vaul-drawer-direction=left]:w-full"
      >
        <DrawerHeader>
          <DrawerTitle>Персонажи</DrawerTitle>
          <DrawerDescription>
            Здесь вы можете создавать и редактировать персонажей и их теги.
          </DrawerDescription>
          <DrawerClose className="absolute right-4 cursor-pointer">
            <FaTimes />
          </DrawerClose>
        </DrawerHeader>
        <CharacterForm />
        <ScrollArea className="h-[calc(100dvh-300px)] p-4 sm:h-[calc(100dvh-276px)]">
          {characters.map((character, i) => (
            <CharacterListItem character={character} key={i} index={i} />
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function CharacterListItem({
  character,
  index,
}: {
  character: Character;
  index: number;
}) {
  const {
    setName,
    setTags,
    setColor,
    setShape,
    setCharacterEditing,
    setEditingId,
  } = useCharFormStore();
  const { deleteCharacter } = useGraphStore();
  const { deleteLinksForNode } = useCustomLinksStore();
  const handleEditCharacter = () => {
    setName(character.name);
    setTags(character.tags);
    setColor(character.color);
    setShape(character.shape);
    setCharacterEditing(true);
    setEditingId(character.nodeId);
    deleteCharacter(index);
    deleteLinksForNode(character.nodeId);
  };
  const handleDeleteCharacter = () => {
    const confirmed = confirm(
      `Вы уверены, что хотите удалить "${character.name}"?`,
    );
    if (confirmed) {
      deleteCharacter(index);
      deleteLinksForNode(character.nodeId);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="h-16 w-16">
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <pointLight
              position={[-10, -10, -10]}
              decay={0}
              intensity={Math.PI}
            />
            <mesh
              scale={0.2}
              geometry={
                SHAPES.find((s) => s.id === character.shape)?.geometry ??
                new SphereGeometry(10)
              }
              material={new MeshStandardMaterial({ color: character.color })}
            />
          </Canvas>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="text-xl">{character.name}</div>
          <div className="text-sm">{character.tags}</div>
        </div>
        <div className="flex w-min flex-col gap-2">
          <Button
            variant={"link"}
            className="h-4 w-4 cursor-pointer p-0"
            onClick={handleEditCharacter}
          >
            <FaPencilAlt className="text-blue-500" />
          </Button>
          <Button
            variant={"link"}
            className="h-4 w-4 cursor-pointer p-0"
            onClick={handleDeleteCharacter}
          >
            <FaTrashAlt className="text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CharacterForm() {
  const {
    name,
    tags,
    color,
    shape,
    editingId,
    characterEditing,
    setName,
    setTags,
    setColor,
    setShape,
    setEditingId,
  } = useCharFormStore();
  const { addCharacter } = useGraphStore();
  const { redraw } = useCustomLinksStore();
  const handleSubmit = () => {
    addCharacter(name, tags, color, shape, editingId);
    setName("");
    setTags("");
    setColor("pink");
    setShape("sphere");
    setEditingId(undefined);
    redraw();
  };
  const handlePrevShape = () => {
    const index = SHAPES.findIndex((s) => s.id === shape);
    if (index === 0) {
      setShape(SHAPES[SHAPES.length - 1]?.id ?? "sphere");
    } else {
      setShape(SHAPES[index - 1]?.id ?? "sphere");
    }
  };
  const handleNextShape = () => {
    const index = SHAPES.findIndex((s) => s.id === shape);
    if (index === SHAPES.length - 1) {
      setShape(SHAPES[0]?.id ?? "sphere");
    } else {
      setShape(SHAPES[index + 1]?.id ?? "sphere");
    }
  };
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <div className="flex flex-row gap-2">
        <div className="relative flex h-32 w-32 flex-col gap-2">
          <div className="absolute top-1/3 left-0 z-50">
            <Button
              variant={"link"}
              className="cursor-pointer"
              onClick={handlePrevShape}
            >
              <FaChevronLeft />
            </Button>
          </div>
          <div className="absolute top-1/3 right-0 z-50">
            <Button
              variant={"link"}
              className="cursor-pointer"
              onClick={handleNextShape}
            >
              <FaChevronRight />
            </Button>
          </div>
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              decay={0}
              intensity={Math.PI}
            />
            <pointLight
              position={[-10, -10, -10]}
              decay={0}
              intensity={Math.PI}
            />
            <mesh
              scale={0.2}
              geometry={
                SHAPES.find((s) => s.id === shape)?.geometry ??
                new SphereGeometry(10)
              }
              material={new MeshStandardMaterial({ color: color })}
            />
          </Canvas>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="name">Имя</Label>
            <Input
              type="text"
              id="name"
              placeholder="Введите имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="tags">Теги</Label>
            <Input
              type="text"
              id="tags"
              placeholder="Введите теги через запятую"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            {COLORS.map((c) => (
              <Button
                key={c}
                onClick={() => setColor(c)}
                variant={"ghost"}
                className={`h-5 w-5 rounded-full border-2 p-0 ${c === color ? "border-blue-700" : "border-blue-400"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        disabled={name === "" || tags === ""}
        className="w-full cursor-pointer"
        onClick={handleSubmit}
      >
        {characterEditing ? "Сохранить" : "Добавить"}
      </Button>
    </div>
  );
}
