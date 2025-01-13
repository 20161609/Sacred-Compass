"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoModal({ isOpen, onClose }) {
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
          className="info-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="info-modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={handleContentClick}
          >
            <div className="info-modal-header">
              <h2>Sacred Compass Info</h2>
              <button className="close-button" onClick={onClose}>
                ✕
              </button>
            </div>
            <div className="info-modal-body">
              <p>
                <strong>Description:</strong> Sacred Compass is a simple Bible reading app that provides English and Korean translations for intuitive reading and study.
              </p>
              <p>
                <strong>Developer:</strong> An Hojun
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:pockguy96@gmail.com">pockguy96@gmail.com</a>
              </p>
              <p>
                <strong>Bible Data Source:</strong> The Bible data is sourced from{" "}
                <a
                  href="https://github.com/thiagobodruk/bible"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Thiago Bodruk's GitHub Repository
                </a>
                .
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
