
# IntelliPCAP.AI - AI-Powered Network Packet Analyzer

IntelliPCAP.AI is a modern, AI-powered web application that transforms raw packet captures into readable, actionable insights in seconds. It serves as an intuitive, fast, and visual alternative to traditional tools like Wireshark, designed for cybersecurity professionals, ethical hackers, and IT teams.



## ✨ Key Features

- **Intuitive File Upload**: Simple drag-and-drop or file selection for `.pcap` and `.pcapng` files.
- **Multi-Tiered AI Analysis**: Powered by the Google Gemini API, users can choose from multiple analysis tiers (Quick, Standard, Comprehensive) to balance speed and depth.
- **Comprehensive Dashboard**: After analysis, the UI presents a rich dashboard including:
    - Key security findings and actionable recommendations.
    - Protocol distribution charts for at-a-glance traffic overview.
    - Threat detection summaries categorized by severity.
- **Interactive Packet Table**: A detailed, color-coded table of all network packets, similar to traditional analyzers.
- **Advanced Filtering**: Easily filter packets by protocol (HTTPS, DNS, etc.) and by source or destination IP address.
- **Detailed Packet Inspection**: Select any packet to see a detailed breakdown of its protocol layers (e.g., Ethernet, IP, TCP, Application).
- **Context-Aware AI Chat**: Open a chat assistant, powered by Gemini, that understands the full context of your analysis—including the summary, your current filters, and even the specific packet you have selected—to answer complex questions in natural language.
- **Data Export**: Export the currently filtered list of packets to a CSV file for reporting or further analysis.
- **Modern & Responsive UI**: A clean, dark-themed, and responsive interface built with React and Tailwind CSS.

## 🚀 How It Works

The application provides a seamless workflow for network traffic analysis:

1.  **Upload**: The user starts by dragging and dropping a `.pcap` file onto the upload zone or selecting it from their local machine.
2.  **Initial View**: The application immediately parses the file (using sample data in this version) and displays the packets in the main analysis view. The packet table is instantly available for inspection and filtering.
3.  **Run AI Analysis**: The user selects an analysis tier from the "Smart AI Analysis" panel. Clicking "Run Analysis" triggers an API call to the Google Gemini model.
4.  **Backend Processing**: A carefully crafted prompt is sent to the `gemini-2.5-flash` model. This prompt includes a sample of the packet data and a request for a structured JSON output containing a full analysis (threats, findings, protocol distribution, etc.).
5.  **Display Insights**: The returned JSON is parsed and used to populate the AI Analysis Panel with charts, key findings, and recommendations, giving the user a high-level overview of the capture file.
6.  **Interact & Investigate**: The user can now:
    - Filter the packet table by protocol or IP to narrow down the investigation.
    - Select a single packet to view its specific details and a full protocol layer breakdown.
    - Export the filtered data for external use.
7.  **Ask the AI Assistant**: At any point, the user can open the chat assistant. When a question is asked, another request is sent to Gemini. This request is enriched with the complete context: the initial analysis summary, the user's chat history, the list of currently visible packets, and the specific packet the user has selected. This allows for highly relevant, context-aware answers.

## 🛠️ Tech Stack

- **Frontend**:
    - **Framework**: React.js
    - **Language**: TypeScript
    - **Styling**: Tailwind CSS
    - **Charting**: Recharts
- **Artificial Intelligence**:
    - **AI Model**: Google Gemini (`gemini-2.5-flash`) via the `@google/genai` SDK.
    - **Features Used**:
        - **Structured JSON Output**: `responseSchema` is used to guarantee a valid JSON summary for the main analysis.
        - **System Instructions**: The chat assistant uses a system instruction to define its persona as a "Network Admin Assistant."
        - **Contextual Prompts**: The chat functionality is built on providing rich, multi-faceted context in the prompt to the model.

## 📁 Core Components

-   `App.tsx`: The root component that manages application state, including the current view (`upload` or `analysis`), packet data, analysis results, and all filter states.
-   `components/Header.tsx`: The main navigation header.
-   `components/UploadView.tsx`: The initial landing page for file uploads.
-   `components/analysis/AnalysisView.tsx`: The primary dashboard view that orchestrates all the analysis components.
-   `components/analysis/AiAnalysisPanel.tsx`: The left-side panel for selecting analysis tiers and displaying the AI-generated summary and charts.
-   `components/analysis/PacketTable.tsx`: The interactive and filterable table displaying individual packets.
-   `components/analysis/DetailsPanels.tsx`: The section below the packet table that shows details for a selected packet and the AI summary.
-   `components/ChatAssistant.tsx`: The slide-out chat interface for interacting with the AI assistant.
-   `services/geminiService.ts`: A dedicated module containing all the logic for communicating with the Google Gemini API. It has two main functions: `runAnalysis` and `getChatResponse`.
-   `types.ts`: Contains all TypeScript type definitions and interfaces (e.g., `Packet`, `AnalysisSummary`), ensuring type safety throughout the application.
-   `constants.ts`: Stores static data used in the application, such as the definitions for the analysis tiers.

## ⚙️ Environment Setup

This application is designed to run as a static web app.

1.  **Dependencies**: Project dependencies like `react`, `recharts`, and `@google/genai` are loaded via an `importmap` in `index.html`, removing the need for a local `node_modules` folder.
2.  **API Key**: The application requires a Google Gemini API key to function. This key must be available in the execution environment as `process.env.API_KEY`. The `geminiService.ts` file directly accesses this environment variable.

    ```typescript
    // in services/geminiService.ts
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ```
3.  **Running**: To run the application, serve the root directory using any static file server. Ensure the `API_KEY` environment variable is set in the server's process.
