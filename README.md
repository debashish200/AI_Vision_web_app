🧠 AI Smart Vision Web App
An AI-powered Django web application that detects objects from uploaded images or webcam captures using a YOLO deep learning model and provides results in both text and voice format.

📌 Features
---------------
📸 Upload image or capture from webcam
🧠 Object detection using YOLO (pretrained on COCO dataset)
🔢 Object counting (e.g., “2 persons and 1 car detected”)
🔊 Text-to-Speech output using gTTS
💾 Detection history stored in database
🖼 Displays detected image, objects, and audio
🕒 History page to view past detections

🛠 Tech Stack
-------------
Backend: Django
AI Model: YOLOv5 (PyTorch)
Frontend: HTML, JavaScript
Database: SQLite
Text-to-Speech: gTTS
Image Processing: OpenCV, Pillow

⚙️ Installation & Setup
------------------------
1️⃣ Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate   # Windows
2️⃣ Install dependencies
pip install django torch torchvision ultralytics opencv-python pillow gtts
3️⃣ Run migrations
python manage.py makemigrations
python manage.py migrate
4️⃣ Start server
python manage.py runserver
Open browser:
http://127.0.0.1:8000/

🧪 How It Works
----------------
User uploads image or captures from webcam
Image is saved to server
YOLO model detects objects
Objects are counted
Result is converted to speech
Image + result + audio saved in database
Result page is shown
History page displays past detections
