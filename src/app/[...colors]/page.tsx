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
    <div className="grid h-[94svh] grid-cols-1 lg:grid-cols-5">
      <Header colors={colors} />
      {colors.map((color) => (
        <div
          key={color}
          className="flex h-full items-center justify-center font-semibold text-white"
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
