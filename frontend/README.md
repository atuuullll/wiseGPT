# 🎨 LLM Content Generator - React Frontend

A beautiful, modern React application for interacting with the LLM Content Generator API.

## ✨ Features

- **Modern UI** - Built with React and Tailwind CSS
- **Real-time API Integration** - Directly communicates with Flask backend
- **Server Status Monitoring** - Real-time connection status indicator
- **Content Actions** - Copy and download generated content
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Visual feedback during content generation
- **Error Handling** - User-friendly error messages

## 🚀 Quick Start

### Prerequisites

You need Node.js and npm installed on your system.

- **Download Node.js**: https://nodejs.org/ (LTS version recommended)
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install:
   - React 18.2.0
   - Vite (fast build tool)
   - Tailwind CSS (styling)
   - Axios (HTTP client)

### Running the Development Server

1. **Make sure your Flask backend is running**:
   ```bash
   # In the main project directory
   python server.py
   ```

2. **Start the React development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── package.json            # Dependencies
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   ├── components/        # Reusable React components
│   │   ├── ContentForm.jsx      # Form for user input
│   │   └── ContentDisplay.jsx   # Display generated content
│   └── services/          # API communication
│       └── api.js         # Flask API client
└── README.md              # This file
```

## 🎯 Components

### ContentForm
- Topic input field (up to 500 characters)
- Content type dropdown selector
- Real-time character counter
- Server status indicator
- Generate button with loading state

### ContentDisplay
- Displays generated content with formatting
- Shows topic and content type
- Copy to clipboard button
- Download as TXT file button
- Error and loading state displays

### API Service
- `generateContent(topic, contentType)` - Generate any content type
- `generateBlog(topic)` - Generate a blog post
- `generateSummary(topic)` - Generate a technical summary
- `checkHealth()` - Check server connection

## 🔧 Configuration

### Backend URL
The frontend is configured to connect to `http://localhost:5000`.

To change the backend URL, edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:5000'
```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the color scheme.

### Typography
Edit `src/index.css` to modify fonts and text styles.

### Layout
Modify `src/App.jsx` to change the overall layout and structure.

## 🐛 Troubleshooting

**Issue**: "Cannot connect to server"
- **Solution**: Make sure Flask backend is running on `http://localhost:5000`
- Run: `python server.py`

**Issue**: "npm: command not found"
- **Solution**: Install Node.js from https://nodejs.org/

**Issue**: Port 3000 already in use
- **Solution**: Vite will automatically use the next available port
- Or change the port in `vite.config.js`

**Issue**: Module not found errors
- **Solution**: Delete `node_modules/` and run `npm install` again

## 📦 Dependencies

- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM rendering
- **axios** (1.6.0) - HTTP client
- **vite** (5.0.0) - Build tool
- **tailwindcss** (3.3.0) - CSS framework
- **tailwindcss** plugins - PostCSS support

## 🎓 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/)

## 📝 Notes

- The app automatically checks server health every 5 seconds
- Character limit for topics is 500 characters
- Content is generated on-demand by the backend API
- Generated content can be copied to clipboard or downloaded as a text file

## 🚀 Production Deployment

To deploy this frontend to production:

1. Build the app:
   ```bash
   npm run build
   ```

2. The built files are in the `dist/` folder

3. Deploy to any static hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any web server (Nginx, Apache, etc.)

4. Update the backend URL in `src/services/api.js` to your production backend URL

## 📄 License

This project is open source and available under the MIT License.
