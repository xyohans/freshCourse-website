import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import Courses from "./pages/Course"
import Exams from "./pages/Exams"
import CourseViewer from "./pages/CourseViewer"
import Dashboard from "./pages/Dashboard"
import Footer from "./pages/Footer"
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
import NotFound from './pages/NotFound'


function HomeRedirect() {
  const { user, userLoading } = useUser()
  if (userLoading) return null
  return user ? <Navigate to="/dashboard" replace /> : <Home />
}

// NEW: only show footer on these exact routes
const FOOTER_PATHS = ["/", "/dashboard", "/courses", "/exams"]

function ConditionalFooter() {
  const location = useLocation()
  if (!FOOTER_PATHS.includes(location.pathname)) return null
  return <Footer />
}

function App() {

  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseKey" element={<CourseViewer />} />
          <Route path="/exams/:courseKey" element={<ExamViewer />} />
          <Route path="/exams/:courseKey/:paperId" element={<ExamRunner />} />
          <Route path="/exams" element={<Exams />} />         
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ConditionalFooter />
      </Router>
    </AuthProvider>
  )
}

export default App