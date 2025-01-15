// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InfoModal from "@/components/InfoModal";
import VerseModal from "@/components/VerseModal";

export default function Home() {
  const [bibleData, setBibleData] = useState([]);
  const [books, setBooks] = useState([]);

  const [selectedBook, setSelectedBook] = useState("gn"); // Default: Genesis
  const [selectedChapter, setSelectedChapter] = useState(1); // Default: 1st
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Initial data fetch
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/books.json");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchBibleData = async () => {
      try {
        const res = await fetch("/en_bbe.json");
        const data = await res.json();
        setBibleData(data);
      } catch (error) {
        console.error("Error fetching Bible data:", error);
      }
    };

    fetchBooks();
    fetchBibleData();
  }, []);

  // Sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    document.body.style.overflow = sidebarOpen ? "auto" : "hidden";
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleSidebarClick = (event) => {
    if (
      event.target.closest("#book-select-container") ||
      event.target.closest("#chapter-select-container")
    ) {
      event.stopPropagation();
      return;
    }
    closeSidebar();
  };

  // Book/Chapter selection handlers
  const handleBookChange = (e) => {
    const newBook = e.target.value;
    setSelectedBook(newBook);
    setSelectedChapter(1); 

    // When the book changes, reset the verseIndex to 0
    setCurrentVerseIndex(0);
  };

  const handleChapterChange = (e) => {
    const newChapter = parseInt(e.target.value, 10);
    setSelectedChapter(newChapter);

    // When the chapter changes, reset the verseIndex to 0
    setCurrentVerseIndex(0);
  };

  // Handler for clicking on a verse
  const handleVerseClick = (index) => {
    // Setting the verseIndex
    setCurrentVerseIndex(index);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <button className="menu-button" onClick={toggleSidebar}>
          ☰
        </button>
        <h1
          style={{ fontSize: "1.2rem", marginLeft: "10px", cursor: "pointer" }}
          onClick={() => setInfoModalOpen(true)}
        >
          Sacred Compass
        </h1>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={handleSidebarClick}
            >
              <h2>Choose a Book and Chapter</h2>

              <div id="book-select-container">
                <label htmlFor="book-select">
                  <span className="label-text">Book:</span>
                  <select
                    id="book-select"
                    value={selectedBook}
                    onChange={handleBookChange}
                  >
                    {books.map((book) => (
                      <option key={book.abbrev} value={book.abbrev}>
                        {book.name} ({book.testament})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div id="chapter-select-container">
                <label htmlFor="chapter-select">
                  <span className="label-text">Chapter:</span>
                  <select
                    id="chapter-select"
                    value={selectedChapter}
                    onChange={handleChapterChange}
                  >
                    {Array.from(
                      {
                        length:
                          books.find((b) => b.abbrev === selectedBook)
                            ?.chapters || 0,
                      },
                      (_, i) => i + 1
                    ).map((chapter) => (
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="container">
        <h2>
          {books.find((book) => book.abbrev === selectedBook)?.name} Chapter{" "}
          {selectedChapter}
        </h2>
        <div>
          {bibleData
            .find((b) => b.abbrev === selectedBook)
            ?.chapters[selectedChapter - 1]?.map((verse, idx) => (
              <motion.p
                key={idx}
                onClick={() => handleVerseClick(idx)}
                whileHover={{ scale: 1.03 }}
                style={{ cursor: "pointer" }}
              >
                <strong>{idx + 1}.</strong> {verse}
              </motion.p>
            ))}
        </div>
      </div>

      {/* Modal for expanding verse */}
      <VerseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        abbrev={selectedBook}
        chapter={selectedChapter}
        verseIndex={currentVerseIndex}
      />

      {/* Info Modal */}
      <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </div>
  );
}
