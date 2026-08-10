// src/utils/splitCode.js

export const splitCodeIntoSlides = (code, linesPerSlide) => {
  if (!code) return [];
  
  const lines = code.split('\n');
  const slides = [];
  
  for (let i = 0; i < lines.length; i += linesPerSlide) {
    // Join the chunk of lines back together into a single string
    slides.push(lines.slice(i, i + linesPerSlide).join('\n'));
  }
  
  return slides;
};