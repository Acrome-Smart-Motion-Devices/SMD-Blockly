from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl, pyqtSlot, QObject, Qt
from PyQt5.QtWidgets import QApplication, QMainWindow, QFileDialog, QVBoxLayout, QWidget, QMessageBox
from PyQt5.QtWebChannel import QWebChannel
from PyQt5.QtGui import QIcon
import sys
from threading import Thread
from flask import Flask, render_template, request, jsonify
import subprocess
import os
import tempfile
import traceback
import uuid
import signal
import atexit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://127.0.0.1:5000", "http://localhost:5000"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

class TempFileManager:
    def __init__(self):
        self.temp_dir = os.path.join(tempfile.gettempdir(), '.blockly_temp')
        self.current_file = None
        self._ensure_temp_dir()
        atexit.register(self.cleanup)

    def _ensure_temp_dir(self):
        if not os.path.exists(self.temp_dir):
            os.makedirs(self.temp_dir)

    def generate_temp_file(self):
        try:
            self.current_file = os.path.join(self.temp_dir, f"{uuid.uuid4().hex}_temp_code.py")
            return self.current_file
        except Exception as e:
            return None

    def cleanup(self):
        try:
            if os.path.exists(self.temp_dir):
                for file in os.listdir(self.temp_dir):
                    try:
                        os.remove(os.path.join(self.temp_dir, file))
                    except:
                        pass
                os.rmdir(self.temp_dir)
        except:
            pass

class ProcessManager:
    def __init__(self):
        self.current_process = None

    def run_code(self, code, temp_file):
        try:
            self.kill_current_process()
            
            if not temp_file:
                return {"error": "Could not create temporary file", "details": "Please check disk space"}
            
            with open(temp_file, "w", encoding='utf-8') as f:
                f.write(code)
            
            self.current_process = subprocess.Popen(
                ["python", temp_file], 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                text=True,
                creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0
            )
            
            stdout, stderr = self.current_process.communicate(timeout=30)
            
            if stderr and stderr.strip():
                error_msg = self.handle_error(stderr)
                if error_msg:
                    return {"error": error_msg, "details": stderr.strip()}
            
            return {"output": stdout, "success": True}
            
        except Exception as e:
            return {"error": str(e), "details": traceback.format_exc()}

    def kill_current_process(self):
        if self.current_process and self.current_process.poll() is None:
            try:
                self.current_process.terminate()
                self.current_process.wait(timeout=1)
            except:
                try:
                    self.current_process.kill()
                except:
                    pass

    @staticmethod
    def handle_error(stderr):
        if not stderr or stderr.strip() == "":
            return None
            
        error_mapping = {
            "SyntaxError": "A syntax error occurred in the blocks. Please check the block logic.",
            "NameError": "A variable definition error occurred. Please ensure all variables are defined.",
            "PortNotOpenError": "Device port is not open. Please ensure your SMD device is properly connected.",
            "FileNotFoundError": "Required file not found. Please verify file paths.",
            "PermissionError": "Port access permission denied. Try running as administrator."
        }
        
        if "SerialException" in stderr:
            return None
            
        for error_type, message in error_mapping.items():
            if error_type in stderr:
                if "warning" in stderr.lower() or "info" in stderr.lower():
                    return None
                return message
                
        if "warning" in stderr.lower() or "info" in stderr.lower():
            return None
            
        return f"An unexpected error occurred: {stderr.strip()}" if stderr.strip() else None

temp_manager = TempFileManager()
process_manager = ProcessManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_code', methods=['POST'])
def run_code():
    code = request.json.get('code')
    if not code:
        return jsonify({"error": "No code found"})
    
    temp_file = temp_manager.generate_temp_file()
    result = process_manager.run_code(code, temp_file)
    return jsonify(result)

class Backend(QObject):
    def __init__(self, parent=None):
        super().__init__(parent)
    
    @pyqtSlot(str)
    def saveBlocksToFile(self, xmlText):
        try:
            options = QFileDialog.Options()
            fileName, _ = QFileDialog.getSaveFileName(
                None,
                "Save XML File",
                "",
                "XML Files (*.xml)",
                options=options
            )
            
            if fileName:
                if not fileName.endswith('.xml'):
                    fileName += '.xml'
                with open(fileName, "w", encoding='utf-8') as file:
                    file.write(xmlText)
                QMessageBox.information(None, "Success", "File saved successfully.")
        except Exception as e:
            QMessageBox.critical(None, "Error", f"Error occurred while saving file: {str(e)}")

    @pyqtSlot(str)
    def savePythonCode(self, pythonCode):
        try:
            options = QFileDialog.Options()
            fileName, _ = QFileDialog.getSaveFileName(
                None,
                "Save Python File",
                "",
                "Python Files (*.py)",
                options=options
            )
            
            if fileName:
                if not fileName.endswith('.py'):
                    fileName += '.py'
                with open(fileName, "w", encoding='utf-8') as file:
                    file.write(pythonCode)
                QMessageBox.information(None, "Success", "Python code saved successfully.")
        except Exception as e:
            QMessageBox.critical(None, "Error", f"Error occurred while saving Python file: {str(e)}")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.init_ui()
        self.setup_web_engine()
        self.setup_signal_handlers()

    def init_ui(self):
        self.setWindowTitle("SMD Blockly")
        self.setGeometry(100, 100, 1024, 768)
        
        # Pencere simgesini ayarlayın
        icon_path = "static/images/smd-logo.png"
        self.setWindowIcon(QIcon(icon_path))
        
        # QWebEngineView oluşturun ve HTML dosyasını yükleyin
        self.browser = QWebEngineView()
        html_file_path = "file:///templates/index.html"
        self.browser.setUrl(QUrl(html_file_path))
        
        # QWebEngineView'i merkezi widget olarak ayarlayın
        self.setCentralWidget(self.browser)

        layout = QVBoxLayout()
        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

    def setup_web_engine(self):
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl("http://127.0.0.1:5000"))
        self.centralWidget().layout().addWidget(self.browser)

        self.backend = Backend()
        self.channel = QWebChannel()
        self.channel.registerObject("backend", self.backend)
        self.browser.page().setWebChannel(self.channel)

    def setup_signal_handlers(self):
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)

    def signal_handler(self, signum, frame):
        self.cleanup_and_exit()

    def closeEvent(self, event):
        self.cleanup_and_exit()

    def cleanup_and_exit(self):
        process_manager.kill_current_process()
        temp_manager.cleanup()
        try:
            if os.name == 'nt':
                os.system(f'taskkill /F /PID {os.getpid()}')
            else:
                os.kill(os.getpid(), signal.SIGTERM)
        except:
            sys.exit(0)

def run_flask():
    app.run(debug=False, use_reloader=False)

if __name__ == '__main__':
    try:
        flask_thread = Thread(target=run_flask, daemon=True)
        flask_thread.start()
        
        qt_app = QApplication(sys.argv)
        window = MainWindow()
        window.show()
        sys.exit(qt_app.exec_())
    except Exception as e:
        raise