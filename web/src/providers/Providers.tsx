import { QueryProvider } from "./QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
