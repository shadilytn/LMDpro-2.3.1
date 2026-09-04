const fs = require("fs");
let code = fs.readFileSync("src/index.css", "utf-8");

const oldMedia = `/* ==========================================================================
   MOBILE-FIRST 2-COLUMN RESPONSIVE OVERRIDES (DASHBOARD GRIDS, XP & STATS)
   ========================================================================== */
@media (max-width: 768px) {
  /* Persistent 2-column layout for dashboard stats, widgets, XP counters, and cards */
  .mobile-2col-grid,
  .dashboard-stats-grid,
  .dashboard-widget-grid,
  .dashboard-two-col-mobile,
  .stats-card-grid,
  .xp-metrics-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 0.75rem !important;
    width: 100% !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }
  .dashboard-stats-grid > *,
  .dashboard-widget-grid > * {
    min-width: 0;
    overflow: hidden;
  }
  /* Smooth transition for cards with nested XP/Stats data to prevent viewport breaking */
  #main-content-viewport .grid-cols-1.sm\\:grid-cols-2,
  #main-content-viewport .grid-cols-1.md\\:grid-cols-2,
  #main-content-viewport .grid-cols-1.md\\:grid-cols-3,
  #main-content-viewport .grid-cols-2.lg\\:grid-cols-4,
  #main-content-viewport .grid-cols-3.lg\\:grid-cols-3,
  #main-content-viewport .grid-cols-4 {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 0.5rem !important;
    width: 100% !important;
  }
  /* Compact nested padding for cards on mobile viewports */
  .mobile-compact-card,
  #main-content-viewport .p-4.sm\\:p-6,
  #main-content-viewport .p-6,
  #main-content-viewport .p-5,
  #main-content-viewport .p-4 {
    padding: 0.625rem !important;
    border-radius: 0.875rem !important;
  }
  /* Compact legible typography scaling on mobile */
  .mobile-compact-card h2,
  .mobile-compact-card h3,
  #main-content-viewport h1 {
    font-size: 1.125rem !important;
    line-height: 1.35rem !important;
  }
  #main-content-viewport h2 {
    font-size: 0.9375rem !important;
    line-height: 1.25rem !important;
  }
  #main-content-viewport h3 {
    font-size: 0.8125rem !important;
    line-height: 1.125rem !important;
  }
  .mobile-compact-card p,
  #main-content-viewport p {
    font-size: 0.75rem !important;
    line-height: 1.05rem !important;
  }
  .mobile-compact-card .stat-number,
  #main-content-viewport .font-mono.text-lg,
  #main-content-viewport .font-mono.text-2xl {
    font-size: 1.05rem !important;
    line-height: 1.25rem !important;
  }
  /* Ensure button touch targets and icons fit neatly in 2-column mobile cells */
  #main-content-viewport button {
    touch-action: manipulation;
  }
}`;

const newMedia = `/* ==========================================================================
   MOBILE-FIRST 2-COLUMN RESPONSIVE OVERRIDES (DASHBOARD GRIDS, XP & STATS)
   ========================================================================== */
@media (max-width: 768px) {
  /* Persistent cleaner 2-column layout for dashboard grids */
  .dashboard-stats-grid,
  .dashboard-widget-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 0.5rem !important;
    padding: 0.5rem !important;
    box-sizing: border-box !important;
    width: 100% !important;
    overflow-x: hidden !important;
  }

  .dashboard-stats-grid > *,
  .dashboard-widget-grid > * {
    min-width: 0 !important;
    overflow: hidden !important;
    border-radius: 0.75rem !important;
    padding: 0.75rem !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  /* Ensure button touch targets and icons fit neatly in 2-column mobile cells */
  #main-content-viewport button {
    touch-action: manipulation;
  }
}`;

code = code.replace(oldMedia, newMedia);
fs.writeFileSync("src/index.css", code);
