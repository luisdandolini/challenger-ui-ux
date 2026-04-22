import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type {
  Room,
  RoomQuestion,
  Player,
  PlayerAnswer,
} from "../../../lib/types";

const XP_TABLE = { facil: 10, medio: 20, dificil: 35 } as const;
const SPEED_BONUS = 8;
const STREAK_THRESHOLD = 3;
const STREAK_MULTIPLIER = 1.5;
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
    const unsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
      if (snap.exists()) setRoom({ id: snap.id, ...snap.data() } as Room);
    });
    const unsubPlayers = onSnapshot(
      query(collection(db, "rooms", roomId, "players"), orderBy("xp", "desc")),
      (snap) =>
        setPlayers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Player)),
    );
    return () => {
      unsub();
      unsubPlayers();
    };
  }, []);

  useEffect(() => {
    if (!room || room.status !== "question") return;
    const fetch = async () => {
      const snap = await getDocs(
        query(
          collection(db, "rooms", room.id, "questions"),
          where("order", "==", room.currentQuestion),
        ),
      );
      if (!snap.empty) {
        setQuestion({
          id: snap.docs[0].id,
          ...snap.docs[0].data(),
        } as RoomQuestion);
        setAnswered(false);
        questionStartRef.current = Date.now();
      }
    };
    fetch();
  }, [room?.status, room?.currentQuestion]);

  const joinRoom = useCallback(
    async (code: string, name: string): Promise<string | null> => {
      setError("");
      const snap = await getDocs(
        query(collection(db, "rooms"), where("code", "==", code.toUpperCase())),
      );
      if (snap.empty) {
        setError("Sala não encontrada");
        return null;
      }
      const roomDoc = snap.docs[0];
      const roomData = { id: roomDoc.id, ...roomDoc.data() } as Room;
      if (roomData.status === "finished") {
        setError("Esta sala já foi encerrada");
        return null;
      }

      const playerId = `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
      const playerData: Omit<Player, "id"> = {
        name,
        xp: 0,
        joinedAt: Date.now(),
      };

      await setDoc(
        doc(db, "rooms", roomDoc.id, "players", playerId),
        playerData,
      );

      const newPlayer = { id: playerId, ...playerData };
      sessionStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
      setPlayer(newPlayer);
      return roomDoc.id;
    },
    [],
  );

  const submitAnswer = useCallback(
    async (optionIndex: number) => {
      if (!room || !player || !question || answered) return;
      setAnswered(true);

      const timeMs = Date.now() - questionStartRef.current;
      const correct = optionIndex === question.resposta;
      const newStreak = correct ? streak + 1 : 0;
      setStreak(newStreak);

      let xpGained = 0;
      if (correct) {
        xpGained = XP_TABLE[question.nivel];
        if (timeMs <= 5000) xpGained += SPEED_BONUS;
        if (newStreak >= STREAK_THRESHOLD)
          xpGained = Math.round(xpGained * STREAK_MULTIPLIER);
      }

      const answerData: PlayerAnswer = {
        playerId: player.id,
        playerName: player.name,
        questionIndex: question.order,
        answer: optionIndex,
        correct,
        xpGained,
        timeMs,
      };

      await setDoc(
        doc(db, "rooms", room.id, "answers", `${player.id}_q${question.order}`),
        answerData,
      );

      if (xpGained > 0) {
        await updateDoc(doc(db, "rooms", room.id, "players", player.id), {
          xp: (player.xp ?? 0) + xpGained,
        });
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
