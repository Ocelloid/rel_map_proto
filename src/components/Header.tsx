import Characters from "~/components/Characters";

export default function Header() {
  return (
    <div className="fixed top-0 z-50 flex h-32 w-full flex-row items-center justify-between bg-transparent p-4">
      <Characters />
    </div>
  );
}
