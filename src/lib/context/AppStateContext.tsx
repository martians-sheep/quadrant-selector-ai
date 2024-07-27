"use client";
import React, {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type AppState = {
  value: string;
};

const initialState: AppState = {
  value: "",
};

const AppStateContext = React.createContext<AppState>(initialState);
const SetAppStateContext = React.createContext<
  Dispatch<SetStateAction<AppState>>
>(() => {});

export function useAppState() {
  return useContext(AppStateContext);
}
export function useSetAppState() {
  return useContext(SetAppStateContext);
}

export function AppStateProvider(props: {
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
