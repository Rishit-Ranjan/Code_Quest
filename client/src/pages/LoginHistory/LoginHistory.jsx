import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosinstance";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { format } from "date-fns";

const LoginHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get("/user/history");
                setHistory(res.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold mb-4">Login History</h2>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Browser</TableHead>
                            <TableHead>OS</TableHead>
                            <TableHead>Device</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((entry) => (
                            <TableRow key={entry._id}>
                                <TableCell>{entry.browser}</TableCell>
                                <TableCell>{entry.os}</TableCell>
                                <TableCell>{entry.deviceType}</TableCell>
                                <TableCell>{entry.ip}</TableCell>
                                <TableCell>
                                    {format(new Date(entry.loginTime), "PPpp")}
                                </TableCell>
                            </TableRow>
                        ))}
                        {history.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No login history found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default LoginHistory;
