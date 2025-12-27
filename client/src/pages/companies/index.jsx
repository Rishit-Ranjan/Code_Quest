import React from "react";
import Mainlayout from "@/layout/Mainlayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, Search, MapPin, ExternalLink } from "lucide-react";

const Companies = () => {
    const companies = [
        {
            name: "Antigravity AI",
            desc: "The world's first AI-powered developer toolkit built for the next generation of engineers.",
            location: "San Francisco, CA",
            tags: ["AI", "SaaS", "DevTools"],
            logo: "🤖"
        },
        {
            name: "TechNova",
            desc: "Leading provider of cloud infrastructure and scalable backend solutions for global enterprises.",
            location: "New York, NY",
            tags: ["Cloud", "Enterprise", "B2B"],
            logo: "☁️"
        },
        {
            name: "EcoCode Systems",
            desc: "Pioneering sustainable software development through efficient algorithms and green hosting.",
            location: "Berlin, DE",
            tags: ["Sustainability", "Open Source"],
            logo: "🌱"
        },
        {
            name: "CyberShield",
            desc: "Protecting the world's data with advanced cryptography and real-time threat detection.",
            location: "Tel Aviv, IL",
            tags: ["Security", "FinTech"],
            logo: "🛡️"
        },
        {
            name: "Velocity Gear",
            desc: "High-performance gaming accessories and specialized software for professional e-sports athletes.",
            location: "Seoul, KR",
            tags: ["E-sports", "Hardware"],
            logo: "🎮"
        }
    ];

    return (
        <Mainlayout>
            <div className="max-w-6xl mx-auto p-4 lg:p-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Companies</h1>
                    </div>
                    <p className="text-gray-600">Explore tech organizations and find your next career move.</p>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input className="pl-10 py-6 text-lg border-gray-200" placeholder="Search by name, location or keyword..." />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {companies.map((company, idx) => (
                        <Card key={idx} className="hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:bg-purple-50 transition-colors">
                                        {company.logo}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <MapPin size={14} className="text-purple-500" />
                                            {company.location}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            {company.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {company.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </Mainlayout>
    );
};

export default Companies;
