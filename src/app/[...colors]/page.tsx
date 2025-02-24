import { generateColors } from "@/actions/colors.actions";
import Header from "@/components/header";

type PageProps = {
  params: Promise<{
    colors?: string[];
  }>;
};

export default async function ColorsPage({ params }: PageProps) {
  const { colors: paramColors } = await params;

  const colors = paramColors?.[0]?.split("-") ?? (await generateColors());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-[94svh]">
      <Header />
      {colors.map((color) => (
        <div
          key={color}
          className="flex items-center justify-center text-white font-semibold h-full"
          style={{ backgroundColor: `#${color}` }}
        >
          <p>{color.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}
