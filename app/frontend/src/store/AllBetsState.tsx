import { create } from "zustand";

type AllBetsInfoStruct = {
  /// bets for different sports
  competitiveBets: CompetitiveBetsStruct[];

  /// bets involving currencies
  currencyBets: CurrencyBetsStruct[];

  setCompetitiveBets: (newCompetitiveBets: CompetitiveBetsStruct[]) => void;

  setCurrencyBets: (newCurrencyBets: CurrencyBetsStruct[]) => void;
};

type CurrencyBetsStruct = {
  currency: "SOL" | "ETH" | "BTC";
  currentPrice: number;
  totalBetsA: number;
  totalMoneyA: number;
  bettingRatioA: number;
  totalBetsB: number;
  totalMoneyB: number;
  bettingRatioB: number;
};

type CompetitiveBetsStruct = {
  eventName: string;
  partyA: string;
  partyB: string;
  date: Date;

  /// change later
  liveStats: string | null;
};

// type UpdateCompBetsStatsStruct = {
//   isAorB: boolean;
//   updatedTotalBets: number;
//   updatedTotalMoney: number;
//   updatedBettingRatio: number;
// };

export const useAllBetsStats = create<AllBetsInfoStruct>((set) => ({
  competitiveBets: [],
  currencyBets: [],

  setCompetitiveBets: (newCompetitiveBets: CompetitiveBetsStruct[]) =>
    set((state) => ({
      competitiveBets: [...state.competitiveBets, ...newCompetitiveBets],
    })),

  setCurrencyBets: (newCurrencyBets: CurrencyBetsStruct[]) =>
    set((state) => ({
      currencyBets: [...state.currencyBets, ...newCurrencyBets],
    })),

  // setCompBetsStats: (updateCompStats: UpdateCompBetsStatsStruct) =>
  //   set((state) => ({})),
}));
