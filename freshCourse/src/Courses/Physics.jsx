import chapters from "./course-chapters/physics";
import CourseViewer from "./CourseViewer";

function Physics() {
  return(
    <CourseViewer courseName="Physics" chapters={chapters} />
  )
}

export default Physics;
