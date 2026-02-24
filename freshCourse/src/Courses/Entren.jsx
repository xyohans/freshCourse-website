import chapters from "./course-chapters/entern";
import CourseViewer from "./CourseViewer";

function Entren() {
  return(
    <CourseViewer courseName="Entrepreneurship" chapters={chapters} />
  )
}

export default Entren;
