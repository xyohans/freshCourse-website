import { Link } from "react-router-dom"
import courses from "../Courses/course-name";

function Exams(){
    return(
        <div>
            <div>
                <h3>Mid Exams</h3>
                 {courses.map(course => (
                <div key={course.key}>
                    <p>{course.name}</p>
                    <Link to={course.path}><button>Start</button></Link>
                </div>
            ))}
            </div>
            <div>
                <h3>Final Exams</h3>
                {courses.map(course => (
                <div key={course.key}>
                    <p>{course.name}</p>
                    <Link to={course.path}><button>Start</button></Link>
                </div>
            ))}
            </div>
            
        </div>
    )
}

export default Exams