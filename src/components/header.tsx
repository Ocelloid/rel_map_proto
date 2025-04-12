"use client";
import { buttonVariants } from "~/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full flex-row items-center justify-between bg-transparent p-4">
      <Link href="/">
        <Image
          src="/favicon.png"
          alt="logo"
          width={128}
          height={128}
          className="h-16 w-16"
        />
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/characters">
        Персонажи
      </Link>
    </div>
  );
}
