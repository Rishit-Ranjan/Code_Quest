import React, { useState, useEffect, useRef } from "react";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Users, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const Chat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, user: "Alex", content: "Hey guys, has anyone seen the new React 19 documentation?", timestamp: "10:30 AM" },
        { id: 2, user: "Sarah", content: "Yeah, the compiler looks insane! It's going to save so much manual memoization.", timestamp: "10:32 AM" },
        { id: 3, user: "Mike", content: "I'm still trying to wrap my head around 'use' hook.", timestamp: "10:35 AM" }
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        const newMessage = {
            id: messages.length + 1,
            user: user.name,
            content: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Mainlayout>
            <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col p-4 lg:p-6">
                <div className="flex flex-1 bg-white rounded-2xl border overflow-hidden shadow-sm">
                    {/* Channel Sidebar */}
                    <div className="w-20 md:w-64 border-r bg-gray-50 flex flex-col">
                        <div className="p-4 border-b font-bold flex items-center gap-2">
                            <MessageSquare className="text-orange-600 hidden md:block" />
                            <span className="truncate hidden md:block">Community Chat</span>
                        </div>
                        <div className="flex-1 p-2 space-y-2">
                            <div className="bg-orange-100 text-orange-700 p-2 rounded-lg flex items-center gap-2 cursor-pointer">
                                <Hash size={18} />
                                <span className="text-sm font-medium hidden md:block">general-discussion</span>
                            </div>
                            <div className="text-gray-600 p-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                                <Hash size={18} />
                                <span className="text-sm font-medium hidden md:block">javascript-help</span>
                            </div>
                            <div className="text-gray-600 p-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                                <Hash size={18} />
                                <span className="text-sm font-medium hidden md:block">showcase</span>
                            </div>
                        </div>
                        <div className="p-4 border-t hidden md:block">
                            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                342 members online
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800"># general-discussion</span>
                                <span className="text-xs text-gray-400 hidden sm:block">• Discuss anything and everything</span>
                            </div>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Users size={18} />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex items-start gap-4", msg.isMe && "flex-row-reverse")}>
                                    <Avatar className="w-9 h-9 shrink-0">
                                        <AvatarFallback className={cn("text-white font-bold", msg.isMe ? "bg-blue-600" : "bg-orange-500")}>
                                            {msg.user[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={cn("flex flex-col", msg.isMe && "items-end")}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-gray-900">{msg.user}</span>
                                            <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm max-w-[80%] sm:max-w-md",
                                            msg.isMe
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        <div className="p-4 border-t">
                            <form onSubmit={handleSend} className="flex gap-3">
                                <Input
                                    className="flex-1 bg-gray-50 border-gray-200"
                                    placeholder={user ? "Send a message..." : "Please log in to chat"}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={!user}
                                />
                                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={!user}>
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Mainlayout>
    );
};

export default Chat;
