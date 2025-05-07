import { create } from "zustand";
import { BetCardStruct } from "../../components/BetSimulateSidebar.tsx";

type BetEvent = {
  bettingRatioA: number;
  setBettingRatioA: (bettingratioA: number) => void;
  bettingRatioB: number;
  setBettingRatioB: (bettingratioB: number) => void;
  balanceA: number;
  setBalanceA: (balanceA: number) => void;
  balanceB: number;
  setBalanceB: (balance: number) => void;
  isMature: boolean;
  setIsMature: (isMature: boolean) => void;
  placedBets: BetCardStruct[];
  setPlacedBets: (newBet: BetCardStruct) => void;
};

export const useBetStats = create<BetEvent>((set) => ({
  bettingRatioA: 1.2,
  setBettingRatioA: (bettingRatioA: number) => set({ bettingRatioA }),
  bettingRatioB: 1.2,
  setBettingRatioB: (bettingRatioB: number) => set({ bettingRatioB }),
  balanceA: 0,
  setBalanceA: (balanceA: number) => set({ balanceA }),
  balanceB: 0,
  setBalanceB: (balanceB: number) => set({ balanceB }),
  isMature: false, //to check if passed maturity period or not.
  setIsMature: (isMature: boolean) => set({ isMature }),
  placedBets: [],
  setPlacedBets: (newBet: BetCardStruct) =>
    set((state) => ({ placedBets: [...state.placedBets, newBet] })),
}));

// export const usePartyBStats = create<Party>((set) => ({

// }));
