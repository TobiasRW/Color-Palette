"use server";

export async function generateColors() {
  const getRandomColor = () =>
    `${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

  return Array.from({ length: 5 }, getRandomColor);
}
