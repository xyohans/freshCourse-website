import { Link } from "react-router-dom";
import courses from "../Courses/course-name";
import { useState } from "react";

function Courses() {

  const [filter, setFilter] = useState({ natural: false, social: false });

  function handleFilters(e) {
    const { name, checked } = e.target;
    setFilter(prev => ({ ...prev, [name]: checked }));
  }

  const filteredCourses = courses.filter(course => {
    // nothing checked → show all
    if (!filter.natural && !filter.social) return true;

    // "both" stream courses always show if ANY filter is active
    if (course.stream === "both") return true;

    // otherwise match the checked filter
    return filter[course.stream];
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="social"
          checked={filter.social}
          onChange={handleFilters}
        />
        Social
      </label>
      <label>
        <input
          type="checkbox"
          name="natural"
          checked={filter.natural}
          onChange={handleFilters}
        />
        Natural
      </label>

      <div>
        {filteredCourses.map(course => {
          const current = Number(localStorage.getItem(`progress_${course.key}`)) || 0;
          const total   = Number(localStorage.getItem(`total_${course.key}`)) || 0;
          const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
          const started = total > 0;

          return (  
            <div key={course.key}>  
              <p>{course.name}</p>  
              {started && (
                <>
                  <div style={{ background: "#eee", borderRadius: 999, height: 6, margin: "6px 0" }}>
                    <div style={{ width: `${percent}%`, background: "#4caf50", height: "100%", borderRadius: 999 }} />
                  </div>
                  <small>{percent}% complete — topic {current + 1} of {total}</small>
                </>
              )}
              <Link to={course.path}>
                <button>{started ? "Continue" : "Start"}</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Courses;