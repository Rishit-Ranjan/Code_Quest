import React, { useState, useEffect, useRef } from 'react';
import Mainlayout from '@/layout/Mainlayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import axiosInstance from '@/lib/axiosinstance';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

const AIAssist = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hello! I'm your AI coding assistant. How can I help you with your project today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!user) {
            toast.error("Please log in to use AI Assist");
            return;
        }

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/ai/chat', { message: input });
            const aiReply = {
                role: 'ai',
                content: response.data.reply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiReply]);
        } catch (error) {
            toast.error("Failed to get response from AI");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Mainlayout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4">
                <Card className="flex-1 flex flex-col shadow-lg border-orange-100 overflow-hidden">
                    <CardHeader className="border-b bg-orange-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500 rounded-lg">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">AI Assist</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    Powered by Gemini <Sparkles className="w-3 h-3 text-orange-400" />
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex items-start gap-3 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <Avatar className={cn(
                                    "w-8 h-8",
                                    msg.role === 'ai' ? "bg-orange-600" : "bg-blue-600"
                                )}>
                                    <AvatarFallback className="text-white">
                                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={cn(
                                    "rounded-2xl p-3 text-sm shadow-sm",
                                    msg.role === 'user'
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-orange-100 rounded-tl-none"
                                )}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <span className={cn(
                                        "text-[10px] block mt-1 opacity-70",
                                        msg.role === 'user' ? "text-right" : "text-left"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 bg-orange-600">
                                    <AvatarFallback className="text-white italic">
                                        <Bot size={16} />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-white border border-orange-100 rounded-2xl p-3 px-5 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                    <span className="text-sm text-gray-400 italic">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <div className="p-4 border-t bg-white">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                placeholder="Ask me anything about your code..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 focus-visible:ring-orange-200"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-md active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-center text-gray-400 mt-2">
                            AI Assist may provide inaccurate code. Always review before implementing.
                        </p>
                    </div>
                </Card>
            </div>
        </Mainlayout>
    );
};

export default AIAssist;
