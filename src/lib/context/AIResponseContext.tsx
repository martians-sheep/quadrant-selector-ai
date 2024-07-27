"use client";
import React, {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type AppState = {
  x: number;
  y: number;
  response: string;
};

const initialState: AppState = {
  x: 0,
  y: 0,
  response: "",
};

const AppStateContext = React.createContext<AppState>(initialState);
const SetAppStateContext = React.createContext<
  Dispatch<SetStateAction<AppState>>
>(() => {});

export function useAIResponseState() {
  return useContext(AppStateContext);
}
export function useSetAIResponseState() {
  return useContext(SetAppStateContext);
}

export function AIResponseStateProvider(props: {
  initialState?: AppState;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AppState>(
    props.initialState ?? initialState
  );
  return (
    <AppStateContext.Provider value={state}>
      <SetAppStateContext.Provider value={setState}>
        {props.children}
      </SetAppStateContext.Provider>
    </AppStateContext.Provider>
  );
}
