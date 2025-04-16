import Link from "next/link";
import Wave from "react-wavify";
import { FaGithub, FaCopyright } from "react-icons/fa";
export default function Footer() {
  return (
    <>
      <div className="pointer-events-none absolute bottom-8 z-50 flex h-16 w-full flex-col items-center gap-0 bg-transparent p-4 text-center text-xs text-white opacity-75 text-shadow-md sm:bottom-2">
        <p className="z-50 hidden sm:block">
          ПКМ перетаскивать график, вращать ЛКМ по фону, зум колёсиком
        </p>
        <p className="z-50">Перетащи ноду чтобы зафиксировать в пространстве</p>
        <p className="z-50 flex flex-row items-center gap-0">
          Освободить её можно повторным нажатием
        </p>
      </div>
      <Wave
        fill="#3a40ff"
        paused={false}
        className="absolute bottom-0 z-40 flex h-1/6 w-full items-center justify-center sm:h-1/10"
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      />
      <div className="absolute right-4 bottom-4 z-50 flex flex-row items-center gap-4 text-white">
        <Link
          target="_blank"
          className="flex flex-row items-center gap-1"
          href="https://github.com/ocelloid/rel_map_proto"
        >
          <FaGithub /> GitHub
        </Link>
        <Link
          target="_blank"
          className="flex flex-row items-center gap-1"
          href="https://ocelloid.com"
        >
          <FaCopyright /> Ocelloid
        </Link>
      </div>
    </>
  );
}
