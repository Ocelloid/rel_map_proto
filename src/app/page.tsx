"use client";
import Header from "~/components/header";
import Graph from "~/components/graph";
import NoSSR from "~/components/NoSSR";
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-[#d4cccc] to-[#b7baff]">
      <Header />
      <NoSSR>
        <Graph />
      </NoSSR>
    </main>
  );
}
