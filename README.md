# 🌿 Mindful Workspace

A soft, minimalist task manager and productivity suite designed for focus and clarity. This application provides a distraction-free environment to manage your daily tasks, notes, and focus sessions.

## ✨ Features

- **✅ Task Management**: Create, track, and manage daily and upcoming tasks with priority levels and categories.
- **🕒 Focus Timer**: A built-in Pomodoro-style timer (25m Focus / 5m Break) to keep you in the flow.
- **📅 Visual Calendar**: Integrated schedule view to see your workload across the month.
- **📝 Zen Notes**: A minimalist note-taking system with pinning and categorization.
- **📊 Productivity Insights**: Live analytics calculated from your real task data.
- **🎨 Premium Aesthetic**: Clean, responsive UI with glassmorphism and smooth animations.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (installed with Node.js)

### Installation
1. Clone the repository or download the source code.
2. Open your terminal in the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the local development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 📱 Android Deployment

To turn this web app into an Android application, we use **Capacitor**.

### Prerequisites
- **Android Studio**: [Download & Install](https://developer.android.com/studio)
- **Android SDK**: Configured via Android Studio.

### Step-by-Step Deployment
1. **Build the production web assets**:
   ```bash
   npm run build
   ```
2. **Install Capacitor dependencies** (if not already installed):
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
3. **Initialize Capacitor**:
   ```bash
   npx cap init
   ```
4. **Add the Android platform**:
   ```bash
   npx cap add android
   ```
5. **Sync your web code to the Android project**:
   ```bash
   npx cap sync
   ```
6. **Open in Android Studio to build the APK**:
   ```bash
   npx cap open android
   ```

---

## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Date Handling**: date-fns
- **Charts**: Recharts

---

## 📄 License
MIT
