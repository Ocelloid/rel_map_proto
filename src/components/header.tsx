import Characters from "~/components/characters";

export default function Header() {
  return (
    <div className="flex w-full flex-row items-center justify-between bg-transparent p-4">
      <Characters />
    </div>
  );
}
