import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "../styles/courses.module.css";

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
  const [completedIds, setCompletedIds] = useState([]);

  const userId = 1; // replace with real user from auth context later

  //fetch courses chapter and subtopics
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

  // fetch which subtopics are already completed
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

  useEffect(() => {
    if (!currentTopic) return;

    if (!currentTopic.subtopic.content_url) {
      setContent("_Content not available yet._");
      return;
    }

    setContent("");

    fetch(currentTopic.subtopic.content_url)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.text();
      })
      .then(text => setContent(text))
      .catch(err => {
        console.error("Failed to fetch content:", err);
        setContent("_Content not available yet._");
      });

  }, [currentTopic]);

  function handleTopicClick(subtopicId, chapterId) {
    const index = allTopics.findIndex(
      t => t.subtopic.id === subtopicId && t.chapterId === chapterId
    );
    setCurrentIndex(index);
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

    if (completedIds.includes(subtopicId)) return; // already done

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

  if (loading) return <p>Loading...</p>;

  const totalTopics = allTopics.length;
  const doneCount = allTopics.filter(t => completedIds.includes(t.subtopic.id)).length;
  const percent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0;
  const isCurrentDone = currentTopic && completedIds.includes(currentTopic.subtopic.id);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
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

      <div className={styles.content}>
        {currentTopic ? (
          <>
            <p className={styles.chapterLabel}>{currentTopic.chapterTitle}</p>
            <h3>{currentTopic.subtopic.title}</h3>
            <ReactMarkdown>{content}</ReactMarkdown>
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