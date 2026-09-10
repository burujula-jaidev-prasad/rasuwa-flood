# The 2026 Rasuwa–Bhotekoshi Flood — 3D Analytical Explainer

An interactive 3D WebGL explainer visualizing the catastrophic **ice–rock avalanche, river damming, and cascading flood burst** that occurred along the Langtang Lirung / Bhotekoshi–Trishuli river corridor in central Nepal.

Based on the **Scene Content & Production Bible**, incorporating verified data and findings from ICIMOD, USGS, HiRISK, Nature, GFZ, and satellite reconstructions.

---

## Key Features

1. **Procedural 3D Terrain & Hydrogeomorphology**
   - 168×168 grid on a 240×240 unit plane (`AREA=120`, Y-up).
   - Multi-octave ridged noise base relief.
   - 6 named peaks/massifs as Gaussian bumps (Langtang Lirung at 52 units, Massifs 2–6).
   - Carved Catmull-Rom river gorge (river bed depressed to `river_elev - 2.2` with quadratic canyon banks).
   - Elevation color ramps (<6 valley green `#33513c` up to snow `#eef4f6` and source glacier tint `#dfeaf0`).

2. **Accurate Timeline & Physics Simulation ($DUR = 34\text{ s}$)**
   - **$t = 0.00$**: Camera establishes peak of Langtang Lirung.
   - **$t = 0.02 - 0.16$**: Avalanche detachment, ballistic trajectory, 14 tumbling shards, detachment scar decal, river impact cloud.
   - **$t = 0.14 - 1.0$**: Dam breach, orange surge wave head, dynamic trailing flood ribbon, structure demolition (dams and villages tumble, drift, and fade upon arrival).
   - Dynamic particle rain (6,500 raindrops with wind drift) and drifting valley mist (toggleable; historical note clarifies the disaster occurred on a clear day).

3. **Camera Choreography (§7)**
   - Spherical director camera with smoothed tracking (`lerp 0.06`).
   - Seamless manual override (drag to orbit, scroll to zoom) with a one-click **"DIRECTOR CAM" / "FREE ORBIT"** toggle.

4. **Live Analytical HUD (§6 & §9)**
   - Top toll counters ramping strictly per specification:
     - Confirmed Dead ($1,355$)
     - Missing ($4,996$)
     - Hydropower Capacity Offline ($431.1\text{ MW}$)
   - Left roadmap list of all 8 chronological waypoints (click to jump).
   - Right analytics card updating with verified satellite metrics, scientific notes, and latency gap analysis.
   - Bottom caption bar displaying the 10-beat narrative script.
   - Scrubber and clock tracking real-world time ($08:37 \to 10:00+$).

5. **Blender Scene Generator (`blender_rasuwa_scene.py`)**
   - Standalone Python automation script for Blender 3.3+ / 4.x.
   - Reconstructs the 3D terrain, river curve, and keyframed camera choreography for offline Cycles/Eevee rendering.

---

## Running the Application

### Option A: Development Server (Vite)
```bash
npm run dev
```
Open `http://localhost:5173` in any modern web browser.

### Option B: Production Preview
```bash
npm run build
npm run preview
```

### Option C: Python HTTP Server
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000`.

---

## Core Scientific Point
This catastrophe was an **ice–rock avalanche that dammed and burst a river**, **NOT** a classic glacial lake outburst flood (GLOF). Rapid Himalayan warming doubled ice loss rates since 2000, loosening the rock–ice slope that failed.
