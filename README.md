# Gemini CLI Web GUI

A modern web-based graphical user interface for the Gemini CLI, transforming the command-line tool into an intuitive, accessible web application.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- pnpm

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd gemini-web-backend
   source venv/bin/activate
   python src/main.py
   ```

2. **Access the Application**
   Open your browser and go to: **http://localhost:5000**

## ✨ Features

- **🔐 Multiple Authentication Methods**: OAuth, API Key, Vertex AI
- **💬 Interactive Chat Interface**: Real-time messaging with AI
- **📁 File Management**: Drag-and-drop file upload and analysis
- **🎨 Modern UI/UX**: Professional design with light/dark themes
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **⌨️ Command System**: Slash commands with auto-completion
- **🔍 File Explorer**: Browse and manage project files
- **♿ Accessibility**: Full keyboard navigation and screen reader support

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Flask + Python + Google Generative AI
- **Database**: SQLite (for sessions and user data)
- **Deployment**: Full-stack web application

## 📖 Documentation

See [gemini-web-gui-documentation.md](./gemini-web-gui-documentation.md) for complete documentation including:
- Detailed feature descriptions
- Technical architecture
- API documentation
- Deployment guides
- Security features
- Performance optimizations

## 🎯 Key Benefits

- **User-Friendly**: No terminal knowledge required
- **Cross-Platform**: Works on any device with a web browser
- **Accessible**: Designed for users of all skill levels
- **Scalable**: Ready for multi-user deployment
- **Modern**: Contemporary web technologies and design patterns

## 📁 Project Structure

```
├── gemini-web-backend/          # Flask backend application
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Database models
│   │   ├── static/             # Built frontend files
│   │   └── main.py             # Flask app entry point
│   ├── venv/                   # Python virtual environment
│   └── requirements.txt        # Python dependencies
├── gemini-web-gui/             # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API communication
│   │   └── App.jsx             # Main app component
│   ├── dist/                   # Built frontend files
│   └── package.json            # Node.js dependencies
└── gemini-cli/                 # Original CLI source code
```

## 🔧 Development

### Backend Development
```bash
cd gemini-web-backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Frontend Development
```bash
cd gemini-web-gui
pnpm install
pnpm run dev
```

### Building for Production
```bash
# Build frontend
cd gemini-web-gui
pnpm run build

# Copy to backend static directory
cp -r dist/* ../gemini-web-backend/src/static/
```

## 🌟 Screenshots

The application features a clean, modern interface with:
- Professional authentication dialog
- Interactive chat interface with file explorer sidebar
- Responsive design that works on all devices
- Light and dark theme support
- Intuitive file upload and management

## 🤝 Contributing

This project demonstrates the transformation of a CLI tool into a modern web application. The codebase is well-documented and follows best practices for both frontend and backend development.

## 📄 License

This project is based on the original Gemini CLI which is licensed under Apache 2.0. The web interface additions maintain the same license.

## 🔗 Related Links

- [Original Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Note**: This is a demonstration project showing how to transform a command-line interface into a modern web application. For production use with real Gemini API integration, ensure proper API key configuration and security measures.

