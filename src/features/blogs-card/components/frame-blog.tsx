import { ReactNode } from "react";

export default function FrameBlog({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl w-full">
      {children}
    </div>
  );
}