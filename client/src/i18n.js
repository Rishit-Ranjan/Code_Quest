import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "nav": {
                "questions": "Questions",
                "tags": "Tags",
                "users": "Users",
                "companies": "Companies",
                "saves": "Saves",
                "challenges": "Challenges",
                "ai_assist": "AI Assist",
                "chat": "Chat",
                "articles": "Articles"
            },
            "home": {
                "ask_question": "Ask Question",
                "top_questions": "Top Questions",
                "no_questions": "No questions found.",
                "votes": "votes",
                "answers": "answers",
                "asked": "asked"
            },
            "auth": {
                "login": "Log in",
                "signup": "Sign up",
                "email": "Email",
                "password": "Password",
                "otp": "Enter OTP",
                "verify": "Verify"
            },
            "language": {
                "switch": "Switch Language",
                "verify_title": "Verification Required",
                "verify_desc": "Please enter the OTP sent to your {{method}} to switch to {{lang}}.",
                "french_notice": "Email verification is required for French.",
                "mobile_notice": "Mobile verification is required for this language.",
                "phone_placeholder": "Enter mobile number",
                "update_phone": "Update Phone",
                "cancel": "Cancel"
            }
        }
    },
    es: {
        translation: {
            "nav": {
                "questions": "Preguntas",
                "tags": "Etiquetas",
                "users": "Usuarios",
                "companies": "Empresas",
                "saves": "Guardados",
                "challenges": "Desafíos",
                "ai_assist": "Asistente AI",
                "chat": "Chat",
                "articles": "Artículos"
            },
            "home": {
                "ask_question": "Hacer Pregunta",
                "top_questions": "Mejores Preguntas",
                "no_questions": "No se encontraron preguntas.",
                "votes": "votos",
                "answers": "respuestas",
                "asked": "preguntado"
            }
        }
    },
    hi: {
        translation: {
            "nav": {
                "questions": "प्रश्न",
                "tags": "टैग",
                "users": "उपयोगकर्ता",
                "companies": "कंपनियां",
                "saves": "सहेजे गए",
                "challenges": "चुनौतियां",
                "ai_assist": "AI सहायक",
                "chat": "चैट",
                "articles": "लेख"
            },
            "home": {
                "ask_question": "प्रश्न पूछें",
                "top_questions": "शीर्ष प्रश्न",
                "no_questions": "कोई प्रश्न नहीं मिला।"
            }
        }
    },
    pt: {
        translation: {
            "nav": {
                "questions": "Perguntas",
                "tags": "Tags",
                "users": "Usuários",
                "companies": "Empresas",
                "saves": "Salvos",
                "challenges": "Desafios",
                "ai_assist": "Assistente AI",
                "chat": "Chat",
                "articles": "Artigos"
            },
            "home": {
                "ask_question": "Fazer Pergunta",
                "top_questions": "Principais Perguntas"
            }
        }
    },
    zh: {
        translation: {
            "nav": {
                "questions": "问题",
                "tags": "标签",
                "users": "用户",
                "companies": "公司",
                "saves": "收藏",
                "challenges": "挑战",
                "ai_assist": "AI 助手",
                "chat": "聊天",
                "articles": "文章"
            },
            "home": {
                "ask_question": "提问",
                "top_questions": "热门问题"
            }
        }
    },
    fr: {
        translation: {
            "nav": {
                "questions": "Questions",
                "tags": "Étiquettes",
                "users": "Utilisateurs",
                "companies": "Entreprises",
                "saves": "Sauvegardes",
                "challenges": "Défis",
                "ai_assist": "Assistant IA",
                "chat": "Chat",
                "articles": "Articles"
            },
            "home": {
                "ask_question": "Poser une question",
                "top_questions": "Meilleures questions"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
