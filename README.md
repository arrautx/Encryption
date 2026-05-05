# 🖼️ Image Downloader

A minimal, dark-themed web tool to paste or drag-and-drop an image and instantly download it with a custom filename.

---

## 📸 Screenshots

### 1. Paste Zone
![Paste to Download](https://github.com/user-attachments/assets/727ef334-c053-47c0-9985-d830aeeea4ff)

### 2. Preview & Download
![Preview and Download](https://github.com/user-attachments/assets/e0efe25c-1b1d-49b3-9415-dfdc85eaec96)

---

## ✨ Features

- 📋 **Paste to download** — paste any image directly with `Ctrl+V`
- 🖱️ **Drag and drop** — drop an image file onto the zone
- 🖼️ **Live preview** — instantly see the image before downloading
- ✏️ **Custom filename** — edit the filename before saving
- 📄 **MIME type display** — shows detected image format (e.g. `image/webp`)
- 💾 **One-click download** — saves the image to your device instantly

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/image-downloader.git
cd image-downloader
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ How to Use

1. **Paste** an image using `Ctrl+V`, or **drag and drop** an image file onto the zone
2. A **preview** of the image will appear
3. Edit the **filename** in the input field if needed
4. Click the **Download** button to save the image

---

## 🏗️ Tech Stack

- [React](https://react.dev/) — UI framework
- [TypeScript](https://www.typescriptlang.org/) — type safety
- [Vite](https://vitejs.dev/) — build tool

---

## 📁 Project Structure

```
project/
 ├─ node_modules/
 ├─ src/
 │   ├─ App.tsx
 │   ├─ main.tsx
 │   ├─ index.css
 │   ├─ utils/
 ├─ index.html   
 ├─ package.json
 ├─ tsconfig.json
 ├─ vite.config.ts
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
