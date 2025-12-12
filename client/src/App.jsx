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
                    <Route path="/users/:id" element={<UserProfile />} />
                    <Route path="/questions/:id" element={<QuestionDetails />} />
                    <Route path="/login-history" element={<LoginHistory />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
