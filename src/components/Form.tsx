"use client";

import { useState } from "react";
import { Textarea } from "../components/ui/textarea";
import { Dices, Loader, SendIcon } from "lucide-react";
import { prompts } from "@/lib/data";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useReward } from "react-rewards";

interface Props {
  userId: string;
}

const Form = ({ userId }: Props) => {
  const { reward, isAnimating } = useReward("rewardId", "confetti", {
    lifetime: 200,
    elementCount: 90,
    spread: 70,
    zIndex: 9999,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const MAX_CHARS = 300;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.length > MAX_CHARS) {
      toast.error("Message is too long!", {
        description: `Please keep it under ${MAX_CHARS} characters.`,
      });
      return;
    }
    setLoading(true);
    reward();
    const content = message;
    try {
      if (!content) {
        toast.warning("Oopsie😕,the Message is blank...", {
          description: "Type in something and send again!🔥🤩",
        });
      } else {
        await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify({ content, userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMessage("");
        toast.success("Message is sent successfully 💌 and anonymously!", {
          description: "Create your account to get your messages!🔥🤩",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message 😕", {
        description: "Please try again later!🔥🤩",
      });
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  function getRandom() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setMessage(prompts[randomIndex]);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <span id="rewardId" />

      <div className="relative w-full sm:w-5/12 min-w-[220px]">
        <Textarea
          placeholder="Show your Ryzz 🤪"
          value={message}
          maxLength={MAX_CHARS}
          className="w-full rounded-b-2xl min-h-[120px] rounded-t-none  bg-zinc-200/50 text-slate-800 border-zinc-400/50 font-semibold text-base focus:ring-inset placeholder:text-zinc-200/85"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div
          className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-1 bg-zinc-200 rounded-full transition-all active:scale-95 hover:scale-105 active:rotate-12"
          onClick={getRandom}
        >
          <Dices className="text-zinc-600" />
        </div>
        <div className="absolute -bottom-6 right-1 text-xs font-medium text-muted-foreground">
          {message.length} / {MAX_CHARS}
        </div>
      </div>

      <Button
        type="submit"
        className="mt-8 font-semibold text-lg md:text-xl"
        size={"lg"}
        disabled={loading || isAnimating || message.length > MAX_CHARS}
      >
        {loading ? (
          <Loader className="animate-spin ease-in-out" />
        ) : (
          <>
            Send <SendIcon className="ml-2" />
          </>
        )}
      </Button>
    </form>
  );
};

export default Form;
