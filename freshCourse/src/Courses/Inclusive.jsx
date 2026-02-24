import chapters from "./course-chapters/inclusive";
import CourseViewer from "./CourseViewer";

function Inclusive() {
  return(
    <CourseViewer courseName="Inclusive" chapters={chapters} />
  )
}

export default Inclusive;
