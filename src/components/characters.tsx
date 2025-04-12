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
import { FaTimes } from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";

export default function Characters() {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="cursor-pointer text-2xl">
        Персонажи
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="h-dvh">
          <DrawerHeader>
            <DrawerTitle>Персонажи</DrawerTitle>
            <DrawerDescription>
              Вы можете создавать и редактировать персонажей и их теги.
            </DrawerDescription>
            <DrawerClose className="absolute right-4 cursor-pointer">
              <FaTimes />
            </DrawerClose>
          </DrawerHeader>
          <CharacterForm />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function CharacterForm() {
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="grid w-full max-w-sm items-center gap-1">
        <Label htmlFor="name">Имя</Label>
        <Input
          type="text"
          id="name"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1">
        <Label htmlFor="tags">Теги</Label>
        <Input
          type="text"
          id="tags"
          placeholder="Теги"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <Button className="w-full cursor-pointer">Создать</Button>
    </div>
  );
}
