import chapters from "./course-chapters/math-natural";
import CourseViewer from "./CourseViewer";

function Math_for_Natural() {
  return(
    <CourseViewer courseName="Math_for_Natural" chapters={chapters} />
  )
}

export default Math_for_Natural;
