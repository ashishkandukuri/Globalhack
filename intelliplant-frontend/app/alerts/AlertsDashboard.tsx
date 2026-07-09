"use client";

import { useMemo, useState } from "react";

type TimeFilter = "1h" | "1d" | "1w" | "1m";
type AreaFilter = "all" | "assembly" | "boiler" | "cold-storage" | "control";

const timeFilters: { label: string; value: TimeFilter; hours: number }[] = [
  { label: "1 hr", value: "1h", hours: 1 },
  { label: "1 day", value: "1d", hours: 24 },
  { label: "1 week", value: "1w", hours: 168 },
  { label: "1 month", value: "1m", hours: 720 },
];

const areaFilters: { label: string; value: AreaFilter }[] = [
  { label: "All Areas", value: "all" },
  { label: "Assembly Line", value: "assembly" },
  { label: "Boiler Room", value: "boiler" },
  { label: "Cold Storage", value: "cold-storage" },
  { label: "Control Room", value: "control" },
];

const alerts = [
  {
    id: "ALT-1048",
    title: "Packing zone temperature spike",
    source: "Sensor Data",
    area: "assembly",
    areaLabel: "Assembly Line",
    severity: "critical",
    metric: "42°C",
    threshold: "Limit 34°C",
    ageHours: 0.35,
    time: "18 min ago",
    message: "Dashboard sensor card crossed safe thermal range in Packing.",
  },
  {
    id: "ALT-1047",
    title: "CCTV camera inactive",
    source: "CCTV Cameras",
    area: "control",
    areaLabel: "Control Room",
    severity: "high",
    metric: "CAM-CTRL-04",
    threshold: "Offline",
    ageHours: 0.8,
    time: "48 min ago",
    message: "Monitoring wall feed is unavailable and needs operator check.",
  },
  {
    id: "ALT-1046",
    title: "Boiler vibration anomaly",
    source: "Maintenance",
    area: "boiler",
    areaLabel: "Boiler Room",
    severity: "critical",
    metric: "8.2 mm/s",
    threshold: "Limit 6.0 mm/s",
    ageHours: 3,
    time: "3 hrs ago",
    message: "Predictive maintenance signal indicates abnormal vibration on Boiler A.",
  },
  {
    id: "ALT-1045",
    title: "Loading gate humidity drift",
    source: "Sensor Data",
    area: "cold-storage",
    areaLabel: "Cold Storage",
    severity: "medium",
    metric: "68%",
    threshold: "Target 58%",
    ageHours: 8,
    time: "8 hrs ago",
    message: "Cold storage humidity is trending above the dashboard baseline.",
  },
  {
    id: "ALT-1044",
    title: "Ops throughput drop",
    source: "Ops Efficiency",
    area: "assembly",
    areaLabel: "Assembly Line",
    severity: "medium",
    metric: "74%",
    threshold: "Target 90%",
    ageHours: 18,
    time: "18 hrs ago",
    message: "Conveyor output dropped below expected production range.",
  },
  {
    id: "ALT-1043",
    title: "Server rack heat warning",
    source: "Sensor Data",
    area: "control",
    areaLabel: "Control Room",
    severity: "high",
    metric: "31°C",
    threshold: "Limit 28°C",
    ageHours: 52,
    time: "2 days ago",
    message: "Control room rack temperature is elevated and may affect systems.",
  },
  {
    id: "ALT-1042",
    title: "Freezer door open duration",
    source: "Alerts",
    area: "cold-storage",
    areaLabel: "Cold Storage",
    severity: "low",
    metric: "4m 22s",
    threshold: "Limit 2m",
    ageHours: 96,
    time: "4 days ago",
    message: "Freezer A door remained open longer than the configured limit.",
  },
  {
    id: "ALT-1041",
    title: "Valve rack inspection due",
    source: "Maintenance",
    area: "boiler",
    areaLabel: "Boiler Room",
    severity: "low",
    metric: "Due",
    threshold: "Monthly check",
    ageHours: 360,
    time: "15 days ago",
    message: "Scheduled valve rack inspection is pending for the current cycle.",
  },
];

