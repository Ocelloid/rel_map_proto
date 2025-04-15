export default function Footer() {
  return (
    <div className="pointer-events-none fixed bottom-0 z-50 flex h-16 w-full flex-col items-center gap-0 bg-transparent p-4 text-xs text-white opacity-75 text-shadow-md">
      <p>ПКМ перетаскивать график, вращать ЛКМ по фону, зум колёсиком</p>
      <p>Перетащи ноду чтобы зафиксировать в пространстве</p>
      <p>Освободить её можно щелчком ЛКМ</p>
    </div>
  );
}
