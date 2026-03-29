"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { GameState, GameAction } from "@/types";
import { gameReducer } from "./GameReducer";
import { getNetWorth as getNetWorthFn } from "@/utils/calculations";

const AUTOSAVE_KEY = "stocks-game-autosave";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => boolean;
  hasAutoSave: () => boolean;
  loadAutoSave: () => boolean;
  getSaveMetadata: () => Array<{
    slotId: number;
    savedAt: string;
    playerName: string;
    currentDay: number;
    netWorth: number;
  } | null>;
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
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auto-save on every state change when game is started
  useEffect(() => {
    if (!state.gameStarted) return;
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
    } catch {
      // localStorage may be full or unavailable
    }
  }, [state]);

  const saveGame = useCallback(
    (slotId: number) => {
      const netWorth = getNetWorthFn(state.portfolio, state.assets);
      const saveSlot = {
        slotId,
        savedAt: new Date().toISOString(),
        playerName: state.playerName,
        currentDay: state.currentDay,
        netWorth,
        snapshot: state,
      };
      localStorage.setItem(
        `stocks-game-save-${slotId}`,
        JSON.stringify(saveSlot)
      );
    },
    [state]
  );

  const loadGame = useCallback(
    (slotId: number): boolean => {
      const raw = localStorage.getItem(`stocks-game-save-${slotId}`);
      if (!raw) return false;
      try {
        const slot = JSON.parse(raw);
        dispatch({ type: "LOAD_GAME", payload: slot.snapshot });
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const hasAutoSave = useCallback((): boolean => {
    return !!localStorage.getItem(AUTOSAVE_KEY);
  }, []);

  const loadAutoSave = useCallback((): boolean => {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    try {
      const savedState = JSON.parse(raw);
      dispatch({ type: "LOAD_GAME", payload: savedState });
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  const getSaveMetadata = useCallback(() => {
    return [1, 2, 3].map((slotId) => {
      const raw = localStorage.getItem(`stocks-game-save-${slotId}`);
      if (!raw) return null;
      try {
        const slot = JSON.parse(raw);
        return {
          slotId: slot.slotId,
          savedAt: slot.savedAt,
          playerName: slot.playerName,
          currentDay: slot.currentDay,
          netWorth: slot.netWorth,
        };
      } catch {
        return null;
      }
    });
  }, []);

  return (
    <GameContext.Provider
      value={{ state, dispatch, saveGame, loadGame, hasAutoSave, loadAutoSave, getSaveMetadata }}
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
