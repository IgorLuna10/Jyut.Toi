import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { speechEngine } from '@/services/speechEngine';
import themesData from '@shared/themes.json';

export default function StationExam({
  level,
  isDark = false,
  onPassExam,
  onCancel,
}) {
  const theme = themesData.themes[level.themeId] || themesData.themes.red;
  const modeKey = isDark ? 'night' : 'light';
  const mode = theme[modeKey];

  const questions = level.exam || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sentenceTokens, setSentenceTokens] = useState([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSentenceToken = (word) => {
    if (isAnswerChecked) return;
    if (sentenceTokens.includes(word)) {
      setSentenceTokens(sentenceTokens.filter((w) => w !== word));
    } else {
      setSentenceTokens([...sentenceTokens, word]);
    }
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked || !currentQ) return;

    let correct = false;
    if (currentQ.type === 'sentence') {
      correct = JSON.stringify(sentenceTokens) === JSON.stringify(currentQ.target);
    } else {
      correct = selectedAnswer === currentQ.correctIndex;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    if (correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setSentenceTokens([]);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setExamFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setSentenceTokens([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setScore(0);
    setExamFinished(false);
  };

  const playSound = (text) => {
    if (text) speechEngine.speak(text);
  };

  const passThreshold = Math.ceil(questions.length * 0.66); // At least 2 of 3
  const hasPassed = score >= passThreshold;

  if (examFinished) {
    return (
      <div className="p-6 rounded-3xl bg-slate-900/95 border border-white/10 text-center text-white backdrop-blur-md shadow-2xl space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-lg"
          style={{ backgroundColor: hasPassed ? mode.accent : '#EF4444' }}
        >
          {hasPassed ? '🎉' : '⚠️'}
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
            STATION CHECKPOINT RESULTS
          </span>
          <h3 className="text-2xl font-serif font-black text-white">
            {hasPassed ? 'Station Exam Cleared!' : 'Need More Practice'}
          </h3>
          <p className="text-xs text-zinc-300 mt-1">
            Score: {score} / {questions.length} questions correct
          </p>
        </div>

        {hasPassed ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
              <p className="font-bold flex items-center justify-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Next Station Unlocked! (+100 XP)</span>
              </p>
              <p className="text-[11px] text-zinc-300">
                You've mastered this station's tone patterns and essential vocabulary.
              </p>
            </div>

            <button
              onClick={() => onPassExam(level.level)}
              className="w-full py-3 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl hover:brightness-110 active:scale-98 transition-all"
              style={{ backgroundColor: mode.accent }}
            >
              <span>Board Train to Next Station</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400">
              You need at least {passThreshold} correct answers to pass the station exam.
            </p>
            <button
              onClick={handleRestart}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Exam</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-2xl text-white space-y-4">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
          style={{
            backgroundColor: mode.badgeBg,
            color: mode.badgeText,
            border: `1px solid ${mode.badgeBorder}`,
          }}
        >
          Station {level.level} Exam · Q{currentIdx + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentIdx + 1) / questions.length) * 100}%`,
            backgroundColor: mode.accent,
          }}
        />
      </div>

      {/* Question Prompt */}
      <div className="pt-2 text-center">
        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
          {currentQ.question}
        </h4>
        {currentQ.audioText && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => playSound(currentQ.audioText)}
              className="px-4 py-2 rounded-full font-semibold text-xs text-white flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95"
              style={{ backgroundColor: mode.accent }}
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen Prompt</span>
            </button>
          </div>
        )}
      </div>

      {/* Multiple Choice Options */}
      {currentQ.type !== 'sentence' && (
        <div className="space-y-2 pt-2">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-zinc-100';

            if (selectedAnswer === idx) {
              btnStyle = 'bg-brand-600/30 border-brand-500 text-white';
            }

            if (isAnswerChecked) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-600/80 border-emerald-400 text-white';
              } else if (selectedAnswer === idx) {
                btnStyle = 'bg-rose-600/80 border-rose-400 text-white';
              } else {
                btnStyle = 'opacity-40 bg-slate-800 border-slate-800 text-zinc-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswerChecked}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswerChecked && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                )}
                {isAnswerChecked && selectedAnswer === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-300" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Sentence Scramble Assemble Area */}
      {currentQ.type === 'sentence' && (
        <div className="space-y-3 pt-2">
          <div className="min-h-[56px] p-2.5 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex flex-wrap gap-2 items-center justify-center">
            {sentenceTokens.length === 0 ? (
              <span className="text-[11px] text-zinc-500 italic">Tap words below to arrange sentence</span>
            ) : (
              sentenceTokens.map((token, i) => (
                <button
                  key={i}
                  disabled={isAnswerChecked}
                  onClick={() => handleSentenceToken(token)}
                  className="px-3 py-1.5 rounded-xl font-serif font-bold text-xs text-white shadow-sm"
                  style={{ backgroundColor: mode.accent }}
                >
                  {token} ✕
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {currentQ.pool.map((word, i) => {
              const isUsed = sentenceTokens.includes(word);
              return (
                <button
                  key={i}
                  disabled={isUsed || isAnswerChecked}
                  onClick={() => handleSentenceToken(word)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-serif font-semibold transition-all ${
                    isUsed
                      ? 'opacity-30 bg-slate-800 border-slate-800 text-zinc-500'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white shadow-sm'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action / Next Button */}
      <div className="pt-2">
        {!isAnswerChecked ? (
          <button
            disabled={
              currentQ.type === 'sentence'
                ? sentenceTokens.length === 0
                : selectedAnswer === null
            }
            onClick={handleCheckAnswer}
            className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md disabled:opacity-40 hover:brightness-110 transition-all"
            style={{ backgroundColor: mode.accent }}
          >
            Check Answer
          </button>
        ) : (
          <div className="space-y-2">
            <div
              className={`p-2.5 rounded-xl text-center text-xs border ${
                isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-500 text-rose-200'
              }`}
            >
              {isCorrect ? '✓ Correct!' : '❌ Not quite right!'}
            </div>
            <button
              onClick={handleNextQuestion}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
            >
              {currentIdx + 1 < questions.length ? 'Next Question →' : 'View Exam Results →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
