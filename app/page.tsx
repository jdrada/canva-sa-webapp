"use client";
import Image from "next/image";
import VoiceRecorder from "./components/VoiceRecorder";
import { AppUiProvider } from "@canva/app-ui-kit";
import "@canva/app-ui-kit/styles.css";

export default function Home() {
  return (
    <AppUiProvider>
      <div>Hello World!</div>
      {/* <VoiceRecorder /> */}
    </AppUiProvider>
  );
}
