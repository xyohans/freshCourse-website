import chapters from "./course-chapters/history-chapters";
import CourseViewer from "./CourseViewer";

function History() {
  return(
    <CourseViewer courseName="History" chapters={chapters} />
  )
}

export default History;
