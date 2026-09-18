# Forge v3 — Workout Builder & Tracker

This version turns Forge from a plan generator into a workout builder/tracker.

### Per-exercise configuration
Every exercise can have:
- Exercise name
- Machine / setup
- Target sets
- Target reps

### Per-set logging
Every set can record:
- Weight
- Reps
- Done/not done

### Tracking
Saved workouts are stored in browser `localStorage`. The Tracker page calculates:
- Average sets per exercise
- Average reps per logged set
- Average weight per logged set
- Total exercise logs
- Total sets
- Total volume (weight × reps)

### Important
This is local browser storage. If browser site data is cleared, the locally stored history can disappear. A future version can add accounts/cloud sync/export.

## Run
Open the folder in VS Code and use Live Server on `index.html`.

## Publish free
This is a static HTML/CSS/JS site, so it can be published using a free static-hosting service such as GitHub Pages or Cloudflare Pages.


## v4 additions
- Session length options: 30, 45, 60, 90, 120 minutes.
- New Weekly Plan tab.
- Generates a 7-day schedule for 2–6 training days.
- Rest days are explicitly included.
- Training days have a focus, suggested exercises, duration, and a button to load that day into the detailed Builder/Tracker.
- Weekly plans are stored locally in the browser.
