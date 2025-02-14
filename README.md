
# Blockly Desktop Application

This project is a desktop application built using PyQt5 and Flask. Users can create Python code through a **Blockly** visual programming interface and execute the generated code.

## Features

- **Blockly Integration**: Drag-and-drop blocks to generate Python code.
- **Code Execution**: Run the generated code directly and view the output.
- **File Operations**:
  - Save and load XML files.
- **Dynamic UI**: A desktop application built with PyQt5.

## Requirements

To run this project, you need the following:

- Python 3.8 or higher
- PyQt5
- Flask
- Flask-cors
- PyQtWebEngine
- pyserial
- acrome-smd

## Installation

1. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/username/repository-name.git
   cd repository-name
   ```

3. Start the application by running the `app.py` file:

   ```bash
   python app.py
   ```

## Usage

1. Once the application is running, open your browser and navigate to **http://127.0.0.1:5000**.
2. Use the Blockly interface to create your code.
3. Click the "Run Code" button to execute the code and view the output.

## Compiling the Application into an EXE

You can convert the project into a standalone **.exe** file using PyInstaller:

1. Install **PyInstaller**:

   ```bash
   pip install pyinstaller
   ```

2. Run the following command to compile `app.py` into an **.exe** file:

   ```bash
   pyinstaller --noconsole --onefile --add-data "templates;templates" --add-data "static;static" app.py
   ```

   - `--noconsole`: Hides the console window.
   - `--onefile`: Creates a single `.exe` file.
   - `--add-data`: Includes template (`templates`) and static files (`static`) in the `.exe`.

3. Once the process is complete, you will find the `.exe` file in the `dist` directory.

4. **Using the EXE**:
   - Double-click the `app.exe` file to launch the application as a standalone desktop program.

## File Structure

```
project/
│
├── app.py              # PyQt5 and Flask integration
├── templates/
│   └── index.html      # HTML interface
├── static/
│   └── blockly/        # Blockly files
│     ├── script.js
│     ├── blockly_compressed.js
│     ├── blocks_compressed.js
│     ├── en.js
│     ├── python_compressed.js 
│     └── style.css       
├── dist/
│   └── app.exe         # Compiled executable file (created with PyInstaller)
└── README.md           # Project documentation
```

## Developer Notes

- **PyQt5 Web Channel**: Used to facilitate communication between the frontend and Python backend.
- **Flask API**: Handles code execution requests.

