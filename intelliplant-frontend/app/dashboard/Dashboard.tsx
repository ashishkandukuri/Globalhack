"use client";

import { useMemo, useState } from "react";

const rooms = [
  {
    id: "assembly",
    name: "Assembly Line",
    label: "Industrial Room 01",
    temperature: "28°C",
    humidity: "43%",
    airQuality: "Good",
    zones: [
      { name: "Robot Cell", status: "normal", x: 8, y: 14, width: 38, height: 32 },
      { name: "Conveyor", status: "warning", x: 52, y: 14, width: 38, height: 16 },
      { name: "QC Bay", status: "normal", x: 52, y: 38, width: 18, height: 42 },
      { name: "Packing", status: "critical", x: 74, y: 38, width: 16, height: 42 },
    ],
  },
  {
    id: "boiler",
    name: "Boiler Room",
    label: "Industrial Room 02",
    temperature: "36°C",
    humidity: "31%",
    airQuality: "Moderate",
    zones: [
      { name: "Boiler A", status: "warning", x: 8, y: 16, width: 34, height: 54 },
      { name: "Boiler B", status: "normal", x: 48, y: 16, width: 34, height: 54 },
      { name: "Valve Rack", status: "normal", x: 14, y: 76, width: 68, height: 12 },
    ],
  },
  {
    id: "cold-storage",
    name: "Cold Storage",
    label: "Industrial Room 03",
    temperature: "4°C",
    humidity: "58%",
    airQuality: "Good",
    zones: [
      { name: "Freezer A", status: "normal", x: 8, y: 12, width: 38, height: 34 },
      { name: "Freezer B", status: "normal", x: 54, y: 12, width: 38, height: 34 },
      { name: "Loading Gate", status: "warning", x: 8, y: 58, width: 84, height: 26 },
    ],
  },
  {
    id: "control",
    name: "Control Room",
    label: "Industrial Room 04",
    temperature: "24°C",
    humidity: "39%",
    airQuality: "Excellent",
    zones: [
      { name: "Operator Desk", status: "normal", x: 10, y: 12, width: 80, height: 20 },
      { name: "Server Rack", status: "critical", x: 10, y: 44, width: 24, height: 38 },
      { name: "Monitoring Wall", status: "normal", x: 44, y: 44, width: 46, height: 38 },
    ],
  },
];

const statusCards = [
  {
    title: "Alerts",
    value: "12",
    meta: "3 critical alerts",
    tone: "critical",
    data: [30, 48, 36, 68, 54, 72],
  },
  {
    title: "CCTV Cameras",
    value: "42 / 46",
    meta: "4 inactive cameras",
    tone: "warning",
    data: [70, 72, 71, 69, 73, 75],
  },
  {
    title: "Maintenance",
    value: "87%",
    meta: "Predictive health",
    tone: "normal",
    data: [62, 66, 72, 69, 78, 87],
  },
  {
    title: "Ops Efficiency",
    value: "94%",
    meta: "Live throughput",
    tone: "success",
    data: [76, 82, 80, 88, 91, 94],
  },
  {
    title: "Sensor Data",
    value: "1.8k",
    meta: "Signals per minute",
    tone: "normal",
    data: [44, 60, 52, 74, 68, 82],
  },
];

const sensorRows = [
  { label: "Temperature", value: "Stable", progress: 68 },
  { label: "Vibration", value: "Watch", progress: 82 },
  { label: "Power Load", value: "Normal", progress: 54 },
  { label: "Air Flow", value: "Optimal", progress: 72 },
];

export default function Dashboard() {
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? rooms[0],
    [selectedRoomId],
  );

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Plant Overview</h1>
          <p className="page-description">
            Live alerts, camera health, maintenance signals, ops metrics, and room-wise floor plans.
          </p>
        </div>
      </div>

      <div className="dashboard-card-grid">
        {statusCards.map((card) => (
          <article className={`metric-card ${card.tone}`} key={card.title}>
            <div>
              <p>{card.title}</p>
              <strong>{card.value}</strong>
              <span>{card.meta}</span>
            </div>
            <div className="mini-bars" aria-hidden="true">
              {card.data.map((height, index) => (
                <i key={`${card.title}-${index}`} style={{ height: `${height}%` }} />
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <article className="floor-plan-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Floor Plan</p>
              <h2>{selectedRoom.name}</h2>
            </div>
            <div className="floor-plan-controls">
              <div className="dashboard-room-picker">
                <label htmlFor="room-select">Floor plan room</label>
                <select
                  id="room-select"
                  value={selectedRoomId}
                  onChange={(event) => setSelectedRoomId(event.target.value)}
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.label} - {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="room-stats">
                <span>{selectedRoom.temperature}</span>
                <span>{selectedRoom.humidity}</span>
                <span>{selectedRoom.airQuality}</span>
              </div>
            </div>
          </div>

          <div className="floor-plan-window">
            {selectedRoom.zones.map((zone) => (
              <div
                className={`floor-zone ${zone.status}`}
                key={zone.name}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`,
                }}
              >
                <span>{zone.name}</span>
              </div>
            ))}
            <div className="floor-door">Entry</div>
          </div>
        </article>

      </div>

      <article className="panel-card sensor-panel-wide">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Sensor Data</p>
            <h2>Live Signals</h2>
          </div>
        </div>
        <div className="sensor-list">
          {sensorRows.map((sensor) => (
            <div className="sensor-row" key={sensor.label}>
              <div>
                <span>{sensor.label}</span>
                <strong>{sensor.value}</strong>
              </div>
              <div className="sensor-track">
                <i style={{ width: `${sensor.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
