// src/components/QuoteSection.js

import React from 'react';
import './QuoteSection.css';  // Import QuoteSection-specific styles

const QuoteSection = () => {
  return (
    <div className="quote-section">
      <blockquote>
        "A room without books is like a body without a soul."
        <footer>- Marcus Tullius Cicero</footer>
      </blockquote>
    </div>
  );
};

export default QuoteSection;
