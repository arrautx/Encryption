import { DecryptPanel } from "@/components/decrypt-panel";
import { EncryptPanel } from "@/components/encrypt-panel";

export default function Home() {
  return (
    <main className="mx-auto max-w-[560px] px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-display text-5xl font text-foreground">
          Image Encryptor
        </h1>
       
      </div>

      <EncryptPanel />

      <div className="my-8 border-t border-border" />

      <DecryptPanel />
    </main>
  );
}
