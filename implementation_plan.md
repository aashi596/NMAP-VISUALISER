# Nmap Visualizer: Implementation & Execution Plan

This document provides a high-level overview of the system architecture for the Nmap Visualizer project and the precise steps required to execute the application successfully, especially regarding elevated privileges.

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend [Frontend: React Application (Vite)]
        direction TB
        App[App Container]
        Sim["SimulationSection\n(Framer Motion Animations)"]
        Res["ResultsSection\n(Recharts Data Visualization)"]
        
        App --> Sim
        App --> Res
    end

    subgraph Backend [Backend: Node.js / Express Server]
        direction TB
        API["Express Router\n(POST /api/scan)"]
        Exec["child_process.exec\n(Executes Nmap)"]
        Parser["xml2js\n(XML to JSON parsing)"]
        FS["File System\n(scan_logs.json)"]
        
        API -->|1. Triggers Scan| Exec
        Exec -->|4. Raw XML String| Parser
        Parser -->|5. Parsed JS Object| API
        API -->|6. Logs Data| FS
    end

    subgraph OS [Host Operating System]
        Nmap["Nmap Executable\n(Network Scanner)"]
    end

    %% Cross-boundary connections
    Sim -->|HTTP POST JSON\n{ scanType }| API
    Exec -->|2. nmap -oX - <target>| Nmap
    Nmap -->|3. stdout (XML Data)| Exec
    API -->|HTTP 200 JSON| Res
```

## 2. Component Breakdown

### Frontend (React / Vite)
*   **App.jsx**: The main container that manages global state (e.g., active scan, scan results) and layout.
*   **SimulationSection.jsx**: Uses **Framer Motion** to visualize the scan process happening. It provides an intuitive interface for users to select different scan profiles.
*   **ResultsSection.jsx**: Parses the normalized JSON response from the backend and renders it using **Recharts**. It translates complex technical data into digestible visual formats.

### Backend (Node.js / Express)
*   **server.js**: Runs an Express HTTP server on port 3001.
*   **Execution Layer**: Uses Node's native `child_process.exec` to run Nmap commands. Crucially, it uses the `-oX -` flag to force Nmap to output structured XML directly to standard output (stdout).
*   **Parsing Layer**: Utilizes the `xml2js` library to asynchronously convert Nmap's complex XML output into a clean, normalized JSON object.

## 3. Execution Instructions (Running as Administrator)

Because Nmap requires elevated privileges to perform accurate network scans (such as OS detection and deep port probing), it is highly recommended to run the backend server from an Administrator Command Prompt.

**Follow these exact steps to start the application without errors:**

### Step 1: Open Command Prompt as Administrator
Search for "cmd" in the Windows Start menu, right-click "Command Prompt", and select **Run as administrator**.

### Step 2: Navigate to the Project Directory
By default, the Admin command prompt opens in `C:\Windows\System32`. If you run npm commands here, they will fail because your project files aren't in this folder.
You **must** change the directory to your project folder. Run this command:
```cmd
cd "c:\Users\aashi\OneDrive\Desktop\insl lab"
```

### Step 3: Start the Backend Server
Once you are in the `insl lab` folder, run the server script:
```cmd
npm run start-server
```
*(The server will start and listen on `http://localhost:3001`)*

### Step 4: Start the Frontend Application
1. Open a **normal** terminal (or a terminal inside VS Code).
2. Ensure you are in the project folder: `c:\Users\aashi\OneDrive\Desktop\insl lab`
3. Run the Vite development server:
```cmd
npm run dev
```
4. Open the provided local URL (typically `http://localhost:5173`) in your browser to interact with the visualizer.
