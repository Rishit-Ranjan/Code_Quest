import React, { useEffect, useState } from "react";
import Mainlayout from "@/layout/Mainlayout";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bookmark, Loader2 } from "lucide-react";

const Saves = () => {
    const { user } = useAuth();
    const [savedQuestions, setSavedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await axiosInstance.get("/question/saved");
                setSavedQuestions(res.data.data);
            } catch (error) {
                console.error("Error fetching saved questions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSaved();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <Mainlayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
                </div>
            </Mainlayout>
        );
    }

    if (!user) {
        return (
            <Mainlayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800">Please log in to see your saved questions</h2>
                    <Link to="/auth" className="text-blue-600 hover:underline mt-4 block">Log in here</Link>
                </div>
            </Mainlayout>
        );
    }

    return (
        <Mainlayout>
            <div className="max-w-6xl mx-auto p-4 lg:p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Bookmark className="w-6 h-6 text-orange-600" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Saved Questions</h1>
                </div>

                {savedQuestions.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                        <p className="text-gray-500 text-lg">You haven't saved any questions yet.</p>
                        <Link to="/" className="text-blue-600 hover:underline mt-2 block">Browse questions</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedQuestions.map((q) => (
                            <div key={q._id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                                <Link to={`/questions/${q._id}`} className="text-blue-600 hover:text-blue-800 text-lg font-medium block mb-2">
                                    {q.questiontitle}
                                </Link>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{q.questionbody}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {q.questiontags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="text-[10px] bg-orange-500 text-white">{q.userposted[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{q.userposted}</span>
                                    </div>
                                    <span>Asked on {new Date(q.askedon).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Mainlayout>
    );
};

export default Saves;
