import Header from "@/components/header";

type PageProps = {
  params: Promise<{
    colors?: string[];
  }>;
};

const determineTextColor = (color: string) => {
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness >= 128 ? "black" : "white";
};

export default async function ColorsPage({ params }: PageProps) {
  const { colors: paramColors } = await params;

  const colors = paramColors?.[0]?.split("-") ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-[94svh]">
      <Header />
      {colors.map((color) => (
        <div
          key={color}
          className="flex items-center justify-center text-white font-semibold h-full"
          style={{
            backgroundColor: `#${color}`,
            color: determineTextColor(color),
          }}
        >
          <p>{color.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}
