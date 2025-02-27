"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState, useActionState, useEffect, useRef } from "react";
import { generatePalette } from "@/actions/chat.actions";
import {
  PaperPlaneTilt,
  ChatTeardropDots,
  X,
  CircleNotch,
} from "@phosphor-icons/react";
import Form from "next/form";
import Link from "next/link";

// Define the initial state for the component - this is the shape used by the useActionState hook
const initialState = {
  message: "",
  colors: [],
};

// Define the shape of the message object
type Message = {
  role: "user" | "bot";
  content: string;
  colors?: string[];
};

export default function Chat() {
  // Reference to the messages container for scrolling when new messages are added
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Use the useActionState hook to manage the state and execute the generatePalette action.
  // The hook returns the current state (message string), the generatePalette action function and a boolean indicating if the action is pending.
  const [state, generateAction, pending] = useActionState(
    generatePalette,
    initialState,
  );

  // Define states fot the component
  const [isOpen, setIsOpen] = useState(false); // To toggle the chat window
  const [messages, setMessages] = useState<Message[]>([]); // To store the messages
  const [input, setInput] = useState(""); // Holds the user input

  // Function to toggle the chat window
  const toggleChat = () => setIsOpen(!isOpen);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // UseEffect to add new bot responses to the messages state
  useEffect(() => {
    // Check if AI has responded
    if (state.message && state.colors) {
      // update messages state
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: state.message,
          colors: state.colors,
        },
      ]);
      // Add setTimeout to ensure DOM has updated
      setTimeout(scrollToBottom, 100);
    }
  }, [state]);

  // Function to handle form submission
  const handleFormSubmit = (formData: FormData) => {
    const message = formData.get("message") as string; // Get user input
    if (!message?.trim()) return; // Don't submit empty messages
    setMessages((prev) => [...prev, { role: "user", content: message }]); // Add user message to messages state
    setInput(""); // Clear input field
    generateAction(formData); // Send user input to the AI
  };

  // Function to generate link URL from colors array
  const linkUrl = (colors: string[]) => {
    return `/${colors.map((color) => color.toLowerCase().replace("#", "")).join("-")}`;
  };

  return (
    <>
      <div className="fixed bottom-20 left-5 z-50 lg:bottom-5">
        {/* Chat icon */}
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            onClick={toggleChat}
            className="rounded-full bg-orange p-3 text-white shadow-lg transition"
          >
            <ChatTeardropDots size={24} />
          </motion.button>
        )}
      </div>
      <div className="fixed bottom-20 left-5 z-50 lg:bottom-5">
        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-80 rounded-lg bg-background shadow-xl sm:w-96"
            >
              {/* Chat header */}
              <div className="bg mb-2 flex items-center justify-between border-b p-4 pb-2">
                <h2 className="font-body text-lg font-semibold">
                  AI Palette Generator
                </h2>
                <button
                  onClick={toggleChat}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages container */}
              <div
                ref={messagesContainerRef}
                className="hide-scrollbar h-[60svh] overflow-y-auto rounded-md bg-gray-50 px-4 py-2"
              >
                <div className="">
                  <p className="mb-4 inline-block w-10/12 rounded-lg bg-[#FEDFD7] p-2 text-black">
                    Hello there! I can generate color palettes. What kind of
                    colors are you looking for? If you like a palette, you can
                    click on it to view the colors in the generator.
                  </p>
                </div>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block rounded-lg p-2 ${
                        msg.role === "user"
                          ? "w-max-10/12 bg-orange text-white"
                          : "w-10/12 bg-[#FEDFD7] text-black"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p>{msg.content}</p>
                      ) : (
                        <div>
                          <p className="mb-2">{msg.content}</p>
                          {msg.colors && (
                            <Link
                              href={linkUrl(msg.colors)}
                              className="flex justify-stretch overflow-hidden rounded-sm"
                            >
                              {msg.colors.map((color: string) => (
                                <div
                                  key={color}
                                  className="h-10 w-full shadow-sm lg:h-12"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* Loading spinner */}
                {pending && (
                  <CircleNotch
                    size={20}
                    className="mx-auto mt-4 animate-spin text-orange"
                  />
                )}
              </div>

              {/* Input form */}
              <Form
                action={handleFormSubmit}
                className="flex items-center gap-2 border-t p-4"
              >
                <input
                  type="text"
                  name="message"
                  autoComplete="off"
                  className="flex-1 rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
                  placeholder="Ask me about colors..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-orange p-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <PaperPlaneTilt size={20} />
                </button>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
