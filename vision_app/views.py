from django.shortcuts import render
from .models import DetectionHistory
from .ai_model import detect_objects
from gtts import gTTS
import base64
from django.core.files.base import ContentFile

def index(request):
    return render(request, "index.html")

def detect(request):
    if request.method == "POST":

        # CASE 1: Image Upload
        if 'image' in request.FILES:
            image = request.FILES['image']
            obj = DetectionHistory(image=image)

        # CASE 2: Webcam Capture
        elif 'cam_image' in request.POST:
            data = request.POST['cam_image']
            format, imgstr = data.split(';base64,')
            img = ContentFile(base64.b64decode(imgstr), name='webcam.png')
            obj = DetectionHistory(image=img)

        else:
            return render(request, "index.html", {
                "error": "No image received"
            })

        obj.save()

        counts = detect_objects(obj.image.path)

        sentence_parts = []
        for k, v in counts.items():
            sentence_parts.append(f"{v} {k}")

        text = "Detected " + " and ".join(sentence_parts)

        tts = gTTS(text=text, lang='en')
        audio_path = f"media/audio/{obj.id}.mp3"
        tts.save(audio_path)

        obj.detected_objects = text
        obj.audio_file = f"audio/{obj.id}.mp3"
        obj.save()

        return render(request, "result.html", {
            "objects":sentence_parts,
            "image": obj.image.url,
            "audio": obj.audio_file.url
        })

    
def history(request):
    data=DetectionHistory.objects.all().order_by('-date')
    return render(request,"history.html",{'data':data})


