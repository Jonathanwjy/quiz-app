import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Dashboard({ handleQuizStart, quizState }) {
  const navigate = useNavigate();
  const [hasUnfinishedQuiz, setHasUnfinishedQuiz] = useState(false);

  useEffect(() => {
    // Cek apakah ada quiz yang belum selesai
    const savedQuiz = localStorage.getItem("quizState");
    if (savedQuiz) {
      try {
        const parsed = JSON.parse(savedQuiz);
        if (parsed.timeLeft > 0) {
          setHasUnfinishedQuiz(true);
        } else {
          localStorage.removeItem("quizState");
        }
      } catch (error) {
        localStorage.removeItem("quizState");
      }
    }
  }, []);

  const onStart = () => {
    if (typeof handleQuizStart === "function") {
      handleQuizStart();
    } else {
      navigate("/kuis", { state: { checkResume: true } });
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang</h1>
        <h1 className="text-xl mb-4">
          Akan ada 10 soal yang dikerjakan dalam waktu 5 menit
        </h1>
        <p className="mb-8">Sudah siap untuk mengikuti kuis?</p>
        <Button onClick={onStart}>
          {hasUnfinishedQuiz ? "Lanjutkan Kuis" : "Mulai Kuis"}
        </Button>
      </div>
    </>
  );
}
