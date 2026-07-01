import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "../styles/courses.module.css";
import { useUser } from "../context/AuthContext"; 

function CourseViewer() {
  const { courseKey } = useParams();
  const [chapters, setChapters] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [openChapter, setOpenChapter] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false); // NEW
  const [completedIds, setCompletedIds] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" ? window.innerWidth > 768 : true
  );

  const { user, userLoading } = useUser();
  const userId = user?.id;

  useEffect(() => {
    fetch(`/api/courses/${courseKey}`)
      .then(res => res.json())
      .then(data => {
        setCourseName(data.title);
        setCourseId(data.id);
        setPdfUrl(data.pdf_url);
        setChapters(data.chapters);
        setLoading(false);
      });
  }, [courseKey]);

  useEffect(() => {
    fetch(`/api/progress/${courseKey}?userId=${userId}`)
      .then(res => res.json())
      .then(ids => setCompletedIds(ids))
      .catch(err => console.error(err));
  }, [courseKey]);

  const allTopics = useMemo(() => {
    return chapters.flatMap(chapter =>
      chapter.subtopics.map(subtopic => ({
        subtopic,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      }))
    );
  }, [chapters]);

  const currentTopic = allTopics[currentIndex] || null;

  useEffect(() => {
    if (currentTopic && !openChapter.includes(currentTopic.chapterId)) {
      setOpenChapter(prev => [...prev, currentTopic.chapterId]);
    }
  }, [currentTopic]);

  // UPDATED: track contentLoading around the fetch
  useEffect(() => {
    if (!currentTopic) return;

    if (!currentTopic.subtopic.content_url) {
      setContent("_Content not available yet._");
      return;
    }

    setContent("");
    setContentLoading(true); // NEW

    fetch(currentTopic.subtopic.content_url)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(text => {
        setContent(text);
        setContentLoading(false); // NEW
      })
      .catch(err => {
        console.error("Failed to fetch content:", err);
        setContent("_Content not available yet._");
        setContentLoading(false); // NEW
      });

  }, [currentTopic]);

  function handleTopicClick(subtopicId, chapterId) {
    const index = allTopics.findIndex(
      t => t.subtopic.id === subtopicId && t.chapterId === chapterId
    );
    setCurrentIndex(index);

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }

  function toggleChapter(id) {
    if (openChapter.includes(id))
      setOpenChapter(openChapter.filter(ch => ch !== id));
    else
      setOpenChapter([...openChapter, id]);
  }

  async function markComplete() {
    if (!currentTopic || !courseId) return;
    const subtopicId = currentTopic.subtopic.id;

    if (completedIds.includes(subtopicId)) return;

    try {
      await fetch('/api/progress/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subtopicId, courseId })
      });
      setCompletedIds(prev => [...prev, subtopicId]);
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  }

  // UPDATED: full skeleton screen instead of plain text
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonSidebar}>
          <div className={styles.skeletonLine} style={{ width: "60%", height: 18 }} />
          <div className={styles.skeletonLine} style={{ width: "40%" }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonChapterBlock}>
              <div className={styles.skeletonLine} style={{ width: "80%" }} />
              <div className={styles.skeletonLine} style={{ width: "65%" }} />
            </div>
          ))}
        </div>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonLine} style={{ width: "30%", height: 12 }} />
          <div className={styles.skeletonLine} style={{ width: "70%", height: 26, marginTop: 10 }} />
          <div className={styles.skeletonLine} style={{ width: "100%", marginTop: 24 }} />
          <div className={styles.skeletonLine} style={{ width: "95%" }} />
          <div className={styles.skeletonLine} style={{ width: "88%" }} />
          <div className={styles.skeletonLine} style={{ width: "92%" }} />
        </div>
      </div>
    );
  }

  const totalTopics = allTopics.length;
  const doneCount = allTopics.filter(t => completedIds.includes(t.subtopic.id)).length;
  const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0;
  const isCurrentDone = currentTopic && completedIds.includes(currentTopic.subtopic.id);

  return (
    <div className={styles.container}>
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ""}`}>
        <h3>{courseName}</h3>
        <p>{doneCount}/{totalTopics} subtopics · {percent}%</p>
        <div style={{ background: "#eee", borderRadius: 999, height: 6, margin: "6px 0 14px" }}>
          <div style={{ width: `${percent}%`, background: "#4caf50", height: "100%", borderRadius: 999 }} />
        </div>

        {chapters.map(chapter => (
          <div
            key={chapter.id}
            className={`${styles.chapter} ${openChapter.includes(chapter.id) ? styles.open : ""}`}
          >
            <p
              className={styles["chapter-title"]}
              onClick={() => toggleChapter(chapter.id)}
            >
              {chapter.title}
              <span className={styles.arrow}>&#9662;</span>
            </p>
            {openChapter.includes(chapter.id) && (
              <ol className={styles["chapter-list"]}>
                {chapter.subtopics.map(subtopic => {
                  const isDone = completedIds.includes(subtopic.id);
                  return (
                    <li
                      key={subtopic.id}
                      className={`${styles.topic} ${currentTopic?.subtopic?.id === subtopic.id ? styles.active : ""
                        } ${isDone ? styles.done : ""}`}
                      onClick={() => handleTopicClick(subtopic.id, chapter.id)}
                    >
                      {isDone ? "✓ " : ""}{subtopic.title}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ))}
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noreferrer">
            Download PDF
          </a>
        )}
      </div>

      <div className={`${styles.content} ${!sidebarOpen ? styles.contentFull : ""}`}>
        {currentTopic ? (
          <>
            <p className={styles.chapterLabel}>{currentTopic.chapterTitle}</p>
            <h3>{currentTopic.subtopic.title}</h3>
            {contentLoading ? (
              // NEW: spinner while topic content fetches
              <div className={styles.contentLoading}>
                <div className={styles.spinner} />
                <span>Loading content…</span>
              </div>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </>
        ) : (
          <p>Click on a topic to view its content</p>
        )}
        <div className={styles.navButtons}>
          <button
            onClick={() => setCurrentIndex(i => i - 1)}
            disabled={currentIndex === 0}
          >
            Back
          </button>
          <button
            onClick={() => {
              markComplete();
              setCurrentIndex(i => i + 1);
            }}
            disabled={currentIndex === allTopics.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseViewer;