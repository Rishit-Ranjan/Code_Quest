import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, Smartphone, Monitor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const LoginHistoryCard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get("/auth/history");
                setHistory(res.data);
            } catch (error) {
                console.error("Failed to fetch login history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getDeviceIcon = (type) => {
        if (!type) return <Monitor className="w-4 h-4" />;
        if (type.toLowerCase().includes("mobile")) return <Smartphone className="w-4 h-4" />;
        return <Laptop className="w-4 h-4" />;
    };

    if (loading) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login History</CardTitle>
            </CardHeader>
            <CardContent>
                {history.length === 0 ? (
                    <p className="text-gray-500 text-sm">No login history found.</p>
                ) : (
                    <div className="space-y-4">
                        {history.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        {getDeviceIcon(entry.deviceType)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {entry.browser || "Unknown Browser"} on {entry.os || "Unknown OS"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            IP: {entry.ip || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                    <p>{new Date(entry.loginTime).toLocaleDateString()}</p>
                                    <p>{new Date(entry.loginTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LoginHistoryCard;
