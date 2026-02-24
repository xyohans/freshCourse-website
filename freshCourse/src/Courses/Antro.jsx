import chapters from "./course-chapters/anthro";
import CourseViewer from "./CourseViewer";

function Anthropology() {
  return(
    <CourseViewer courseName="Anthropology" chapters={chapters} />
  )
}

export default Anthropology;
