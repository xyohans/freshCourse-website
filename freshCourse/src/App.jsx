import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Courses from "./pages/Course"
import Exams from "./pages/Exams"
import CourseViewer from "./pages/CourseViewer"
import Dashboard from "./pages/Dashboard"
import Verify_email from "./pages/Verify"
import ExamViewer from "./pages/ExamViewer"
import ExamRunner from "./pages/ExamRunner"
import Home from "./pages/Home"
import Nav from "./pages/Nav"

function App() {
  return (

    <Router>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseKey" element={<CourseViewer />} />
        <Route path="/exams/:courseKey" element={<ExamViewer />} />
        <Route path="/exams/:courseKey/:paperId" element={<ExamRunner />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<Verify_email />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
