"use client";
import React from "react";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return <AppUiProvider>{children}</AppUiProvider>;
};

export default Providers;
