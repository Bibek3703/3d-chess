"use client";

import React from "react";
import { useChess } from "@/contexts/chess-context";
import { BotIcon } from "lucide-react";

function Commentry() {
    const {
        commentary,
    } = useChess();
    return (
        <div className="flex items-center gap-3 w-full">
            <div className="flex-1 w-full">
                <ChatBubble
                    message={commentary}
                    isUser={false}
                />
            </div>
            <div className="relative">
                <BotIcon className="text-primary-foreground w-12 h-12" />
            </div>
        </div>
    );
}

export default Commentry;

interface ChatBubbleProps {
    message: string;
    isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
    return (
        <div
            className={`relative flex gap-3 ${
                !isUser ? "justify-end" : "justify-start"
            }`}
        >
            <div
                className={`w-full rounded-lg px-4 py-2 ${
                    !isUser
                        ? "bg-secondary text-secondary-foreground rounded-tr-none"
                        : "bg-primary text-primary-foreground rounded-tl-none"
                }`}
            >
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};
