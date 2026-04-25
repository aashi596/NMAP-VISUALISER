# Nmap Visualizer

Nmap Visualizer is an interactive, full-stack educational tool designed to help students and cybersecurity enthusiasts understand how network scanning works. It provides a stunning, glassmorphic, 3D-styled frontend that visualizes the network scanning process in real-time, backed by a Node.js server that safely executes **real** Nmap commands against your local machine.

Instead of staring at terminal text, you can watch animated probes attack a target and view the comprehensive XML output (Open Ports, OS Fingerprinting, Service Versions, Uptime, and Latency) plotted dynamically into immersive Recharts and tables.

## 🚀 Features

- **Live Real-Time Simulation**: Watch glowing network probes launch from an "Attacker" machine to a "Target" machine.
- **Real Nmap Execution**: The backend securely hooks into the system's native `nmap` installation to execute genuine TCP Handshake (`-sS`), OS Detection (`-O`), and Aggressive (`-A`) scans.
- **Targeted Safely**: To prevent accidental network abuse, the backend is strictly hardcoded to only scan the local loopback address (`127.0.0.1`).
- **Advanced Results Dashboard**:
  - Displays Host Information (Uptime, Latency).
  - Calculates OS Fingerprinting Confidence.
  - Renders deep Port Details (Service, Version, Product Info) in a sleek glassmorphic table.
  - Dynamically charts port states (Open vs Filtered vs Closed) using 3D SVG shapes.

## ⚙️ Prerequisites

Before running this project, you **must** have Nmap installed on your computer.

1. Download and install Nmap for Windows: [https://nmap.org/download.html](https://nmap.org/download.html)
2. *Note: Ensure that Npcap (included in the Nmap Windows installer) is successfully installed, as it is required for raw socket access (OS Detection).*

## 🛠️ Installation & Setup

Because this app performs real network reconnaissance (like OS fingerprinting), the backend **must be run with Administrator privileges**.

### 1. Start the Backend Server (Requires Admin)
1. Open a **Command Prompt** or **PowerShell** as **Administrator**.
2. Navigate to the root directory of this project.
3. Install backend dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the backend:
   ```bash
   npm run start-server
   ```
   *The Express server will start on `http://localhost:3001` and await scan requests.*

### 2. Start the Frontend UI
1. Open a **normal** terminal window.
2. Navigate to the root directory of this project.
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided (usually `http://localhost:5173`).

## 🖥️ How to Use
1. Once the web interface loads, select your desired scan type from the dropdown menu in the center (e.g., *Host Discovery*, *Basic Port Scan*, *OS Detection*, or *Aggressive Scan*).
2. Click **Run Scan**.
3. Watch the terminal logs as it executes the Nmap command natively.
4. Scroll down to view the **Results & Analysis** dashboard to explore the exact services, versions, and operating system properties running on your own machine!
