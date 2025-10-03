import ColorApplier from "@/components/ColorApplier";
import { Toaster } from "@/components/ui/sonner";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ColorApplier />
      <Toaster />
    </>
  );
}
