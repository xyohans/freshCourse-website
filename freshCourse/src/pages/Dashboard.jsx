import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courses from "../Courses/course-name";

function Dashboard() {
    const [startedCourses, setStartedCourses] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const started = courses
            .map((course) => {
                const current = Number(localStorage.getItem(`progress_${course.key}`)) || 0;
                const total = Number(localStorage.getItem(`total_${course.key}`)) || 0;
                const percent = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
                return { ...course, current, total, percent, started: total > 0 };
            })
            .filter((c) => c.started)
            .sort((a, b) => b.percent - a.percent);

        setStartedCourses(started);

        const raw = localStorage.getItem("recent_activities");
        try {
            const parsed = raw ? JSON.parse(raw) : [];
            setActivities(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setActivities([]);
        }
    }, []);

    function clearActivities() {
        localStorage.removeItem("recent_activities");
        setActivities([]);
    }

    return (
        <div style={{ padding: 20, display: "flex", gap: 20, alignItems: "flex-start" }}>
            <section style={{ flex: 2, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h2>My Courses</h2>
                {startedCourses.length === 0 ? (
                    <p>No courses started yet. Visit <Link to="/">Courses</Link> to begin.</p>
                ) : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {startedCourses.map((c) => (
                            <div key={c.key} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <strong>{c.name}</strong>
                                    <Link to={c.path}>
                                        <button>{c.started ? "Continue" : "Start"}</button>
                                    </Link>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ background: "#f0f0f0", height: 8, borderRadius: 999 }}>
                                        <div style={{ width: `${c.percent}%`, background: "#4caf50", height: "100%", borderRadius: 999 }} />
                                    </div>
                                    <small>{c.percent}% complete — topic {c.current + 1} of {c.total}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <aside style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>Recent Activities</h3>
                    <button onClick={clearActivities} style={{ fontSize: 12 }}>Clear</button>
                </div>

                {activities.length === 0 ? (
                    <p style={{ marginTop: 12 }}>No recent activity. Your latest progress will appear here.</p>
                ) : (
                    <ul style={{ marginTop: 12, paddingLeft: 16 }}>
                        {activities.slice(0, 10).map((act, i) => (
                            <li key={i} style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 14 }}>{act.text}</div>
                                <small style={{ color: "#666" }}>{act.time}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>
        </div>
    );
}

export default Dashboard;