import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@paralleldrive/cuid2";

export type Character = {
  name: string;
  tags: string;
};

type GraphNode = {
  id: string;
  name: string;
  val: number;
};

type GraphLink = {
  source: string;
  target: string;
};

interface State {
  characters: Character[];
  nodes: GraphNode[];
  links: GraphLink[];
  editing: boolean;
  name: string;
  tags: string;
}

interface Actions {
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  deleteCharacter: (index: number) => void;
  setEditing: (editing: boolean) => void;
  setName: (name: string) => void;
  setTags: (tags: string) => void;
}

function CharactersToGraph(characters: Character[]) {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  characters.forEach((character) => {
    const characterId = createId();
    nodes.push({
      id: characterId,
      name: character.name,
      val: 0,
    });
    character.tags.split(",").forEach((tag) => {
      const trimmed = tag.trim();
      if (trimmed === "") return;
      if (nodes.some((node) => node.name === trimmed)) return;
      nodes.push({
        id: trimmed,
        name: trimmed,
        val: 5,
      });
      links.push({
        source: characterId,
        target: tag,
      });
    });
  });
  return { nodes, links };
}

export const useStore = create(
  persist<State & Actions>(
    (set, get) => ({
      characters: [],
      nodes: [],
      links: [],
      name: "",
      tags: "",
      editing: false,
      setEditing: (editing) => {
        set({ editing });
      },
      setName: (name) => {
        set({ name });
      },
      setTags: (tags) => {
        set({ tags });
      },
      setCharacters: (characters) => {
        const { nodes, links } = CharactersToGraph(characters);
        set({
          characters,
          nodes,
          links,
        });
      },
      addCharacter: (character) => {
        const newCharacters = [...get().characters, character];
        const { nodes, links } = CharactersToGraph(newCharacters);
        set({
          characters: newCharacters,
          editing: false,
          nodes,
          links,
        });
      },
      deleteCharacter: (index) => {
        const charactersCopy = [...get().characters];
        charactersCopy.splice(index, 1);
        const { nodes, links } = CharactersToGraph(charactersCopy);
        set({
          characters: charactersCopy,
          nodes,
          links,
        });
      },
    }),
    { name: "rhizome-storage" },
  ),
);
