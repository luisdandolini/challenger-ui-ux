import { useState, useEffect, useRef, useCallback } from "react";
import { roomService } from "../../../lib/services/roomService";
import { playerService } from "../../../lib/services/playerService";
import type { Room, RoomQuestion, Player } from "../../../lib/types";

const PLAYER_KEY = "room_player";

export function useRoom() {
  const [room, setRoom] = useState<Room | null>(null);
  const [player, setPlayer] = useState<Player | null>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(PLAYER_KEY) ?? "null");
    } catch {
      return null;
    }
  });
  const [question, setQuestion] = useState<RoomQuestion | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answered, setAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState("");
  const questionStartRef = useRef<number>(0);

  const subscribeToRoom = useCallback((roomId: string) => {
    const unsubRoom = roomService.subscribeToRoom(roomId, setRoom);
    const unsubPlayers = roomService.subscribeToPlayers(roomId, setPlayers);
    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, []);

  useEffect(() => {
    if (!room || room.status !== "question") return;
    roomService
      .getQuestionByOrder(room.id, room.currentQuestion)
      .then((fetched) => {
        if (fetched) {
          setQuestion(fetched);
          setAnswered(false);
          questionStartRef.current = Date.now();
        }
      });
  }, [room?.status, room?.currentQuestion]);

  const joinRoom = useCallback(
    async (code: string, name: string): Promise<string | null> => {
      setError("");
      const foundRoom = await roomService.findByCode(code);
      if (!foundRoom) {
        setError("Sala não encontrada");
        return null;
      }
      if (foundRoom.status === "finished") {
        setError("Esta sala já foi encerrada");
        return null;
      }

      const newPlayer = await playerService.join(foundRoom.id, name);
      sessionStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
      setPlayer(newPlayer);
      return foundRoom.id;
    },
    [],
  );

  const submitAnswer = useCallback(
    async (optionIndex: number) => {
      if (!room || !player || !question || answered) return;
      setAnswered(true);

      const timeMs = Date.now() - questionStartRef.current;
      const { xpGained, newStreak } = await playerService.submitAnswer({
        roomId: room.id,
        player,
        question,
        optionIndex,
        streak,
        timeMs,
      });

      setStreak(newStreak);

      if (xpGained > 0) {
        setPlayer((currentPlayer) => {
          const updated = currentPlayer
            ? { ...currentPlayer, xp: currentPlayer.xp + xpGained }
            : currentPlayer;
          if (updated)
            sessionStorage.setItem(PLAYER_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    },
    [room, player, question, answered, streak],
  );

  const clearPlayer = useCallback(() => {
    sessionStorage.removeItem(PLAYER_KEY);
    setPlayer(null);
    setRoom(null);
  }, []);

  return {
    room,
    player,
    question,
    players,
    answered,
    streak,
    error,
    joinRoom,
    subscribeToRoom,
    submitAnswer,
    clearPlayer,
  };
}
