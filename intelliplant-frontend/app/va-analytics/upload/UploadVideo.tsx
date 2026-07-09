"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "../../videoplayer";

const inferenceSteps = [
  "Extracting frames",
  "Running defect detection",
  "Tracking safety events",
  "Generating annotated output",
];

export default function UploadVideo() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const nextVideoUrl = URL.createObjectURL(file);
    setVideoUrl(nextVideoUrl);
    setFileName(file.name);
    setProgress(0);
    setIsProcessing(false);

    sessionStorage.setItem("va-input-video-url", nextVideoUrl);
    sessionStorage.setItem("va-input-video-name", file.name);
  }

  function handleReset() {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    setVideoUrl("");
    setFileName("");
    setIsProcessing(false);
    setProgress(0);
    sessionStorage.removeItem("va-input-video-url");
    sessionStorage.removeItem("va-input-video-name");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleLaunchAgent() {
    if (!videoUrl || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setProgress(8);

    const timer = window.setInterval(() => {
      setProgress((currentProgress) => {
        const nextProgress = Math.min(currentProgress + 13, 100);

        if (nextProgress === 100) {
          window.clearInterval(timer);
          sessionStorage.setItem("va-output-video-url", videoUrl);
          window.setTimeout(() => router.push("/va-analytics/results"), 500);
        }

        return nextProgress;
      });
    }, 420);
  }

  const activeStepIndex = Math.min(
    Math.floor(progress / 28),
    inferenceSteps.length - 1,
  );

  return (
    <section className="va-page">
      <div className="va-hero">
        <div>
          <p className="eyebrow">VA Analytics</p>
          <h1>Video Analytics Agent</h1>
          <p className="page-description">
            Upload an inspection video, launch the agent, and review the processed result.
          </p>
        </div>
      </div>

      <div className="va-workspace">
        <article className="va-upload-card">
          <div className="va-card-heading">
            <div>
              <p className="eyebrow">Input Video</p>
              <h2>Upload Video</h2>
            </div>
            {fileName && <span>{fileName}</span>}
          </div>

          <label className={`upload-dropzone ${videoUrl ? "has-video" : ""}`}>
            <input
              accept="video/*"
              onChange={handleVideoUpload}
              ref={fileInputRef}
              type="file"
            />
            {videoUrl ? (
              <VideoPlayer src={videoUrl} title="Uploaded input video" />
            ) : (
              <div className="upload-empty-state">
                <strong>Drop or choose a video</strong>
                <span>MP4, MOV, AVI, or WebM supported</span>
              </div>
            )}
          </label>

          <div className="va-actions">
            <button className="secondary-button" onClick={handleReset} type="button">
              Reset
            </button>
            <button
              className="primary-button"
              disabled={!videoUrl || isProcessing}
              onClick={handleLaunchAgent}
              type="button"
            >
              {isProcessing ? "Inferencing..." : "Launch Agent"}
            </button>
          </div>
        </article>

        <article className="va-processing-card">
          <div className="va-card-heading">
            <div>
              <p className="eyebrow">Inferencing</p>
              <h2>Processing Status</h2>
            </div>
            <span>{progress}%</span>
          </div>

          <div className="inference-progress">
            <i style={{ width: `${progress}%` }} />
          </div>

          <div className="inference-steps">
            {inferenceSteps.map((step, index) => (
              <div
                className={`inference-step ${
                  isProcessing && index <= activeStepIndex ? "active" : ""
                } ${progress === 100 ? "complete" : ""}`}
                key={step}
              >
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
