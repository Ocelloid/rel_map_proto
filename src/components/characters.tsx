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
import { FaTimes, FaPencilAlt, FaTrashAlt, FaList } from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import Image from "next/image";
import { useStore, type Character } from "~/store";
import { useState, useEffect } from "react";

export default function Characters() {
  const [isOpen, setIsOpen] = useState(false);
  const { characters } = useStore();
  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="cursor-pointer rounded-full px-4">
        <FaList size={64} color="white" />
      </DrawerTrigger>
      <DrawerContent data-vaul-no-drag>
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
        <ScrollArea className="h-[calc(100dvh-256px)] p-4">
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
  const { setName, setTags, setEditing, deleteCharacter } = useStore();
  const handleEditCharacter = () => {
    setName(character.name);
    setTags(character.tags);
    setEditing(true);
    deleteCharacter(index);
  };
  const handleDeleteCharacter = () => {
    const confirmed = confirm(
      `Вы уверены, что хотите удалить "${character.name}"?`,
    );
    if (confirmed) {
      deleteCharacter(index);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Image
          src="/favicon.png"
          alt="logo"
          width={128}
          height={128}
          className="h-16 w-16"
        />
        <div className="flex w-full flex-col gap-1">
          <div className="text-xl">{character.name}</div>
          <div className="text-sm">{character.tags}</div>
        </div>
        <div className="flex w-min flex-col gap-1">
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={handleEditCharacter}
          >
            <FaPencilAlt className="text-blue-500" />
          </Button>
          <Button
            variant={"ghost"}
            className="cursor-pointer"
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
  const { name, tags, editing, addCharacter, setName, setTags } = useStore();
  const handleSubmit = () => {
    addCharacter({ name, tags });
    setName("");
    setTags("");
  };
  return (
    <div className="flex flex-col gap-2 px-4">
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
      <Button
        disabled={name === "" || tags === ""}
        className="w-full cursor-pointer"
        onClick={handleSubmit}
      >
        {editing ? "Сохранить" : "Добавить"}
      </Button>
    </div>
  );
}
