import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/lib/AuthContext";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "@/pages/index";
import Auth from "@/pages/auth/index";
import Signup from "@/pages/signup/index";
import ForgotPassword from "@/pages/forgot-password/index";
import AskQuestion from "@/pages/ask/index";
import UserProfile from "@/pages/users/[id]/index";
import QuestionDetails from "@/pages/questions/[id]/index";
import LoginHistory from "@/pages/LoginHistory/LoginHistory";
import Users from "@/pages/users/index";
import Tags from "@/pages/tags/index";
import AIAssist from "@/pages/ai-assist/index";
import Saves from "@/pages/saves/index";
import Challenges from "@/pages/challenges/index";
import Chat from "@/pages/chat/index";
import Articles from "@/pages/articles/index";
import Companies from "@/pages/companies/index";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/ask" element={<AskQuestion />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:id" element={<UserProfile />} />
                    <Route path="/questions" element={<Home />} />
                    <Route path="/questions/:id" element={<QuestionDetails />} />
                    <Route path="/tags" element={<Tags />} />
                    <Route path="/login-history" element={<LoginHistory />} />
                    <Route path="/ai-assist" element={<AIAssist />} />
                    <Route path="/saves" element={<Saves />} />
                    <Route path="/challenges" element={<Challenges />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/companies" element={<Companies />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
