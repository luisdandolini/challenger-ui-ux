import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { roomService } from "../../../lib/services/roomService";
import type {
  Room,
  RoomQuestion,
  Player,
  PlayerAnswer,
} from "../../../lib/types";

const ROOM_KEY = "admin_room_id";

export function useAdminRoom(user: User | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [liveAnswers, setLiveAnswers] = useState<PlayerAnswer[]>([]);

  useEffect(() => {
    if (!user) return;
    const savedId = sessionStorage.getItem(ROOM_KEY);
    if (!savedId) return;
    getDocs(collection(db, "rooms")).then((snap) => {
      const found = snap.docs.find((document) => document.id === savedId);
      if (found) setRoom({ id: found.id, ...found.data() } as Room);
    });
  }, [user]);

  useEffect(() => {
    if (!room?.id) return;
    const unsubRoom = roomService.subscribeToRoom(room.id, setRoom);
    const unsubPlayers = roomService.subscribeToPlayers(room.id, setPlayers);
    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [room?.id]);

  useEffect(() => {
    if (!room?.id || room.status !== "question") {
      setLiveAnswers([]);
      return;
    }
    return roomService.subscribeToAnswers(
      room.id,
      room.currentQuestion,
      setLiveAnswers,
    );
  }, [room?.id, room?.status, room?.currentQuestion]);

  const createRoom = async (
    questions: Omit<RoomQuestion, "id">[],
  ): Promise<{ code: string }> => {
    if (!user) throw new Error("Não autenticado");
    const { roomId, code, roomData } = await roomService.create(
      user.uid,
      user.email ?? "Admin",
      questions,
    );
    sessionStorage.setItem(ROOM_KEY, roomId);
    setRoom({ id: roomId, ...roomData });
    return { code };
  };

  const startQuestion = async () => {
    if (!room) return;
    await roomService.startQuestion(room.id);
  };

  const showRanking = async () => {
    if (!room) return;
    await roomService.applyRankingXp(room.id, room.currentQuestion, players);
  };

  const nextQuestion = async () => {
    if (!room) return;
    await roomService.advanceQuestion(room);
    setLiveAnswers([]);
  };

  const finishRoom = async () => {
    if (!room) return;
    await roomService.finish(room.id);
    sessionStorage.removeItem(ROOM_KEY);
    setRoom(null);
  };

  const clearRoom = () => {
    sessionStorage.removeItem(ROOM_KEY);
    setRoom(null);
  };

  return {
    room,
    players,
    liveAnswers,
    createRoom,
    startQuestion,
    showRanking,
    nextQuestion,
    finishRoom,
    clearRoom,
  };
}
