"use client";
import Characters from "~/components/Characters";
import { Button } from "./ui/button";
import {
  useGraphStore,
  useCustomLinksStore,
  type Character,
  type GraphLink,
} from "~/store";
import { FaDownload, FaUpload } from "react-icons/fa";
import { useRef } from "react";
import CustomLinks from "./CustomLinks";

export default function Header() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { characters, setCharacters } = useGraphStore();
  const { customLinks, setCustomLinks } = useCustomLinksStore();
  const downloadJSON = () => {
    const confirmed = confirm(
      `Вы уверены, что хотите сохранить список персонажей?`,
    );
    if (!confirmed) return;
    const blob = new Blob([JSON.stringify({ characters, customLinks })], {
      type: "text/json",
    });
    const link = document.createElement("a");

    link.download = `rhizome_${new Date().toLocaleString().replaceAll(", ", "_").replaceAll(".", "_")}.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":",
    );

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();
  };

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = JSON.parse(event.target?.result as string) as {
        characters: Character[];
        customLinks: GraphLink[];
      };
      if (!!res.characters && !!res.characters.length)
        setCharacters(res.characters);
      if (!!res.customLinks && !!res.customLinks.length)
        setCustomLinks(res.customLinks);
    };
    reader.readAsText(file);
  }

  function uploadJSON(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!inputRef?.current) return;
    inputRef.current.click();
  }

  return (
    <div className="fixed top-0 z-50 flex h-16 w-full flex-row items-center justify-between bg-transparent p-4 sm:h-24">
      <div className="flex flex-row items-center gap-4">
        <Characters />
        <CustomLinks />
      </div>
      <div className="flex h-32 flex-row items-center gap-4">
        <Button
          variant={"link"}
          onClick={downloadJSON}
          title="Сохранить список персонажей"
          className="cursor-pointer text-white hover:text-blue-50"
        >
          <FaDownload className="size-8 sm:size-12" />
        </Button>
        <Button
          variant={"link"}
          onClick={uploadJSON}
          title="Загрузить список персонажей"
          className="cursor-pointer text-white hover:text-blue-50"
        >
          <FaUpload className="size-8 sm:size-12" />
        </Button>
        <input ref={inputRef} type="file" hidden onChange={handleFileUpload} />
      </div>
    </div>
  );
}
