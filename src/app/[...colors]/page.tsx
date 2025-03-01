import ColorsPage from "@/components/color-page";
import { getUserPalettes } from "@/actions/colors.actions";

export default async function Page() {
  // Get user palettes and pass them to the ColorsPage component
  const userPalettes = await getUserPalettes();
  return (
    <>
      <ColorsPage userPalettes={userPalettes} />
    </>
  );
}
