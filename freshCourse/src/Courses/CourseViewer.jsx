import { useState, useEffect, useMemo } from "react";
import styles from "../styles/courses.module.css";
import ReactMarkdown from "react-markdown";

function CourseViewer({courseName ,chapters}) {
  const [openChapter, setOpenChapter] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem(`progress_${courseName}`);
    return saved !== null ? Number(saved) : 0;
});
  const [content, setContent] = useState("");
 
 
  // Save progress to localStorage whenever currentIndex changes
  useEffect(() => {
  localStorage.setItem(`progress_${courseName}`, currentIndex);
  }, [currentIndex]);

  // Flatten all topics with their chapter info for easy access
  const allTopics = useMemo(() => {
    return chapters.flatMap((chapter) =>
      chapter.topics.map((topic) => ({
        topic,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      }))
    );
    
  }, [chapters]);
  // Save total topics count to localStorage for progress calculation
  localStorage.setItem(`total_${courseName}`, allTopics.length);


  const currentTopic = currentIndex !== null ? allTopics[currentIndex] : null;

  // Automatically open chapter when a topic is selected
  useEffect(() => {
    if (currentTopic && !openChapter.includes(currentTopic.chapterId)) {
        setOpenChapter((prev) => [...prev, currentTopic.chapterId]);
    }
    }, [currentTopic]);
    // Load content for the current topic
  useEffect(() => {
    if (!currentTopic) return;

    const filename = currentTopic.topic.trim().replace(/\s+/g, "_");

    fetch(`/courses-data/${courseName}/chapter${currentTopic.chapterId}/${filename}.md`)
    .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
    })
    .then(text => setContent(text))
    .catch(() => setContent("_Content not available yet._"))
 }
), [currentIndex];
 
  // Handle topic click to update current index
  function handleTopicClick(topic, chapterId) {
    const index = allTopics.findIndex(
      (t) => t.topic === topic && t.chapterId === chapterId
    );
    setCurrentIndex(index);
  }
 // Toggle chapter open/close
  function toggleChapter(id) {
    if (openChapter.includes(id))
      setOpenChapter(openChapter.filter((ch) => ch !== id));
    else setOpenChapter([...openChapter, id]);
  }

  return (
    <div className={styles.container}>
      {/* Left panel */}
      <div className={styles.sidebar}>
        <h3>{courseName}</h3>
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`${styles.chapter} ${
              openChapter.includes(chapter.id) ? styles.open : ""
            }`}
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
                {chapter.topics.map((topic) => (
                  <li
                    key={topic}
                    className={`${styles.topic} ${
                      currentTopic?.topic === topic &&
                      currentTopic?.chapterId === chapter.id
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleTopicClick(topic, chapter.id)}
                  >
                    {topic}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
        <a href={`/courses-data/${courseName}/${courseName}.pdf`} download>
          Download PDF
        </a>
      </div>

      {/* Right panel */}
      <div className={styles.content}>
        {currentTopic ? (
          <>
            <p className={styles.chapterLabel}>{currentTopic.chapterTitle}</p>
            <h3>{currentTopic.topic}</h3>
            <ReactMarkdown>{content}</ReactMarkdown>
          </>
        ) : (
          <p>Click on a topic to view its content</p>
        )}

        <div className={styles.navButtons}>
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === null || currentIndex === 0}
          >
            Back
          </button>
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={
              currentIndex === null || currentIndex === allTopics.length - 1
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseViewer;