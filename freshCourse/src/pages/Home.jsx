import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ textAlign: "center", padding: "48px 32px", border: "0.5px solid #ddd", borderRadius: 12, marginBottom: 24 }}>
        <h1>Learn smarter. Pass your exams.</h1>
        <p style={{ color: "#666", maxWidth: 420, margin: "10px auto 24px" }}>
          EthioLearn brings all 15 freshman courses and past exams from 40+ Ethiopian universities into one place.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => navigate("/register")}>Get started</button>
          <button onClick={() => navigate("/login")}>Sign in</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{ border: "0.5px solid #ddd", borderRadius: 12, padding: 18 }}>
          <h3>Full course library</h3>
          <p style={{ fontSize: 13, color: "#666" }}>All 15 freshman courses with chapters, subtopics, and official module PDFs.</p>
        </div>
        <div style={{ border: "0.5px solid #ddd", borderRadius: 12, padding: 18 }}>
          <h3>Real past exams</h3>
          <p style={{ fontSize: 13, color: "#666" }}>Practice with actual exam papers from 40+ universities across multiple years.</p>
        </div>
        <div style={{ border: "0.5px solid #ddd", borderRadius: 12, padding: 18 }}>
          <h3>Track your progress</h3>
          <p style={{ fontSize: 13, color: "#666" }}>See exactly how much of each course you've completed and your exam scores.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 500 }}>15</div>
          <div style={{ fontSize: 12, color: "#666" }}>Courses</div>
        </div>
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 500 }}>40+</div>
          <div style={{ fontSize: 12, color: "#666" }}>Universities</div>
        </div>
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 500 }}>200+</div>
          <div style={{ fontSize: 12, color: "#666" }}>Past exams</div>
        </div>
        <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 500 }}>Free</div>
          <div style={{ fontSize: 12, color: "#666" }}>To use</div>
        </div>
      </div>
    </div>
  );
}

export default Home;