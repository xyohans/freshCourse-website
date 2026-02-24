import chapters from "./course-chapters/eng2";
import CourseViewer from "./CourseViewer";

function English2() {
  return(
    <CourseViewer courseName="English2" chapters={chapters} />
  )
}

export default English2;
