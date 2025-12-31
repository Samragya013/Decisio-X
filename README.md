# 🌌 Decisio X  
### *A Decision Intelligence Prototype*

> **Decisions don’t fail. Assumptions do.**

---

## 🚀 What is Decisio X?

**Decisio X** is a decision-intelligence prototype designed to help people think clearly under uncertainty.  
Instead of generating answers, it breaks complex personal and career decisions into **structured reasoning components**—assumptions, scenarios, risks, and confidence-weighted recommendations.

This project is built as a **privacy-first demo**, focused on clarity, responsibility, and real-world usefulness.

---

## 🧠 The Problem We’re Solving

Most people don’t struggle because they lack information.  
They struggle because they:

- Make decisions with **hidden assumptions**
- Don’t explore **failure scenarios**
- Overestimate certainty
- Have no clear point to **re-evaluate**

Existing tools provide *answers*.  
**Decisio X provides structured thinking.**

---

## ✨ What Makes Decisio X Different?

✔ Not a chatbot  
✔ Not advice automation  
✔ Not motivational fluff  

Instead, Decisio X acts as a **thinking system**.

It helps users:
- See *why* a recommendation exists  
- Understand *what could break it*  
- Decide *when to revisit the decision*

---

## 🔍 Core Capabilities

### 🧩 1. Decision Structuring  
Every decision is decomposed into:
- Objective  
- Constraints  
- Variables  
- Success criteria  

This turns vague choices into clear problem statements.

---

### 🧠 2. Assumption Mapping  
Hidden assumptions are:
- Explicitly identified  
- Labeled by reliability (Strong / Medium / Weak)  
- Flagged when risky  

This exposes the real drivers of decision failure.

---

### 🔮 3. Scenario Simulation  
Each decision is explored through:
- Best case  
- Base case  
- Failure case  

Including:
- Impact  
- Time cost  
- Opportunity cost  
- Recovery strategies  

---

### ⚖️ 4. Confidence-Weighted Recommendation  
Instead of absolute answers, Decisio X provides:
- A primary recommendation  
- A confidence score  
- Factors that could change the outcome  
- A clear re-evaluation trigger  

---

## 🛡️ Privacy-First by Design

🔒 **No authentication**  
🕒 **Temporary demo sessions only**  
🗑️ **No long-term data storage**  

User context (name, role, goals) exists **only for the active session** and is discarded when the session ends.

> This design ensures ethical use, transparency, and zero data risk during demos.

---

## 🎨 Design Philosophy

- 🌑 Dark, calm, analytical UI  
- 🧊 Glassmorphism panels  
- ✨ Subtle glow & particle effects  
- 🌌 Cosmic atmosphere (lightweight & performance-safe)  
- 📱 Fully responsive (desktop, tablet, mobile)  

Visuals are used to **support clarity**, never to distract.

---

## 📱 Cross-Device Experience

| Device | Experience |
|------|-----------|
| 🖥️ Desktop | Immersive, cinematic, depth-rich |
| 📱 Mobile | Clear, fast, distraction-free |
| 📲 Tablet | Balanced, touch-first |

Animations adapt based on device capability and accessibility preferences.

---

## 🛠️ Tech Stack

This project is built with a modern, lightweight, and performant stack designed for rapid development and a high-quality user experience, with a strong emphasis on frontend technologies and direct API integration.
### Frontend Framework & Language
# React: The core UI library for building the component-based, interactive user interface.
# TypeScript: Provides static typing to ensure code quality, catch errors early, and improve the developer experience with robust autocompletion and type-checking.
# Vite: The build tool and development server, chosen for its extremely fast Hot Module Replacement (HMR) and optimized production builds.

### AI & Core Logic
# Google Gemini API (@google/genai): The engine for the multi-stage decision intelligence pipeline. The application leverages the gemini-3-flash-preview model for its excellent balance of speed and analytical capability.
# JSON Schema Mode: This key feature of the Gemini API is used to force the model to return structured, predictable JSON. It's crucial for the application's stability, as it eliminates fragile string parsing and allows for the direct mapping of AI responses to UI components.

### Styling & Design
# Tailwind CSS: A utility-first CSS framework loaded via CDN to rapidly build the custom, responsive "cosmic space" theme directly within the component markup.
# Custom CSS Animations: Embedded within components to create the starfield background, nebula gradients, and subtle UI animations, enhancing the visual experience.
# Google Fonts: The Inter and Orbitron fonts are used to establish the application's clean, modern, and analytical typographic style.

### State & Session Management
# React Hooks (useState, useEffect): All component-level state and side effects are managed using React's native hooks.
# Browser sessionStorage: In strict alignment with the "temporary session" requirement, sessionStorage is used to persist user context only for the duration of the browser tab session, ensuring no data is retained after the user leaves.

### Module Loading & Deployment
# ESM via esm.sh: For this demo, core dependencies like react and @google/genai are loaded directly in the browser via an importmap. This simplifies the project setup by removing the need for a local node_modules folder during development.
# serve: A simple static file server included in the package.json. It's used in the npm start command to host the built application, making it compatible with "Web Service" deployment platforms like Render.


---

## 🎯 Example Use-Cases

- *Should I accept a low-paying startup role or wait?*  
- *Should I focus on DSA or Data Analytics for the next 4 months?*  
- *Should I pursue higher studies now or gain work experience first?*  

Decisio X is domain-agnostic — it works wherever **uncertainty + trade-offs** exist.

---

## 🏁 Why This Project Exists

Decisio X was built to explore a simple idea:

> **Better decisions come from better structure, not better answers.**

This prototype demonstrates how AI can **augment human judgment** responsibly—without replacing it.

---

## 📌 Status

🧪 Prototype / Demo  
🚀 Google for Startups submission  
🛠️ Designed for future product evolution  

---

## 🙌 Closing Note

Decisio X is not about telling users what to do.  
It’s about helping them **see clearly enough to decide for themselves**.

---

✨ *Think better. Decide better.*  
