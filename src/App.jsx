import React, { useState, useEffect } from 'react';

const quizData = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    answer: 'Paris'
  },
  {
    question: 'Which language runs in a web browser?',
    options: ['Java', 'C', 'Python', 'JavaScript'],
    answer: 'JavaScript'
  },
  {
    question: 'What does CSS stand for?',
    options: [
      'Central Style Sheets',
      'Cascading Style Sheets',
      'Cascading Simple Sheets',
      'Cars SUVs Sailboats'
    ],
    answer: 'Cascading Style Sheets'
  }
];

const QuizApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [results, setResults] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || selected || showResults) return;
    if (timeLeft === 0) {
      handleSkip();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected, showResults, started]);

  const handleAnswer = (option) => {
    if (selected) return;
    const correct = quizData[currentIndex].answer;
    setSelected(option);
    const isCorrect = option === correct;
    if (isCorrect) setScore((prev) => prev + 1);
    else setScore((prev) => prev - 1);
    setResults((prev) => [...prev, { question: quizData[currentIndex].question, selected: option, correct }]);
    setTimeout(() => {
      if (currentIndex + 1 < quizData.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
        setTimeLeft(60);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleSkip = () => {
    setScore((prev) => prev - 1);
    setResults((prev) => [...prev, { question: quizData[currentIndex].question, selected: 'Skipped', correct: quizData[currentIndex].answer }]);
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(60);
      setSelected(null);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setShowResults(false);
    setTimeLeft(60);
    setResults([]);
    setStarted(false);
  };

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60);
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="quiz-container">
      {!started ? (
        <div className="start-screen">
          <h2>Welcome to the Quiz!</h2>
          <p>You will be presented with multiple-choice questions. Answer each one within 60 seconds.</p>
          <button onClick={handleStart}>Start Quiz</button>
        </div>
      ) : !showResults ? (
        <>
          <h2>Question {currentIndex + 1}</h2>
          <div className="timer">Time Left: {timeLeft}s</div>
          <div className="question-card">
            <h3>{quizData[currentIndex].question}</h3>
            <div className="options">
              {quizData[currentIndex].options.map((option) => (
                <button
                  key={option}
                  className={`option ${selected && (option === quizData[currentIndex].answer ? 'correct' : option === selected ? 'incorrect' : '')}`}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selected}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2>Quiz Complete!</h2>
          <p>Your final score: {score}</p>
          <ul>
            {results.map((result, idx) => (
              <li key={idx}>
                <strong>{result.question}</strong><br />
                Your Answer: <span className={result.selected === result.correct ? 'correct' : 'incorrect'}>{result.selected}</span><br />
                Correct Answer: <span className="correct">{result.correct}</span>
              </li>
            ))}
          </ul>
          <button onClick={handleRestart}>Restart Quiz</button>
        </>
      )}
    </div>
  );
};

export default QuizApp;
