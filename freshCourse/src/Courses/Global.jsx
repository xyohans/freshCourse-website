import chapters from "./course-chapters/global";
import CourseViewer from "./CourseViewer";

function Global() {
  return(
    <CourseViewer courseName="Global Trend" chapters={chapters} />
  )
}

export default Global;
