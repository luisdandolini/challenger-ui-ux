import { useState, useEffect, useRef } from "react";
import type { Room, RoomQuestion, Player } from "../../../lib/types";

interface Props {
  room: Room;
  player: Player;
  question: RoomQuestion | null;
  players: Player[];
  answered: boolean;
  streak: number;
  onAnswer: (optionIndex: number) => void;
  onLeave: () => void;
}

const NIVEL_COLOR = { facil: "#4ade80", medio: "#fbbf24", dificil: "#f87171" };
const NIVEL_LABEL = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
const QUESTION_TIME = 30;

export default function PlayerRoom({
  room,
  player,
  question,
  players,
  answered,
  streak,
  onAnswer,
  onLeave,
}: Props) {
  const duration = room.questionDuration ?? QUESTION_TIME;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selected, setSelected] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question?.id]);

  useEffect(() => {
    if (room.status !== "question" || answered || !room.questionStartedAt) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const tick = () => {
      const elapsed = (Date.now() - room.questionStartedAt!) / 1000;
      const left = Math.max(0, duration - Math.floor(elapsed));
      setTimeLeft(left);
      if (left <= 0 && timerRef.current) clearInterval(timerRef.current);
    };
    tick();
    timerRef.current = setInterval(tick, 500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [room.status, room.questionStartedAt, answered, duration]);

  const handleAnswer = (optionIndex: number) => {
    if (answered || selected !== null) return;
    setSelected(optionIndex);
    onAnswer(optionIndex);
  };

  const myRank =
    players.findIndex((currentPlayer) => currentPlayer.id === player.id) + 1;

  if (room.status === "waiting") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6 animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-streak">⏳</div>
          <h2 className="text-xl font-bold mb-1">Aguardando o professor...</h2>
          <p className="text-muted text-sm">A partida vai começar em breve</p>
        </div>

        <div className="bg-surface border border-primary/40 rounded-xl px-8 py-4 text-center">
          <p className="text-xs text-muted mb-1">Você entrou como</p>
          <p className="font-bold text-lg text-primary">{player.name}</p>
        </div>

        {players.length > 0 && (
          <div className="w-full max-w-sm bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex justify-between items-center">
              <span className="text-xs font-bold text-muted uppercase tracking-wide">
                Na sala
              </span>
              <span className="text-xs font-bold text-primary">
                {players.length}
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {players.map((roomPlayer) => (
                <div
                  key={roomPlayer.id}
                  className={`flex items-center gap-3 px-5 py-2.5 border-b border-border last:border-0
                    ${roomPlayer.id === player.id ? "bg-primary/10" : ""}`}
                >
                  <div className="w-7 h-7 rounded-full bg-surface2 flex items-center justify-center text-xs font-bold">
                    {roomPlayer.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {roomPlayer.name}
                    {roomPlayer.id === player.id && (
                      <span className="text-primary text-xs ml-1.5">
                        (você)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (room.status === "question" && question) {
    const timerClass =
      timeLeft > 10
        ? "text-primary"
        : timeLeft > 5
          ? "text-warning"
          : "text-danger";
    const optionClass = (optionIndex: number) => {
      const base =
        "w-full px-5 py-4 rounded-lg text-sm font-medium text-left border-[1.5px] transition-all";
      if (answered || selected !== null) {
        if (optionIndex === question.resposta)
          return `${base} bg-success/10 border-success text-success`;
        if (optionIndex === selected)
          return `${base} bg-danger/10 border-danger text-danger`;
        return `${base} bg-surface2 border-border text-muted opacity-50`;
      }
      return `${base} bg-surface2 border-border text-white hover:border-primary/50 cursor-pointer`;
    };

    return (
      <div className="min-h-screen flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted">{player.name}</span>
          <div className="flex items-center gap-4">
            {streak >= 3 && (
              <span className="text-sm font-bold text-warning animate-streak">
                🔥 ×{streak}
              </span>
            )}
            <span className="text-sm font-bold text-primary">
              {player.xp} XP
            </span>
          </div>
        </div>

        <div className="h-1 bg-surface2 rounded-full mb-6">
          <div
            className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all"
            style={{
              width: `${((room.currentQuestion + 1) / room.totalQuestions) * 100}%`,
            }}
          />
        </div>

        <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto gap-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: NIVEL_COLOR[question.nivel] + "20",
                color: NIVEL_COLOR[question.nivel],
              }}
            >
              {NIVEL_LABEL[question.nivel]}
            </span>
            <span className={`text-sm font-bold ${timerClass}`}>
              ⏱ {timeLeft}s
            </span>
          </div>

          <div className="bg-surface border border-border rounded-xl px-6 py-7">
            <p className="text-[11px] text-muted mb-2">
              Pergunta {room.currentQuestion + 1} de {room.totalQuestions}
            </p>
            <p className="text-lg font-semibold leading-relaxed">
              {question.pergunta}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {question.opcoes.map((option, optionIndex) => (
              <button
                key={optionIndex}
                className={optionClass(optionIndex)}
                onClick={() => handleAnswer(optionIndex)}
              >
                <span className="text-muted mr-2 text-xs">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          {(answered || selected !== null) && question.explicacao && (
            <div className="px-5 py-4 bg-primary/5 border border-primary/40 rounded-lg text-sm animate-fade-in">
              💡 {question.explicacao}
            </div>
          )}

          {(answered || selected !== null) && (
            <div className="text-center text-sm font-bold animate-pop">
              {selected === question.resposta ? (
                <span className="text-success">Correto! ✓</span>
              ) : (
                <span className="text-danger">Errou!</span>
              )}
              <span className="text-muted ml-2">Aguardando o professor...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (room.status === "ranking" || room.status === "finished") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6 animate-fade-in">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pop">
            {room.status === "finished" ? "🏆" : "📊"}
          </div>
          <h2 className="text-xl font-bold mb-1">
            {room.status === "finished"
              ? "Resultado final!"
              : `Ranking — Rodada ${room.currentQuestion + 1}`}
          </h2>
          {myRank > 0 && (
            <p className="text-muted text-sm">
              Você está em{" "}
              <span className="text-primary font-bold">#{myRank}</span>
            </p>
          )}
        </div>

        <div className="w-full max-w-sm bg-surface border border-border rounded-xl overflow-hidden">
          {players.slice(0, 10).map((roomPlayer, index) => (
            <div
              key={roomPlayer.id}
              className={`flex items-center gap-3 px-6 py-3 border-b border-border last:border-0
                ${roomPlayer.id === player.id ? "bg-primary/10" : index === 0 ? "bg-primary/5" : ""}`}
            >
              <span className="w-6 text-center text-sm font-bold text-muted">
                {index === 0
                  ? "🥇"
                  : index === 1
                    ? "🥈"
                    : index === 2
                      ? "🥉"
                      : `${index + 1}º`}
              </span>
              <span className="flex-1 font-semibold text-sm">
                {roomPlayer.name}{" "}
                {roomPlayer.id === player.id && (
                  <span className="text-primary text-xs">(você)</span>
                )}
              </span>
              <span className="text-xs font-bold text-primary">
                {roomPlayer.xp} XP
              </span>
            </div>
          ))}
        </div>

        {room.status === "ranking" && (
          <p className="text-muted text-sm">Aguardando o professor...</p>
        )}
        {room.status === "finished" && (
          <button
            onClick={onLeave}
            className="px-6 py-3 bg-surface border border-border rounded-lg text-sm font-semibold
              hover:border-primary transition-all"
          >
            Sair da sala
          </button>
        )}
      </div>
    );
  }

  return null;
}
