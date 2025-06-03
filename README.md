# 🧠✈️ AI Trip Planner

Plan your dream trip in seconds with AI! This web app uses **Google Gemini AI**, **Google Auth**, and **SerpAPI** to help users discover and plan ideal itineraries, powered by a serverless backend.

---

![image](https://github.com/user-attachments/assets/e7257c6f-d8c8-444e-a9d8-496a6788a5e9)


---

## 🚀 Features

- 🌍 AI-powered trip planning with Gemini  
- 🔐 Google Sign-In using OAuth Client ID  
- 📍 Destination discovery via SerpAPI (Google Places)  
- ☁️ Serverless backend (Vercel Functions)  
- 🧠 Smart itinerary suggestions by Gemini  
- 🎨 Responsive UI with Tailwind CSS  
- ⚡ Lightning-fast dev experience with Vite  

---

## 🛠️ Tech Stack

| Layer       | Tech |
|-------------|------|
| Frontend    | [React](https://reactjs.org/) |
| Styling     | [Tailwind CSS](https://tailwindcss.com/) |
| Auth        | [Google OAuth Client ID](https://developers.google.com/identity) |
| AI Engine   | [Google Gemini API](https://ai.google.dev/) |
| Places API  | [SerpAPI](https://serpapi.com/google-places-api) |
| Hosting/API | [Vercel (Serverless)](https://vercel.com/) |
| Build Tool  | [Vite](https://vitejs.dev/) |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-trip-planner.git
cd ai-trip-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root with:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SERPAPI_KEY=your_serpapi_key
VITE_BACKEND_API=https://your-vercel-serverless-endpoint.vercel.app/api
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm run build
vercel --prod
```

---

## 🔐 Google Auth Flow

- Auth handled using Google OAuth Client ID
- Token returned and stored in browser context
- Secure routes are protected via frontend checks
- Logout clears token and resets state

---

## 🧠 AI Integration (Gemini)

- Uses user prompts to generate daily itineraries
- Responds with optimized activities, travel tips
- API request sent via secure serverless function

---

## 📍 Location Discovery (SerpAPI)

- Place names searched via SerpAPI
- Supports destination lookup, popular spots, geo-tags
- Places used as prompt context for Gemini

---

## 📁 Folder Structure

```
ai-trip-planner/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/        # Gemini, Auth, SerpAPI
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── api/                 # Vercel serverless functions
├── .env
└── vite.config.js
```

---

## 🧪 To-Do / Roadmap

- [ ] PDF export of full itinerary
- [ ] Map integration for routes
- [ ] Re-plan day with user feedback
- [ ] Travel cost estimator

---

## 🔗 Connect

- [Portfolio](https://portfolio-website-nedy.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/dayanand-rathod)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
