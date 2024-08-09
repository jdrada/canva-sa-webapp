"use client";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

const VoiceRecorder: React.FC = () => {
  const [wavesurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const [record, setRecord] = useState<any>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("00:00");
  const micRef = useRef<HTMLDivElement | null>(null);
  const micSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    handleMicSelect();
  }, []);

  const createWaveSurfer = () => {
    if (wavesurfer) {
      wavesurfer.destroy();
    }

    const ws = WaveSurfer.create({
      container: micRef.current!,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
    });

    const recordPlugin = ws.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: false,
      })
    );
    setRecord(recordPlugin);
    setWaveSurfer(ws);

    recordPlugin.on("record-progress", (time: number) => {
      updateProgress(time);
    });
  };

  const updateProgress = (time: number) => {
    const formattedTime = [
      Math.floor((time % 3600000) / 60000), // minutes
      Math.floor((time % 60000) / 1000), // seconds
    ]
      .map((v) => (v < 10 ? "0" + v : v))
      .join(":");
    setProgress(formattedTime);
  };

  const handleRecordClick = async () => {
    if (!record) {
      return;
    }

    if (recording) {
      record.stopRecording();
      setRecording(false);
      setProgress("00:00");
      micRef.current!.style.display = "none";
    } else {
      if (!wavesurfer) {
        createWaveSurfer();
      }
      const deviceId = micSelectRef.current!.value;
      await record.startRecording({ deviceId });
      setRecording(true);
      micRef.current!.style.display = "block";
    }
  };

  const handleMicSelect = async () => {
    const devices = await RecordPlugin.getAvailableAudioDevices();
    devices.forEach((device: MediaDeviceInfo) => {
      const option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label || device.deviceId;
      micSelectRef.current?.appendChild(option);
    });
  };

  return (
    <div>
      <h1>Press Record to start recording 🎙️</h1>

      <select ref={micSelectRef}>
        <option value="" hidden>
          Select mic
        </option>
      </select>

      <button onClick={handleRecordClick}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      <p>{recording && progress}</p>

      <div
        id="mic"
        ref={micRef}
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginTop: "1rem",
          display: "none",
        }}
      ></div>
    </div>
  );
};

export default VoiceRecorder;
