import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Wez Creatives V1
        </h1>
        <p className="text-lg text-muted-foreground max-w-150">
          Project Foundation Established. Next.js, Tailwind CSS, and shadcn/ui are successfully configured.
        </p>
        <Button className="mt-8">Verify UI Component</Button>
      </div>
    </main>
  );
}