"use client";
import React from "react";
import { Provider } from "react-redux";
import { Store } from "./redux/store";
function ReduxProvider({ children }) {
  return <Provider store={Store}>{children}</Provider>;
}

export default ReduxProvider;
