import type { Quiz } from "../../../lib/types";

interface Props {
  quizzes: Quiz[];
  loading: boolean;
  adminEmail: string;
  onStartRoom: (quiz: Quiz) => void;
  onCreateQuiz: () => void;
  onEditQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onLogout: () => void;
}

const NIVEL_LABEL = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
const NIVEL_COLOR = { facil: "#4ade80", medio: "#fbbf24", dificil: "#f87171" };

export default function QuizList({
  quizzes,
  loading,
  adminEmail,
  onStartRoom,
  onCreateQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onLogout,
}: Props) {
  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
            Meus Quizzes
          </h1>
          <p className="text-muted text-xs mt-1">{adminEmail}</p>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-muted hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>

      <button
        onClick={onCreateQuiz}
        className="w-full py-3.5 mb-6 bg-linear-to-r from-primary to-violet-400 text-white font-bold
          rounded-xl hover:opacity-85 active:scale-95 transition-all"
      >
        + Criar novo quiz
      </button>

      {loading && quizzes.length > 0 && (
        <p className="text-center text-muted text-sm py-8">Carregando...</p>
      )}

      {!loading && quizzes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-muted text-sm">Nenhum quiz ainda.</p>
          <p className="text-muted text-xs mt-1">
            Crie seu primeiro quiz para começar.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {quizzes.map((quiz) => {
          const nivelCounts = quiz.questions.reduce(
            (acc, question) => {
              acc[question.nivel]++;
              return acc;
            },
            { facil: 0, medio: 0, dificil: 0 },
          );
          return (
            <div
              key={quiz.id}
              className="bg-surface border border-border rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-bold text-base">{quiz.title}</h2>
                  <p className="text-muted text-xs mt-0.5">
                    {quiz.questions.length} pergunta
                    {quiz.questions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditQuiz(quiz)}
                    className="text-xs text-muted hover:text-white px-2 py-1 rounded transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteQuiz(quiz.id)}
                    className="text-xs text-danger hover:opacity-70 px-2 py-1 rounded transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {(["facil", "medio", "dificil"] as const).map(
                  (nivel) =>
                    nivelCounts[nivel] > 0 && (
                      <span
                        key={nivel}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: NIVEL_COLOR[nivel] + "20",
                          color: NIVEL_COLOR[nivel],
                        }}
                      >
                        {nivelCounts[nivel]} {NIVEL_LABEL[nivel]}
                      </span>
                    ),
                )}
              </div>

              <button
                onClick={() => onStartRoom(quiz)}
                className="w-full py-2.5 bg-linear-to-r from-success to-emerald-400 text-black font-bold
                  rounded-lg text-sm hover:opacity-85 active:scale-95 transition-all"
              >
                Iniciar sala →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
