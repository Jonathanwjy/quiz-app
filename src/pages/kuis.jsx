import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "./dashboard";

export default function Kuis() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit dalam detik
  const [userAnswers, setUserAnswers] = useState([]); // Simpan jawaban user
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [hasUnfinishedQuiz, setHasUnfinishedQuiz] = useState(false);

  const token = localStorage.getItem("token");

  // Load saved quiz state saat component mount
  useEffect(() => {
    const savedQuiz = localStorage.getItem("quizState");
    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz);
      // Cek apakah quiz masih valid (tidak expired)
      if (parsed.timeLeft > 0) {
        setHasUnfinishedQuiz(true);
      } else {
        // Hapus quiz yang sudah expired
        localStorage.removeItem("quizState");
      }
    }
  }, []);

  // Save quiz state ke localStorage setiap ada perubahan
  useEffect(() => {
    if (isQuizStarted && !isQuizFinished) {
      const quizState = {
        questions,
        currentIndex,
        timeLeft,
        userAnswers,
        timestamp: Date.now(),
      };
      localStorage.setItem("quizState", JSON.stringify(quizState));
    }
  }, [
    questions,
    currentIndex,
    timeLeft,
    userAnswers,
    isQuizStarted,
    isQuizFinished,
  ]);

  // Timer countdown
  useEffect(() => {
    if (isQuizStarted && !isQuizFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    // Waktu habis
    if (timeLeft === 0 && isQuizStarted) {
      finishQuiz();
    }
  }, [isQuizStarted, timeLeft, isQuizFinished]);

  const startQuiz = async () => {
    const url = `https://opentdb.com/api.php?amount=10&token=${token}&encode=base64`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.response_code === 0) {
        const decodedQuestions = data.results.map((q) => ({
          ...q,
          question: atob(q.question),
          correct_answer: atob(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map((ans) => atob(ans)),
          all_answers: [
            ...q.incorrect_answers.map((ans) => atob(ans)),
            atob(q.correct_answer),
          ].sort(() => Math.random() - 0.5),
        }));

        setQuestions(decodedQuestions);
        setUserAnswers(new Array(decodedQuestions.length).fill(null));
        setIsQuizStarted(true);
        setHasUnfinishedQuiz(false);
      }
    } catch (error) {
      console.error("Gagal mengambil soal", error);
    }
  };

  const resumeQuiz = () => {
    const savedQuiz = localStorage.getItem("quizState");
    if (savedQuiz) {
      const parsed = JSON.parse(savedQuiz);
      setQuestions(parsed.questions);
      setCurrentIndex(parsed.currentIndex);
      setTimeLeft(parsed.timeLeft);
      setUserAnswers(parsed.userAnswers);
      setIsQuizStarted(true);
      setHasUnfinishedQuiz(false);
    }
  };

  const location = useLocation();
  useEffect(() => {
    if (location && location.state && location.state.start) {
      startQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleAnswer = (answer) => {
    // Simpan jawaban user
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answer;
    setUserAnswers(newAnswers);

    // Pindah soal atau selesai
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    // Hapus saved state saat quiz selesai
    localStorage.removeItem("quizState");
  };

  // Format waktu (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Hitung skor
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const currentQuestion = questions[currentIndex];

  // Tampilan resume quiz
  if (hasUnfinishedQuiz) {
    return (
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Kuis Belum Selesai! 📝</h1>
        <p className="mb-6 text-gray-600 text-center max-w-md">
          Anda memiliki kuis yang belum diselesaikan. Apakah Anda ingin
          melanjutkan atau memulai kuis baru?
        </p>
        <div className="flex gap-4">
          <Button onClick={resumeQuiz} className="px-8">
            Lanjutkan Kuis
          </Button>
        </div>
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div>
        <Dashboard handleQuizStart={startQuiz} />
      </div>
    );
  }

  if (isQuizFinished) {
    const score = calculateScore();
    return (
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Kuis Selesai!</h1>
        <div className="text-6xl font-bold text-blue-600 mb-4">
          {score}/{questions.length}
        </div>
        <p className="text-xl text-gray-600 mb-8">
          Anda menjawab {score} soal dengan benar
        </p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center flex-col p-6 text-center">
        {/* Timer */}
        <div
          className={`mb-4 text-3xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-gray-700"}`}
        >
          ⏱️ {formatTime(timeLeft)}
        </div>

        {/* Tracker: Soal yang dikerjakan vs Total Soal */}
        <div className="mb-4 text-sm font-semibold text-blue-600">
          SOAL {currentIndex + 1} DARI {questions.length}
        </div>

        <h2 className="text-2xl font-semibold mb-6 max-w-2xl">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 gap-3 text-white w-full max-w-md">
          {currentQuestion.all_answers.map((ans, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswer(ans)}
              className="py-6 text-lg"
            >
              {ans}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
