"use client";
import React, {
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export type AppState = {
  value: boolean;
};

const initialState: AppState = {
  value: false,
};

const AppStateContext = React.createContext<AppState>(initialState);
const SetAppStateContext = React.createContext<
  Dispatch<SetStateAction<AppState>>
>(() => {});

export function useToggleState() {
  return useContext(AppStateContext);
}
export function useSetToggleState() {
  return useContext(SetAppStateContext);
}

export function ToggleStateProvider(props: {
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
