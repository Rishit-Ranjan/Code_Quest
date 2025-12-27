import React, { useEffect, useState } from "react";
import Mainlayout from "@/layout/Mainlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, User, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";

const Articles = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axiosInstance.get("/article/get");
                setArticles(res.data.data || []);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    if (loading) {
        return (
            <Mainlayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="animate-spin h-10 w-10 text-orange-500" />
                </div>
            </Mainlayout>
        );
    }

    return (
        <Mainlayout>
            <div className="max-w-6xl mx-auto p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold">Articles</h1>
                    </div>
                    {user && (
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                            <Plus size={18} /> Write Article
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {articles.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                            <p className="text-gray-500 text-lg">No articles published yet.</p>
                        </div>
                    ) : (
                        articles.map((article) => (
                            <Card key={article._id} className="hover:shadow-lg transition-shadow border-gray-100">
                                <CardHeader>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {article.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="text-xl hover:text-blue-600 cursor-pointer transition-colors">
                                        {article.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                        {article.content}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
                                        <div className="flex items-center gap-2">
                                            <User size={14} />
                                            <span className="font-medium text-gray-700">{article.authorName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </Mainlayout>
    );
};

export default Articles;
