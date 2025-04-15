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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  FaTimes,
  FaPencilAlt,
  FaTrashAlt,
  FaPeopleArrows,
} from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  useCustomLinksStore,
  useGraphStore,
  useLinkFormStore,
  type GraphLink,
} from "~/store";
import { COLORS } from "./_consts";

export default function CustomLinks() {
  const { customLinks } = useCustomLinksStore();
  return (
    <Drawer direction="left">
      <DrawerTrigger
        className="cursor-pointer rounded-full px-2 text-white hover:text-blue-50"
        title="Связи"
      >
        <FaPeopleArrows className="size-8 sm:size-12" />
      </DrawerTrigger>
      <DrawerContent
        data-vaul-no-drag
        className="data-[vaul-drawer-direction=left]:w-full"
      >
        <DrawerHeader>
          <DrawerTitle>Связи</DrawerTitle>
          <DrawerDescription>
            Здесь вы можете создавать и редактировать связи между персонажами.
          </DrawerDescription>
          <DrawerClose className="absolute right-4 cursor-pointer">
            <FaTimes />
          </DrawerClose>
        </DrawerHeader>
        <LinkForm />
        <ScrollArea className="h-[calc(100dvh-300px)] p-4 sm:h-[calc(100dvh-276px)]">
          {customLinks.map((customLink, i) => (
            <LinkListItem customLink={customLink} key={i} index={i} />
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function LinkForm() {
  const {
    source,
    target,
    title,
    color,
    linkEditing,
    setColor,
    setSource,
    setTarget,
    setTitle,
    setLinkEditing,
  } = useLinkFormStore();
  const { addCustomLink } = useCustomLinksStore();
  const { nodes } = useGraphStore();
  const handleSubmit = () => {
    addCustomLink({ source, target, title, color, group: "custom" });
    setLinkEditing(false);
    setSource("");
    setTarget("");
    setTitle("");
  };
  const characters = nodes.filter((node) => node.group === "characters");
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <div className="flex w-full flex-col gap-2">
        <div className="grid w-full max-w-sm items-center gap-1">
          <Label htmlFor="name">Название</Label>
          <Input
            type="text"
            id="name"
            placeholder="Введите название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Источник</Label>
          <Select onValueChange={setSource} value={source}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите источник" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((character) => (
                <SelectItem key={character.id} value={character.id}>
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Цель</Label>
          <Select onValueChange={setTarget} value={target}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите цель" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((character) => (
                <SelectItem key={character.id} value={character.id}>
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      <Button
        disabled={title === "" || source === "" || target === ""}
        className="w-full cursor-pointer"
        onClick={handleSubmit}
      >
        {linkEditing ? "Сохранить" : "Добавить"}
      </Button>
    </div>
  );
}

function LinkListItem({
  customLink,
  index,
}: {
  customLink: GraphLink;
  index: number;
}) {
  const { setSource, setTarget, setTitle, setLinkEditing } = useLinkFormStore();
  const { deleteCustomLink } = useCustomLinksStore();
  const { nodes } = useGraphStore();
  const handleEditCustomLink = () => {
    setSource(
      typeof customLink.source === "string"
        ? customLink.source
        : customLink.source.id,
    );
    setTarget(
      typeof customLink.target === "string"
        ? customLink.target
        : customLink.target.id,
    );
    setTitle(customLink.title ?? "");
    setLinkEditing(true);
    deleteCustomLink(index);
  };
  const handleDeleteCustomLink = () => {
    const confirmed = confirm(
      `Вы уверены, что хотите удалить "${customLink.title}"?`,
    );
    if (confirmed) {
      deleteCustomLink(index);
    }
  };
  const characters = nodes.filter((node) => node.group === "characters");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <div className="flex w-full flex-col gap-1">
          <div className="text-xl">{customLink.title}</div>
          <div className="text-sm">
            {
              characters.find(
                (c) =>
                  c.id ===
                  (typeof customLink.source === "string"
                    ? customLink.source
                    : customLink.source.id),
              )?.name
            }
            &nbsp;&rarr;{" "}
            {
              characters.find(
                (c) =>
                  c.id ===
                  (typeof customLink.target === "string"
                    ? customLink.target
                    : customLink.target.id),
              )?.name
            }
          </div>
        </div>
        <div className="flex w-min flex-col gap-2">
          <Button
            variant={"link"}
            className="h-4 w-4 cursor-pointer p-0"
            onClick={handleEditCustomLink}
          >
            <FaPencilAlt className="text-blue-500" />
          </Button>
          <Button
            variant={"link"}
            className="h-4 w-4 cursor-pointer p-0"
            onClick={handleDeleteCustomLink}
          >
            <FaTrashAlt className="text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
