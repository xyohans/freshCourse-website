import chapters from "./course-chapters/psycho";
import CourseViewer from "./CourseViewer";

function Psychology() {
  return(
    <CourseViewer courseName="General Psychology" chapters={chapters} />
  )
}

export default Psychology;
