import chapters from "./course-chapters/civics";
import CourseViewer from "./CourseViewer";

function Civics() {
  return(
    <CourseViewer courseName="Civics" chapters={chapters} />
  )
}

export default Civics;
