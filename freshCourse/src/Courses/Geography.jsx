import chapters from "./course-chapters/geograpy";
import CourseViewer from "./CourseViewer";

function Geography() {
  return(
    <CourseViewer courseName="Geography" chapters={chapters} />
  )
}

export default Geography;
