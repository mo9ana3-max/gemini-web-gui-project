import os
import json
import time
from flask import Blueprint, request, jsonify, session
from datetime import datetime
import google.generativeai as genai
from werkzeug.utils import secure_filename

gemini_bp = Blueprint('gemini', __name__)

# Configure Gemini API (this would be set via environment variables in production)
UPLOAD_FOLDER = '/tmp/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'py', 'js', 'html', 'css', 'md', 'json'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@gemini_bp.route('/auth', methods=['POST'])
def authenticate():
    """Handle authentication for different methods"""
    try:
        data = request.get_json()
        auth_type = data.get('type')
        
        if auth_type == 'oauth':
            # Simulate OAuth authentication
            session['user'] = {
                'id': 'demo_user',
                'name': 'Demo User',
                'email': 'demo@example.com',
                'auth_type': 'oauth'
            }
            return jsonify({
                'success': True,
                'user': session['user'],
                'message': 'OAuth authentication successful'
            })
            
        elif auth_type == 'api_key':
            api_key = data.get('apiKey')
            if not api_key:
                return jsonify({'success': False, 'error': 'API key is required'}), 400
            
            try:
                # Configure Gemini with the provided API key
                genai.configure(api_key=api_key)
                
                # Test the API key by making a simple request
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content("Hello")
                
                session['user'] = {
                    'id': 'api_user',
                    'name': 'API User',
                    'email': 'api@example.com',
                    'auth_type': 'api_key'
                }
                session['api_key'] = api_key
                
                return jsonify({
                    'success': True,
                    'user': session['user'],
                    'message': 'API key authentication successful'
                })
                
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'Invalid API key: {str(e)}'
                }), 401
                
        elif auth_type == 'vertex_ai':
            api_key = data.get('apiKey')
            project_id = data.get('projectId')
            
            if not api_key or not project_id:
                return jsonify({
                    'success': False,
                    'error': 'API key and project ID are required'
                }), 400
            
            # Simulate Vertex AI authentication
            session['user'] = {
                'id': 'vertex_user',
                'name': 'Vertex AI User',
                'email': 'vertex@example.com',
                'auth_type': 'vertex_ai'
            }
            session['api_key'] = api_key
            session['project_id'] = project_id
            
            return jsonify({
                'success': True,
                'user': session['user'],
                'message': 'Vertex AI authentication successful'
            })
            
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid authentication type'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Authentication failed: {str(e)}'
        }), 500

@gemini_bp.route('/logout', methods=['POST'])
def logout():
    """Handle user logout"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@gemini_bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages with Gemini"""
    try:
        if 'user' not in session:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        data = request.get_json()
        message = data.get('message', '')
        files = data.get('files', [])
        
        if not message and not files:
            return jsonify({'success': False, 'error': 'Message or files required'}), 400
        
        # For demo purposes, return a mock response
        # In a real implementation, this would call the Gemini API
        response_text = f"""I received your message: "{message}"

This is a demo response from the Gemini CLI Web Backend. In a real implementation, this would:

1. **Process your message** using the Gemini API
2. **Handle file uploads** and analyze them if provided
3. **Execute commands** if you used slash commands like /help, /search, etc.
4. **Maintain conversation context** across multiple messages
5. **Support various file types** including code, images, documents

**Available Features:**
- Natural language conversations
- Code analysis and generation  
- File upload and analysis
- Slash commands (/help, /search, /code, etc.)
- Multi-turn conversations with context
- Authentication with Google, API keys, or Vertex AI

Would you like to test any specific functionality?"""

        return jsonify({
            'success': True,
            'response': response_text,
            'timestamp': datetime.now().isoformat(),
            'message_id': f"msg_{int(time.time())}"
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Chat processing failed: {str(e)}'
        }), 500

@gemini_bp.route('/upload', methods=['POST'])
def upload_file():
    """Handle file uploads"""
    try:
        if 'user' not in session:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = str(int(time.time()))
            filename = f"{timestamp}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Get file info
            file_size = os.path.getsize(filepath)
            file_info = {
                'filename': file.filename,
                'stored_filename': filename,
                'size': file_size,
                'upload_time': datetime.now().isoformat(),
                'path': filepath
            }
            
            return jsonify({
                'success': True,
                'file': file_info,
                'message': f'File {file.filename} uploaded successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'File type not allowed'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'File upload failed: {str(e)}'
        }), 500

@gemini_bp.route('/files', methods=['GET'])
def list_files():
    """List uploaded files"""
    try:
        if 'user' not in session:
            return jsonify({'success': False, 'error': 'Not authenticated'}), 401
        
        files = []
        if os.path.exists(UPLOAD_FOLDER):
            for filename in os.listdir(UPLOAD_FOLDER):
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                if os.path.isfile(filepath):
                    stat = os.stat(filepath)
                    files.append({
                        'filename': filename,
                        'size': stat.st_size,
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
                    })
        
        return jsonify({
            'success': True,
            'files': files
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to list files: {str(e)}'
        }), 500

@gemini_bp.route('/commands', methods=['GET'])
def get_commands():
    """Get available slash commands"""
    commands = [
        {'command': '/help', 'description': 'Show available commands'},
        {'command': '/clear', 'description': 'Clear conversation history'},
        {'command': '/model', 'description': 'Switch AI model'},
        {'command': '/settings', 'description': 'Open settings'},
        {'command': '/export', 'description': 'Export conversation'},
        {'command': '/search', 'description': 'Search with Google'},
        {'command': '/file', 'description': 'Analyze file'},
        {'command': '/code', 'description': 'Generate code'},
    ]
    
    return jsonify({
        'success': True,
        'commands': commands
    })

@gemini_bp.route('/status', methods=['GET'])
def get_status():
    """Get current session status"""
    return jsonify({
        'authenticated': 'user' in session,
        'user': session.get('user'),
        'timestamp': datetime.now().isoformat()
    })

