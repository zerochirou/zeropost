import { ReactNode } from "react";

export default function FrameCards({ children }: { children: ReactNode }) {
  return (
    <div className="md:border-x border-b rounded-b-2xl">
      <ul className="grid grid-cols-1">{children}</ul>
    </div>
  );
}
