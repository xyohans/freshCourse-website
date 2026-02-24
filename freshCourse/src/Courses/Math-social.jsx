import chapters from "./course-chapters/math-for-social";
import CourseViewer from "./CourseViewer";

function Math_for_Social() {
  return(
    <CourseViewer courseName="Maths_for_Social" chapters={chapters} />
  )
}

export default Math_for_Social;
