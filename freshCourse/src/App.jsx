import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Courses from "./pages/Course"
import Exams from "./pages/Exams"
import courses from "./Courses/course-name"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <Router>
      <nav>
        <Link to="/courses">Courses</Link>
        <Link to="/exams">Exams</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        {courses.map(course => (
          <Route key={course.key} path={course.path} element={<course.component />} />
        ))}
        <Route path="/exams" element={<Exams />} />
      </Routes>
    </Router>
  )
}

export default App
