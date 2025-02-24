import { Separator } from "@/components/ui/separator";
import { Heart, List } from "@phosphor-icons/react/dist/ssr";
import { generateColors } from "@/actions/colors.actions";
import Link from "next/link";
import Form from "next/form";

export default function Header() {
  return (
    <header className="bg-background py-2 h-[6svh] border-t border-foreground fixed bottom-0 w-full">
      <div className="w-11/12 mx-auto flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-orange">
          <Link href="/">Palette</Link>
        </h1>
        <div className="flex h-5 items-center space-x-4">
          <Form action={generateColors}>
            <button
              className="bg-orange text-white font-body text-xs p-2 rounded-md shadow-md"
              type="submit"
            >
              Generate
            </button>
          </Form>
          <Separator orientation="vertical" />
          <Heart className="h-5 w-5 text-foreground" />
          <Separator orientation="vertical" />
          <div>
            <List className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
