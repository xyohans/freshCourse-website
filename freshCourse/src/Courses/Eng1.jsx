import chapters from "./course-chapters/eng1";
import CourseViewer from "./CourseViewer";

function English1() {
  return(
    <CourseViewer courseName="English1" chapters={chapters} />
  )
}

export default English1;
