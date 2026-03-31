"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import type { GameState, GameAction, SaveSlot } from "@/types";
import { gameReducer } from "./GameReducer";
import { getNetWorth as getNetWorthFn } from "@/utils/calculations";

const AUTOSAVE_KEY = "stocks-game-autosave";
const PLAYER_ID_KEY = "wallstreet_player_id";
const AUTOSAVE_SLOT = 0;

function getPlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

async function syncSlotToDB(
  playerId: string,
  slotId: number,
  slot: SaveSlot
): Promise<void> {
  if (!playerId) return;
  await fetch("/api/saves", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId,
      slotId,
      playerName: slot.playerName,
      currentDay: slot.currentDay,
      netWorth: slot.netWorth,
      snapshot: slot.snapshot,
    }),
  });
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => boolean;
  deleteGame: (slotId: number) => void;
  resetGame: () => void;
  hasAutoSave: () => boolean;
  loadAutoSave: () => boolean;
  getSaveMetadata: () => Array<SaveSlot | null>;
  saveSlotsLoaded: boolean;
}

const initialState: GameState = {
  currentDay: 1,
  startDate: "2026-01-05",
  assets: {},
  portfolio: {
    cash: 10_000,
    holdings: {},
    transactions: [],
    netWorthHistory: [],
  },
  playerName: "",
  activeEvents: [],
  eventHistory: [],
  recentEventCooldowns: {},
  volatilityOverrides: {},
  pendingTrade: null,
  gameStarted: false,
  indexes: {},
  playerHedgeFund: null,
  blogFeed: [],
  analystUnlocks: [],
  analystSubscription: null,
  contacts: [],
  contactTips: [],
  playerPostCount: 0,
  playerFollowerCount: 0,
  playerVerifiedPostCount: 0,
  playerWrongPostCount: 0,
  skillPoints: 0,
  traderSkills: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 },
  traderSkillsXP: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 },
  playerInfluence: 0,
  premiumBlogSubscription: null,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Slots: index 0 = autosave, 1-3 = manual
  const [saveSlots, setSaveSlots] = useState<(SaveSlot | null)[]>([
    null, null, null, null,
  ]);
  const [saveSlotsLoaded, setSaveSlotsLoaded] = useState(false);

  // Load saves from DB on mount
  useEffect(() => {
    const playerId = getPlayerId();
    if (!playerId) {
      setSaveSlotsLoaded(true);
      return;
    }
    fetch(`/api/saves?playerId=${encodeURIComponent(playerId)}`)
      .then((r) => r.json())
      .then((rows: Record<string, unknown>[]) => {
        const slots: (SaveSlot | null)[] = [null, null, null, null];
        for (const row of rows) {
          const id = row.slot_id as number;
          if (id >= 0 && id <= 3) {
            slots[id] = {
              slotId: id,
              savedAt: row.saved_at as string,
              playerName: row.player_name as string,
              currentDay: row.current_day as number,
              netWorth: Number(row.net_worth),
              snapshot: row.snapshot as GameState,
            };
          }
        }
        setSaveSlots(slots);
        setSaveSlotsLoaded(true);
      })
      .catch(() => setSaveSlotsLoaded(true));
  }, []);

  // Auto-save: localStorage immediately + debounced DB sync (slot 0)
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!state.gameStarted) return;

    // Fast local backup
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
    } catch {
      // localStorage may be full or unavailable
    }

    // Debounce DB autosave to avoid spamming on rapid state changes
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      const playerId = getPlayerId();
      if (!playerId) return;
      const netWorth = getNetWorthFn(state.portfolio, state.assets);
      const slot: SaveSlot = {
        slotId: AUTOSAVE_SLOT,
        savedAt: new Date().toISOString(),
        playerName: state.playerName,
        currentDay: state.currentDay,
        netWorth,
        snapshot: state,
      };
      setSaveSlots((prev) => {
        const next = [...prev];
        next[AUTOSAVE_SLOT] = slot;
        return next;
      });
      syncSlotToDB(playerId, AUTOSAVE_SLOT, slot).catch(console.error);
    }, 3000);
  }, [state]);

  const saveGame = useCallback(
    (slotId: number) => {
      const playerId = getPlayerId();
      const netWorth = getNetWorthFn(state.portfolio, state.assets);
      const slot: SaveSlot = {
        slotId,
        savedAt: new Date().toISOString(),
        playerName: state.playerName,
        currentDay: state.currentDay,
        netWorth,
        snapshot: state,
      };
      setSaveSlots((prev) => {
        const next = [...prev];
        next[slotId] = slot;
        return next;
      });
      syncSlotToDB(playerId, slotId, slot).catch(console.error);
    },
    [state]
  );

  const loadGame = useCallback(
    (slotId: number): boolean => {
      const slot = saveSlots[slotId];
      if (!slot) return false;
      dispatch({ type: "LOAD_GAME", payload: slot.snapshot });
      return true;
    },
    [saveSlots]
  );

  const deleteGame = useCallback(
    (slotId: number) => {
      const playerId = getPlayerId();
      setSaveSlots((prev) => {
        const next = [...prev];
        next[slotId] = null;
        return next;
      });
      if (playerId) {
        fetch(
          `/api/saves?playerId=${encodeURIComponent(playerId)}&slotId=${slotId}`,
          { method: "DELETE" }
        ).catch(console.error);
      }
    },
    []
  );

  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      // ignore
    }
    // Clear DB autosave slot
    const playerId = getPlayerId();
    if (playerId) {
      fetch(
        `/api/saves?playerId=${encodeURIComponent(playerId)}&slotId=${AUTOSAVE_SLOT}`,
        { method: "DELETE" }
      ).catch(console.error);
    }
    setSaveSlots((prev) => {
      const next = [...prev];
      next[AUTOSAVE_SLOT] = null;
      return next;
    });
    dispatch({ type: "RESET_GAME" });
  }, []);

  const hasAutoSave = useCallback((): boolean => {
    if (saveSlots[AUTOSAVE_SLOT] !== null) return true;
    // Fallback: check localStorage (migration path for existing players)
    try {
      return !!localStorage.getItem(AUTOSAVE_KEY);
    } catch {
      return false;
    }
  }, [saveSlots]);

  const loadAutoSave = useCallback((): boolean => {
    // Prefer DB autosave slot
    const slot = saveSlots[AUTOSAVE_SLOT];
    if (slot) {
      dispatch({ type: "LOAD_GAME", payload: slot.snapshot });
      return true;
    }
    // Fallback: localStorage (migration path)
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return false;
      const savedState = JSON.parse(raw);
      dispatch({ type: "LOAD_GAME", payload: savedState });
      return true;
    } catch {
      return false;
    }
  }, [saveSlots]);

  const getSaveMetadata = useCallback((): Array<SaveSlot | null> => {
    return [1, 2, 3].map((slotId) => saveSlots[slotId]);
  }, [saveSlots]);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        saveGame,
        loadGame,
        deleteGame,
        resetGame,
        hasAutoSave,
        loadAutoSave,
        getSaveMetadata,
        saveSlotsLoaded,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
