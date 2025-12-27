import React from "react";
import Mainlayout from "@/layout/Mainlayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Code2, Users, Timer, Star } from "lucide-react";

const Challenges = () => {
    const challenges = [
        {
            title: "Two Sum Optimization",
            diff: "Easy",
            points: 100,
            participants: 1240,
            time: "20 min",
            tags: ["Array", "Hash Table"]
        },
        {
            title: "Concurrent Task Runner",
            diff: "Hard",
            points: 500,
            participants: 156,
            time: "60 min",
            tags: ["Concurrency", "Async"]
        },
        {
            title: "LRU Cache Implementation",
            diff: "Medium",
            points: 300,
            participants: 489,
            time: "45 min",
            tags: ["Data Structures", "Design"]
        }
    ];

    return (
        <Mainlayout>
            <div className="max-w-6xl mx-auto p-4 lg:p-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 mb-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-8 h-8 text-yellow-300" />
                            <h1 className="text-3xl lg:text-4xl font-bold">Coding Challenges</h1>
                        </div>
                        <p className="text-orange-50 max-w-xl text-lg mb-6">
                            Solve problems, earn points, and climb the leaderboard. Our challenges are designed to help you master new concepts.
                        </p>
                        <div className="flex gap-4">
                            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8">View Leaderboard</Button>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10">Active Contests</Button>
                        </div>
                    </div>
                    <Star className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/10 rotate-12" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((c, i) => (
                        <Card key={i} className="flex flex-col border-2 hover:border-orange-200 transition-all group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
                                        <Code2 className="w-5 h-5 text-gray-700 group-hover:text-orange-600" />
                                    </div>
                                    <Badge className={
                                        c.diff === "Easy" ? "bg-green-100 text-green-700" :
                                            c.diff === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                    }>
                                        {c.diff}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold group-hover:text-orange-600 truncate transition-colors">
                                    {c.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex flex-wrap gap-1 mb-6">
                                    {c.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="text-[10px] font-normal">{tag}</Badge>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>{c.participants} joined</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Timer size={14} />
                                        <span>{c.time} limit</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-gray-50/50 p-4">
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-orange-700 font-bold text-sm">
                                        {c.points} XP
                                    </div>
                                    <Button size="sm" className="bg-gray-900 hover:bg-orange-600 transition-colors">Start Challenge</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </Mainlayout>
    );
};

export default Challenges;
