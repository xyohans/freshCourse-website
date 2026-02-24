import chapters from "./course-chapters/logic";
import CourseViewer from "./CourseViewer";

function Logic() {
  return(
    <CourseViewer courseName="Logic and Critical Thinking" chapters={chapters} />
  )
}

export default Logic;
