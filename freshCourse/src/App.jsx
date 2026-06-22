import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Courses from "./pages/Course"
import Exams from "./pages/Exams"
import CourseViewer from "./pages/CourseViewer"
import Dashboard from "./pages/Dashboard"
import Verify_email from "./pages/Verify"
import ExamViewer from "./pages/ExamViewer"
import ExamRunner from "./pages/ExamRunner"
import Home from "./pages/Home"
import Nav from "./pages/Nav"
import AuthPage from "./auth/Authpage"
import ForgotPassword from "./users/ForgetPassword"
import ResetPassword from "./users/ResetPassword"
import Profile from "./users/Profile"
import { useUser } from "./context/AuthContext"
import { AuthProvider } from "./context/AuthContext"


function HomeRedirect() {
  const { user, userLoading } = useUser()
  if (userLoading) return null
  return user ? <Navigate to="/dashboard" replace /> : <Home />
}


function App() {

  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseKey" element={<CourseViewer />} />
          <Route path="/exams/:courseKey" element={<ExamViewer />} />
          <Route path="/exams/:courseKey/:paperId" element={<ExamRunner />} />
          <Route path="/verification" element={<Verify_email />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
