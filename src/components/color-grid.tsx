type ColorGridProps = {
  palettes: { colors: string[] }[];
};

export default function ColorGrid({ palettes }: ColorGridProps) {
  return (
    <div className="mx-auto grid w-10/12 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {palettes.map((palette, index) => (
        <div
          key={index}
          className="flex h-12 overflow-hidden rounded-md shadow-md"
        >
          {palette.colors.map((color, colorIndex) => (
            <div
              key={colorIndex}
              className="h-full flex-1"
              style={{ backgroundColor: `#${color}` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
