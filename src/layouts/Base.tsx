import React from "react";
import ReduxProvider from "../provider/reduxProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
