# 🚀 Frontend Setup Guide

This guide will help you set up and run the React frontend for the LLM Content Generator.

## 📋 Requirements

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Python backend** running on `http://localhost:5000`

## 🔧 Step-by-Step Setup

### Step 1: Install Node.js

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React
- Vite
- Tailwind CSS
- Axios
- And more...

### Step 4: Ensure Backend is Running

In a separate terminal, start your Flask backend:

```bash
# From the main project directory (Python01)
python server.py
```

You should see:
```
Server running at http://localhost:5000
```

### Step 5: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### Step 6: Open in Browser

Visit: **http://localhost:3000**

You should see the beautiful React frontend! 🎉

---

## 📖 Available Commands

### Development
```bash
npm run dev        # Start development server (http://localhost:3000)
```

### Production Build
```bash
npm run build      # Create optimized production build
npm run preview    # Preview the production build locally
```

---

## 🎨 Frontend Architecture

```
frontend/
├── src/
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles with Tailwind
│   ├── components/
│   │   ├── ContentForm.jsx        # Form component for input
│   │   └── ContentDisplay.jsx     # Display component for output
│   └── services/
│       └── api.js                 # Backend API integration
├── index.html                     # HTML template
├── vite.config.js                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

---

## 🔗 How Frontend Communicates with Backend

1. **User enters topic** in the form
2. **Selects content type** from dropdown
3. **Clicks "Generate Content"** button
4. **Frontend sends request** to backend API
5. **Backend generates content** using Google Gemini
6. **Frontend receives response** and displays it

### API Endpoint Used

```
POST http://localhost:5000/generate
{
  "topic": "Artificial Intelligence",
  "content_type": "blog post"
}
```

---

## 🎯 Features

✅ **Real-time Server Status** - Green indicator when backend is connected
✅ **Character Counter** - Shows characters used for topic (up to 500)
✅ **Multiple Content Types** - Blog, Article, Summary, News, Social Media
✅ **Copy to Clipboard** - One-click copy of generated content
✅ **Download Content** - Save generated content as .txt file
✅ **Loading States** - Visual feedback during generation
✅ **Error Handling** - User-friendly error messages
✅ **Responsive Design** - Works on all screen sizes

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- **Check**: Is Flask backend running on port 5000?
- **Run**: `python server.py` in a separate terminal

### "Port 3000 already in use"
- Vite will automatically use the next available port (3001, 3002, etc.)
- Or kill the process using port 3000

### npm: command not found
- **Install** Node.js from https://nodejs.org/
- **Restart** your terminal after installation

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

---

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Getting Started](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Guide](https://axios-http.com/docs/intro)

---

## 🚀 Production Deployment

When ready to deploy:

1. **Build optimized version**:
   ```bash
   npm run build
   ```

2. **Output folder**: `dist/`

3. **Deploy to**:
   - Vercel (free, recommended)
   - Netlify (free)
   - GitHub Pages (free)
   - AWS, Firebase, etc.

4. **Update backend URL**:
   - Edit `src/services/api.js`
   - Change `API_BASE_URL` to your production backend URL

---

## 💡 Tips

- Keep both frontend (port 3000) and backend (port 5000) running during development
- Use browser DevTools (F12) to debug issues
- Check the browser console for error messages
- The frontend auto-reloads when you save files (hot reload)

---

## ✨ Next Steps

1. **Run setup**: Follow steps 1-6 above
2. **Test form**: Enter a topic and generate content
3. **Explore features**: Try copy, download buttons
4. **Customize**: Edit colors, fonts in config files
5. **Deploy**: When ready, build and deploy to your server

---

Happy coding! 🚀
