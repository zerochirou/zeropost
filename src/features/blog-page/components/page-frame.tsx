export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 md:border-x border-b rounded-b-2xl">
      {children}
    </div>
  );
}