const severityOrder = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export default function AlertsDashboard() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1d");
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("all");

  const selectedTime = timeFilters.find((filter) => filter.value === timeFilter) ?? timeFilters[1];
  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert) => alert.ageHours <= selectedTime.hours)
      .filter((alert) => areaFilter === "all" || alert.area === areaFilter)
      .sort((firstAlert, secondAlert) => {
        const severityGap =
          severityOrder[secondAlert.severity as keyof typeof severityOrder] -
          severityOrder[firstAlert.severity as keyof typeof severityOrder];

        return severityGap || firstAlert.ageHours - secondAlert.ageHours;
      });
  }, [areaFilter, selectedTime.hours]);

  const criticalCount = filteredAlerts.filter((alert) => alert.severity === "critical").length;
  const highCount = filteredAlerts.filter((alert) => alert.severity === "high").length;

  return (
    <section className="alerts-page">
      <div className="alerts-hero">
        <div>
          <p className="eyebrow">Alerts</p>
          <h1>Plant Alert Center</h1>
          <p className="page-description">
            Dashboard anomalies from sensors, CCTV, maintenance, and ops are collected here for review.
          </p>
        </div>
        <div className="alerts-health-card">
          <span>Active Alerts</span>
          <strong>{filteredAlerts.length}</strong>
          <p>{criticalCount} critical · {highCount} high priority</p>
        </div>
      </div>

      <div className="alerts-filter-card">
        <div className="filter-group">
          <span>Time Range</span>
          <div className="filter-buttons">
            {timeFilters.map((filter) => (
              <button
                className={timeFilter === filter.value ? "active" : ""}
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group area-filter">
          <label htmlFor="area-filter">Room / Area</label>
          <select
            id="area-filter"
            onChange={(event) => setAreaFilter(event.target.value as AreaFilter)}
            value={areaFilter}
          >
            {areaFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="alerts-summary-grid">
        <article className="alert-summary-card critical">
          <span>Critical</span>
          <strong>{criticalCount}</strong>
          <p>Immediate action needed</p>
        </article>
        <article className="alert-summary-card high">
          <span>High Priority</span>
          <strong>{highCount}</strong>
          <p>Operator review required</p>
        </article>
        <article className="alert-summary-card">
          <span>Connected Signals</span>
          <strong>5</strong>
          <p>Alerts, CCTV, maintenance, ops, sensors</p>
        </article>
      </div>

      <div className="alerts-layout">
        <article className="alerts-list-card">
          <div className="alerts-section-heading">
            <div>
              <p className="eyebrow">Incident Feed</p>
              <h2>Filtered Alerts</h2>
            </div>
            <span>{selectedTime.label}</span>
          </div>

          <div className="alerts-list">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <div className={`alert-row ${alert.severity}`} key={alert.id}>
                  <div className="alert-status-dot" />
                  <div className="alert-main">
                    <div className="alert-title-line">
                      <strong>{alert.title}</strong>
                      <span>{alert.time}</span>
                    </div>
                    <p>{alert.message}</p>
                    <div className="alert-tags">
                      <span>{alert.source}</span>
                      <span>{alert.areaLabel}</span>
                      <span>{alert.id}</span>
                    </div>
                  </div>
                  <div className="alert-metric">
                    <strong>{alert.metric}</strong>
                    <span>{alert.threshold}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="alerts-empty-state">
                <strong>No alerts found</strong>
                <span>Try a wider time range or choose all areas.</span>
              </div>
            )}
          </div>
        </article>

        <aside className="alerts-area-card">
          <div className="alerts-section-heading compact">
            <div>
              <p className="eyebrow">Area View</p>
              <h2>Room Hotspots</h2>
            </div>
          </div>

          <div className="area-hotspot-list">
            {areaFilters.slice(1).map((area) => {
              const areaAlerts = alerts.filter(
                (alert) => alert.area === area.value && alert.ageHours <= selectedTime.hours,
              );
              const hasCritical = areaAlerts.some((alert) => alert.severity === "critical");

              return (
                <button
                  className={`area-hotspot ${areaFilter === area.value ? "active" : ""} ${
                    hasCritical ? "critical" : ""
                  }`}
                  key={area.value}
                  onClick={() => setAreaFilter(area.value)}
                  type="button"
                >
                  <span>{area.label}</span>
                  <strong>{areaAlerts.length}</strong>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
