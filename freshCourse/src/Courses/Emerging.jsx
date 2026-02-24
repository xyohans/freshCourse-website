import chapters from "./course-chapters/logic";
import CourseViewer from "./CourseViewer";

function Emarging() {
  return(
    <CourseViewer courseName="Emerging Technologies" chapters={chapters} />
  )
}

export default Emarging;
