import { create } from "zustand";

interface ValidateStepState {
  isValid: boolean;
  skip: boolean;
  setIsValid: (isValid: boolean) => void;
  setSkip: (isValid: boolean) => void;
}

export const useValidateStep = create<ValidateStepState>((set) => ({
  isValid: false,
  skip: false,
  setIsValid: (isValid) => set({ isValid }),
  setSkip: (skip) => set({ skip }),
}));
