// src/app/components/VerseModal.js
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBible } from "@/libs/bible";

export default function VerseModal({
  isOpen,
  onClose,
  abbrev,
  chapter,
  verseIndex,
}) {
  const [englishBible, setEnglishBible] = useState([]);
  const [koreanBible, setKoreanBible] = useState([]);
  // Mannage the verseIndex received from the parent component as an internal state
  const [currentVerse, setCurrentVerse] = useState(verseIndex);

  useEffect(() => {
    const fetchBibleData = async () => {
      try {
        const englishData = await getBible("eng");
        const koreanData = await getBible("kor");
        setEnglishBible(englishData);
        setKoreanBible(koreanData);
      } catch (error) {
        console.error("Failed to fetch Bible data", error);
      }
    };
    fetchBibleData();
  }, []);

  // Reflect the verseIndex change to the internal state of the modal
  useEffect(() => {
    setCurrentVerse(verseIndex);
  }, [verseIndex]);

  if (!isOpen || !englishBible.length || !koreanBible.length) return null;

  const englishBook = englishBible.find((book) => book.abbrev === abbrev);
  const koreanBook = koreanBible.find((book) => book.abbrev === abbrev);
  const englishVerses = englishBook?.chapters[chapter - 1] || [];
  const koreanVerses = koreanBook?.chapters[chapter - 1] || [];

  const verseCount = englishVerses.length;
  const currentEnglishVerse = englishVerses[currentVerse] || "";
  const currentKoreanVerse = koreanVerses[currentVerse] || "";

  const handleNext = () => {
    if (currentVerse < verseCount - 1) {
      setCurrentVerse((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentVerse > 0) {
      setCurrentVerse((prev) => prev - 1);
    }
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="verse-modal-fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="verse-modal-fullscreen-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={handleContentClick}
          >
            <div className="verse-modal-header">
              <h2>
                {englishBook?.name} {chapter}:{currentVerse + 1}
              </h2>
              <div
                className="close-button"
                onClick={onClose}
                style={{
                  cursor: "pointer",
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Close
              </div>
            </div>

            <div className="verse-modal-body">
              <p className="english-verse">
                <strong>{currentEnglishVerse}</strong>
              </p>
              <p className="korean-verse">{currentKoreanVerse}</p>
            </div>

            <div className="verse-modal-footer">
              <button
                onClick={handlePrev}
                disabled={currentVerse === 0}
                className={currentVerse === 0 ? "disabled" : ""}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentVerse === verseCount - 1}
                className={currentVerse === verseCount - 1 ? "disabled" : ""}
              >
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
