# 📽️ Zoom Workplace Platform

A full-stack, enterprise-grade video conferencing and real-time collaboration platform inspired by Zoom, featuring high-fidelity media handling, rich-text communication, and seamless multi-user synchronization.

---

## 🚀 Overview

This application is a highly realistic simulation of a modern workplace communication suite. It provides a robust, interactive environment for video meetings, real-time team chat, and advanced media management.

*   **Real-time Communication**: Integrated Socket.io engine for instant message delivery and meeting synchronization.
*   **High-Fidelity Media**: WebRTC-powered video and audio handling with robust hardware toggling and stability fixes.
*   **Advanced Rich Text**: A professional-grade chat editor supporting structural headings, vibrant color palettes, and smart link insertion.
*   **Enterprise UI/UX**: A pixel-perfect "Zoom Workplace" interface with floating panels, poppable windows, and ultra-compact layout density.

---

## ✨ Features

*   **💎 Advanced Rich Text Editor**: Full support for structural H1-H3 headings, neon color palettes, font scaling, and interactive hyperlink insertion.
*   **🎥 Robust Media Engine**: Reliable camera and microphone toggling with persistent video DOM management for instant hardware response.
*   **💬 Pro Chat Windows**: Poppable, draggable chat panels with "Force-Compact" message spacing and speaker-block grouping.
*   **🔄 Real-time Sync**: Instant global message broadcast and participant status updates using high-performance web sockets.
*   **🎨 Modern Design System**: Sleek dark/light mode integration with 3D glossy effects and smooth micro-animations.
*   **📁 Persistent Storage**: Full MongoDB integration for secure user authentication, message history, and meeting logs.

---

## ⚙️ How It Works

1.  **Initialization**: The app establishes a secure handshake with the Node.js backend and initializes the Socket.io connection.
2.  **Media Negotiation**: Upon joining, the browser requests camera/audio permissions and locks the media stream to a persistent DOM element to ensure zero-lag toggling.
3.  **Data Flow**: Chat messages are processed through a custom rich-text engine, converted to structural HTML, and broadcasted to all meeting participants in real-time.
4.  **UI Management**: A dynamic state-manager handles floating window coordinates, toolbar selection states, and layout density overrides.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Material-UI (MUI), Custom CSS-in-JS
*   **Real-time**: Socket.io-client
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose)
*   **Media**: WebRTC (navigator.mediaDevices)
*   **Styling**: Vanilla CSS (Pixel-perfect Zoom overrides)

---

## 📂 Project Structure

```text
zoom-meeting-platform/
├── backend/
│   ├── src/
│   │   ├── app.js             # Express server & Socket.io initialization
│   │   ├── controllers/       # Business logic & Socket managers
│   │   └── routes/            # API endpoints & authentication
│   └── .env                   # Environment configurations
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── VideoMeet.jsx  # Main Meeting & Rich-Text Engine
│   │   │   └── Landing.jsx    # Entry portal & Meeting join logic
│   │   ├── App.css            # Global "Zoom Workplace" design system
│   │   └── environment.js     # API & Socket endpoint config
│   └── public/                # Static assets & icons
└── README.md                  # Project Documentation
```

---

## 🔐 Security & Environment

Ensure you have a `.env` file in the `backend` directory containing your `MONGO_URL` and `PORT` to connect to your local or cloud MongoDB cluster.

> [!IMPORTANT]
> Do not commit `.env` files to version control.

---

## 📍 Connect & Contribute

Developed with ❤️ by **Amandeep Verma**.
📍 Saharanpur, India

<!-- update_zoom 1 -->

<!-- update_zoom 2 -->

<!-- update_zoom 3 -->

<!-- update_zoom 4 -->

<!-- update_zoom 5 -->

<!-- update_zoom 6 -->

<!-- update_zoom 7 -->

<!-- update_zoom 8 -->

<!-- update_zoom 9 -->

<!-- update_zoom 10 -->

<!-- update_zoom 11 -->

<!-- update_zoom 12 -->

<!-- update_zoom 13 -->

<!-- update_zoom 14 -->

<!-- update_zoom 15 -->

<!-- update_zoom 16 -->

<!-- update_zoom 17 -->

<!-- update_zoom 18 -->

<!-- update_zoom 19 -->

<!-- update_zoom 20 -->

<!-- update_zoom 21 -->

<!-- update_zoom 22 -->

<!-- update_zoom 23 -->

<!-- update_zoom 24 -->

<!-- update_zoom 25 -->

<!-- update_zoom 26 -->

<!-- update_zoom 27 -->

<!-- update_zoom 28 -->

<!-- update_zoom 29 -->

<!-- update_zoom 30 -->

<!-- update_zoom 31 -->

<!-- update_zoom 32 -->

<!-- update_zoom 33 -->

<!-- update_zoom 34 -->

<!-- update_zoom 35 -->

<!-- update_zoom 36 -->

<!-- update_zoom 37 -->

<!-- update_zoom 38 -->

<!-- update_zoom 39 -->

<!-- update_zoom 40 -->

<!-- update_zoom 41 -->

<!-- update_zoom 42 -->

<!-- update_zoom 43 -->

<!-- update_zoom 44 -->

<!-- update_zoom 45 -->

<!-- update_zoom 46 -->

<!-- update_zoom 47 -->

<!-- update_zoom 48 -->
