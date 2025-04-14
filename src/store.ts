import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createId } from "@paralleldrive/cuid2";

export type Character = {
  name: string;
  tags: string;
  color: string;
  shape: string;
  nodeId: string;
};

export type GraphNode = {
  id: string;
  name: string;
  group: string;
  color?: string;
  shape?: string;
  val: number;
};

export type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
  title?: string;
  color?: string;
  index?: number;
  group?: string;
};

interface LinkFormState {
  linkEditing: boolean;
  color: string;
  title: string;
  source: string;
  target: string;
}

interface LinkFormActions {
  setLinkEditing: (linkEditing: boolean) => void;
  setColor: (color: string) => void;
  setTitle: (title: string) => void;
  setSource: (source: string) => void;
  setTarget: (target: string) => void;
}

interface CharFormState {
  characterEditing: boolean;
  name: string;
  tags: string;
  color: string;
  shape: string;
  editingId?: string;
}

interface CharFormActions {
  setCharacterEditing: (characterEditing: boolean) => void;
  setName: (name: string) => void;
  setTags: (tags: string) => void;
  setColor: (color: string) => void;
  setShape: (shape: string) => void;
  setEditingId: (editingId?: string) => void;
}

interface GraphState {
  characters: Character[];
  nodes: GraphNode[];
  characterLinks: GraphLink[];
  characterEditing: boolean;
  linkEditing: boolean;
  name: string;
  tags: string;
  color: string;
  shape: string;
  title: string;
  source: string;
  target: string;
  editingId?: string;
}

interface GraphActions {
  setCharacters: (characters: Character[]) => void;
  addCharacter: (
    name: string,
    tags: string,
    color: string,
    shape: string,
    editingId?: string,
  ) => void;
  deleteCharacter: (index: number) => void;
  setCharacterEditing: (characterEditing: boolean) => void;
  setName: (name: string) => void;
  setTags: (tags: string) => void;
  setColor: (color: string) => void;
  setShape: (shape: string) => void;
  setLinkEditing: (linkEditing: boolean) => void;
  setTitle: (title: string) => void;
  setSource: (source: string) => void;
  setTarget: (target: string) => void;
  setEditingId: (editingId?: string) => void;
}

type CustomLinksState = {
  customLinks: GraphLink[];
};

type CustomLinksActions = {
  setCustomLinks: (customLinks: GraphLink[]) => void;
  addCustomLink: (customLink: GraphLink) => void;
  deleteCustomLink: (index: number) => void;
  deleteLinksForNode: (nodeId: string) => void;
  redraw: () => void;
};

function CharactersToGraph(characters: Character[]) {
  const nodes: GraphNode[] = [];
  const characterLinks: GraphLink[] = [];
  characters.forEach((character) => {
    nodes.push({
      id: character.nodeId,
      name: character.name,
      color: character.color,
      shape: character.shape,
      group: "characters",
      val: 10,
    });
    character.tags.split(",").forEach((tag) => {
      const trimmed = tag.trim();
      if (trimmed === "") return;
      if (!nodes.some((node) => node.name === trimmed))
        nodes.push({
          id: trimmed,
          name: trimmed,
          group: "tags",
          val: 5,
        });
      characterLinks.push({
        source: character.nodeId,
        target: trimmed,
      });
    });
  });
  return { nodes, characterLinks };
}

