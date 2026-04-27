# Nmap Visualizer

Nmap Visualizer is an interactive, full-stack educational tool designed to help students and cybersecurity enthusiasts understand how network scanning works. It provides a stunning, glassmorphic, 3D-styled frontend that visualizes the network scanning process in real-time, backed by a Node.js server that safely executes **real** Nmap commands against your local machine.

Instead of staring at terminal text, you can watch animated probes attack a target and view the comprehensive XML output (Open Ports, OS Fingerprinting, Service Versions, Uptime, and Latency) plotted dynamically into immersive Recharts and tables.

## 🚀 How it Works

The project works on a client-server architecture:
1. **The Client (Frontend)**: Built with React and Vite. It provides an intuitive UI where users select the type of scan they wish to perform. When a scan is initiated, a visual animation simulates packets being sent from the attacker to the target. Concurrently, a REST API call is made to the backend to start the actual scan.
2. **The Server (Backend)**: Built with Node.js and Express. It receives the scan request and executes the actual Nmap CLI command locally using Node's `child_process`. It tells Nmap to output the results in XML format.
3. **Data Processing**: Once the Nmap scan completes, the backend uses `xml2js` to parse the rich XML output into a structured JSON format, which is then sent back to the frontend.
4. **Data Visualization**: The React frontend receives the JSON data and populates the **Advanced Results Dashboard**. It uses `recharts` to render interactive charts for port states and renders a clean, tabular view of discovered services, open ports, and operating system details.

## 🛠️ What We Used (Technologies)

### Frontend
- **React 19**: Core UI framework for building the interactive dashboard.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS 4**: For rapid, utility-first styling and achieving the modern dark-neon glassmorphic aesthetic.
- **Framer Motion**: To create the glowing network probe animations and fluid UI transitions.
- **Recharts**: For dynamic 3D-styled SVG charts displaying port distributions (Open/Filtered/Closed).
- **Lucide React**: For crisp, scalable iconography.

### Backend
- **Node.js & Express**: To handle API requests from the frontend and manage scan execution.
- **child_process (Native Node.js)**: To securely execute native system commands.
- **xml2js**: To convert Nmap's detailed XML output into easily consumable JSON.
- **CORS**: To securely handle cross-origin requests between the React frontend and Express backend.

## 📘 Theory of Nmap

Nmap (Network Mapper) is a free and open-source utility for network discovery and security auditing. Many systems and network administrators also find it useful for tasks such as network inventory, managing service upgrade schedules, and monitoring host or service uptime.

Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services (application name and version) those hosts are offering, what operating systems (and OS versions) they are running, what type of packet filters/firewalls are in use, and dozens of other characteristics.

**Common Scan Types Supported in this Tool:**
- **Host Discovery (`-sn`)**: Checks if the target is online without scanning any ports. Also known as a "ping scan".
- **Basic Port Scan (`-sS`)**: The TCP SYN scan. Often called "stealth scanning," it sends a SYN packet and waits for a SYN/ACK. If received, it knows the port is open but drops the connection before a full TCP handshake is completed, making it faster and less likely to be logged.
- **OS Detection (`-O`)**: Analyzes the specific responses to various TCP and UDP packets to "fingerprint" the target's operating system.
- **Aggressive Scan (`-A`)**: Enables OS detection, version detection, script scanning, and traceroute. It is comprehensive but noisy.

*Port States:*
- **Open**: An application is actively accepting TCP connections, UDP datagrams or SCTP associations on this port.
- **Closed**: A closed port is accessible (it receives and responds to Nmap probe packets), but there is no application listening on it.
- **Filtered**: Nmap cannot determine whether the port is open because packet filtering (e.g., a firewall) prevents its probes from reaching the port.

## ⚙️ Prerequisites

Before running this project, you **must** have Nmap installed on your computer.

1. Download and install Nmap for Windows: [https://nmap.org/download.html](https://nmap.org/download.html)
2. *Note: Ensure that Npcap (included in the Nmap Windows installer) is successfully installed, as it is required for raw socket access (OS Detection).*

## 🚀 Installation & Setup

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

*Targeted Safely: To prevent accidental network abuse, the backend is strictly hardcoded to only scan the local loopback address (`127.0.0.1`).*
