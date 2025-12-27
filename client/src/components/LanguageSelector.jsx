import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import axiosInstance from "../lib/axiosinstance";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "hi", name: "हिन्दी" },
    { code: "pt", name: "Português" },
    { code: "zh", name: "中文" },
];

const LanguageSelector = () => {
    const { t, i18n } = useTranslation();
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [otpMethod, setOtpMethod] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLanguageSelect = async (langCode) => {
        setShowDropdown(false);

        if (langCode === i18n.language) {
            return; // Already in this language
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.token) {
            toast.error("Please login first");
            return;
        }

        try {
            const res = await axiosInstance.post("/user/request-language-switch", {
                targetLanguage: langCode,
            });

            setTargetLanguage(langCode);
            setOtpMethod(res.data.otpMethod);
            setShowOtpModal(true);
            toast.info(res.data.message);
        } catch (error) {
            if (error.response?.data?.needsPhone) {
                toast.error(t("language.addPhoneFirst"));
                // Could redirect to profile page to add phone
            } else {
                toast.error(error.response?.data?.message || "Failed to request language switch");
            }
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error(t("auth.enterOTP"));
            return;
        }

        try {
            const res = await axiosInstance.post("/user/verify-language-switch", {
                otp,
                targetLanguage,
            });

            i18n.changeLanguage(targetLanguage);
            localStorage.setItem("language", targetLanguage);
            toast.success(t("language.languageUpdated"));
            setShowOtpModal(false);
            setOtp("");
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        }
    };

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{currentLanguage.name}</span>
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${lang.code === i18n.language ? "bg-gray-50 font-medium" : ""
                                    }`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("language.verifyOTP")}</DialogTitle>
                        <DialogDescription>
                            {t("auth.otpSentEmail")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="otp">{t("auth.enterOTP")}</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleVerifyOtp} className="w-full">
                            {t("common.submit")}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LanguageSelector;
