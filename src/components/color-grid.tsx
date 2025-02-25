type ColorGridProps = {
  palettes: { colors: string[] }[];
};

export default function ColorGrid({ palettes }: ColorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-10/12 mx-auto">
      {palettes.map((palette, index) => (
        <div
          key={index}
          className="flex rounded-md overflow-hidden h-12 shadow-md"
        >
          {palette.colors.map((color, colorIndex) => (
            <div
              key={colorIndex}
              className="flex-1 h-full"
              style={{ backgroundColor: `#${color}` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
