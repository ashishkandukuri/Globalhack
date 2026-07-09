"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import VideoPlayer from "../../videoplayer";

const resultRows = [
  { event: "PPE Compliance", timestamp: "00:12", confidence: "94%", status: "Passed" },
  { event: "Restricted Zone Entry", timestamp: "00:28", confidence: "88%", status: "Review" },
  { event: "Machine Guard Check", timestamp: "00:43", confidence: "91%", status: "Passed" },
  { event: "Smoke / Fire Signal", timestamp: "01:04", confidence: "76%", status: "Low Risk" },
];

export default function ResultsView() {
  const [inputVideoUrl, setInputVideoUrl] = useState("");
  const [outputVideoUrl, setOutputVideoUrl] = useState("");
  const [fileName, setFileName] = useState("Uploaded inspection video");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInputVideoUrl(sessionStorage.getItem("va-input-video-url") ?? "");
      setOutputVideoUrl(sessionStorage.getItem("va-output-video-url") ?? "");
      setFileName(
        sessionStorage.getItem("va-input-video-name") ?? "Uploaded inspection video",
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="va-page">
      <div className="va-hero result">
        <div>
          <p className="eyebrow">VA Analytics</p>
          <h1>Inference Results</h1>
          <p className="page-description">{fileName}</p>
        </div>
        <Link className="secondary-button" href="/va-analytics">
          Upload New Video
        </Link>
      </div>

      <div className="result-video-grid">
        <article className="result-video-card">
          <div className="va-card-heading">
            <div>
              <p className="eyebrow">Input</p>
              <h2>Input Video</h2>
            </div>
          </div>
          <VideoPlayer src={inputVideoUrl} title="Input video result" />
        </article>

        <article className="result-video-card">
          <div className="va-card-heading">
            <div>
              <p className="eyebrow">Output</p>
              <h2>Output Video</h2>
            </div>
            <span>Annotated</span>
          </div>
          <VideoPlayer src={outputVideoUrl || inputVideoUrl} title="Output video result" />
        </article>
      </div>

      <article className="result-table-card">
        <div className="va-card-heading">
          <div>
            <p className="eyebrow">Results</p>
            <h2>Detection Table</h2>
          </div>
        </div>

        <div className="result-table-wrap">
          <table className="result-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Timestamp</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resultRows.map((row) => (
                <tr key={`${row.event}-${row.timestamp}`}>
                  <td>{row.event}</td>
                  <td>{row.timestamp}</td>
                  <td>{row.confidence}</td>
                  <td>
                    <span className={row.status === "Review" ? "status-pill review" : "status-pill"}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
