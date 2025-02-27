"use server";
import { z } from "zod";
import mistral from "@/lib/mistral";

// Define the response schema
const responseSchema = z.object({
  message: z.string(),
  colors: z.array(z.string()),
});

// Define the message type
type Message = {
  role: "system" | "user";
  content: string;
};

// Define the function to generate a response
export async function generateResponse(message: string) {
  // Check if the message is empty
  if (!message) {
    return {
      message: "Please provide a message",
      colors: [],
    };
  }

  // System prompt to guide the model
  const systemPrompt = `
  You are Palette, a chatbot that generates color palettes based on the user's message. Only answer color-related questions. If the user asks a question that is not related to colors, you can respond with "I couldn't generate colors for this question" and dont return a color palette. Always remember to keep the conversation engaging and fun, and to reply in a with the user's message in mind. 
  Here a some things to take into consideration:
  - The color palette should always have 5 colors
  - The colors should all match the theme of the user's message
  - The colors should be generated based on the user's message
  - The colors should always be in hex code format (e.g. #FF0000)
  - The colors should not be too vibrant
  - Use color theory to generate the colors
  - The colors should be visually appealing
  - No two colors in a palette should be identical 
  `;

  // Send the message to the model
  const messages: Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  // Call the Mistral API to parse the messages
  const response = await mistral.chat.parse({
    model: "mistral-small-latest",
    messages: messages,
    responseFormat: responseSchema,
  });

  // Extract the ai generated response
  const colors = response.choices?.[0]?.message?.parsed;

  // if no response is generated, return a default message
  if (!colors) {
    return {
      message: "I couldn't generate colors for this message",
      colors: [],
    };
  }

  // Return the response
  return colors;
}

// Function to handle user form submission (input from the user)
export async function generatePalette(_prevState: any, formData: FormData) {
  const message = formData.get("message") as string;
  const modelResponse = await generateResponse(message);
  return modelResponse;
}