export const useCustomLinksStore = create(
  persist<CustomLinksState & CustomLinksActions>(
    (set, get) => ({
      customLinks: [],
      setCustomLinks: (customLinks) => {
        set({
          customLinks: customLinks.map((link) => ({
            index: link.index,
            source: (link.source as GraphNode).id,
            target: (link.target as GraphNode).id,
            title: link.title,
            color: link.color,
            group: link.group,
          })),
        });
      },
      addCustomLink: (customLink) => {
        const newCustomLinks = [...get().customLinks, customLink];
        set({ customLinks: newCustomLinks });
      },
      deleteCustomLink: (index) => {
        const customLinksCopy = [...get().customLinks];
        customLinksCopy.splice(index, 1);
        set({ customLinks: customLinksCopy });
      },
      redraw: () => {
        const oldLinks = [...get().customLinks];
        set({ customLinks: [] });
        set({ customLinks: oldLinks });
      },
      deleteLinksForNode(nodeId) {
        const oldLinks = [...get().customLinks];
        set({
          customLinks: oldLinks.filter(
            (link) =>
              link.source !== nodeId &&
              link.target !== nodeId &&
              (link.source as GraphNode).id !== nodeId &&
              (link.target as GraphNode).id !== nodeId,
          ),
        });
      },
    }),
    { name: "rhizome-custom-links-storage" },
  ),
);

export const useGraphStore = create(
  persist<GraphState & GraphActions>(
    (set, get) => ({
      characters: [],
      nodes: [],
      characterLinks: [],
      name: "",
      tags: "",
      color: "pink",
      shape: "sphere",
      characterEditing: false,
      linkEditing: false,
      source: "",
      target: "",
      title: "",
      editingId: undefined,
      setEditingId: (editingId) => {
        set({ editingId });
      },
      setTitle: (title) => {
        set({ title });
      },
      setSource: (source) => {
        set({ source });
      },
      setTarget: (target) => {
        set({ target });
      },
      setLinkEditing: (linkEditing) => {
        set({ linkEditing });
      },
      setCharacterEditing: (characterEditing) => {
        set({ characterEditing });
      },
      setName: (name) => {
        set({ name });
      },
      setTags: (tags) => {
        set({ tags });
      },
      setColor: (color) => {
        set({ color });
      },
      setShape: (shape) => {
        set({ shape });
      },
      setCharacters: (characters) => {
        const { nodes, characterLinks } = CharactersToGraph(characters);
        set({
          characters,
          nodes,
          characterLinks,
        });
      },
      addCharacter: (name, tags, color, shape, editingId) => {
        const newCharacter = {
          name,
          tags,
          color,
          shape,
          nodeId: editingId ?? createId(),
        };
        const newCharacters = [...get().characters, newCharacter];
        const { nodes, characterLinks } = CharactersToGraph(newCharacters);
        set({
          characters: newCharacters,
          characterEditing: false,
          nodes,
          characterLinks,
        });
      },
      deleteCharacter: (index) => {
        const charactersCopy = [...get().characters];
        charactersCopy.splice(index, 1);
        const { nodes, characterLinks } = CharactersToGraph(charactersCopy);
        set({
          characters: charactersCopy,
          nodes,
          characterLinks,
        });
      },
    }),
    { name: "rhizome-graph-storage" },
  ),
);

export const useCharFormStore = create(
  persist<CharFormState & CharFormActions>(
    (set) => ({
      name: "",
      tags: "",
      color: "pink",
      shape: "sphere",
      characterEditing: false,
      editingId: undefined,
      setEditingId: (editingId) => {
        set({ editingId });
      },
      setCharacterEditing: (characterEditing) => {
        set({ characterEditing });
      },
      setName: (name) => {
        set({ name });
      },
      setTags: (tags) => {
        set({ tags });
      },
      setColor: (color) => {
        set({ color });
      },
      setShape: (shape) => {
        set({ shape });
      },
    }),
    { name: "rhizome-char-form-storage" },
  ),
);

export const useLinkFormStore = create(
  persist<LinkFormState & LinkFormActions>(
    (set) => ({
      color: "pink",
      linkEditing: false,
      source: "",
      target: "",
      title: "",
      setColor: (color) => {
        set({ color });
      },
      setTitle: (title) => {
        set({ title });
      },
      setSource: (source) => {
        set({ source });
      },
      setTarget: (target) => {
        set({ target });
      },
      setLinkEditing: (linkEditing) => {
        set({ linkEditing });
      },
    }),
    { name: "rhizome-link-form-storage" },
  ),
);
