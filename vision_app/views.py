from django.shortcuts import render
from .models import DetectionHistory
from .ai_model import detect_objects
from gtts import gTTS
import base64
from django.core.files.base import ContentFile
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, "index.html")


@csrf_exempt
def detect_api(request):
    if request.method == "POST":

        if 'image' in request.FILES:
            obj = DetectionHistory(image=request.FILES['image'])

        elif 'cam_image' in request.POST:
            data = request.POST['cam_image']
            format, imgstr = data.split(';base64,')
            img = ContentFile(base64.b64decode(imgstr), name='webcam.png')
            obj = DetectionHistory(image=img)

        else:
            return JsonResponse({"error": "No image"}, status=400)

        obj.save()

        counts = detect_objects(obj.image.path)

        sentence_parts = [f"{v} {k}" for k, v in counts.items()]
        #text = "Detected " + " and ".join(sentence_parts)
        print("Detected objects:", counts)
        
        if sentence_parts:
            text = "Detected " + " and ".join(sentence_parts)
        else:
            text = "No objects detected"

        tts = gTTS(text=text, lang='en')
        audio_path = f"media/audio/{obj.id}.mp3"
        tts.save(audio_path)

        obj.detected_objects = text
        obj.audio_file = f"audio/{obj.id}.mp3"
        obj.save()

        return JsonResponse({
            "objects": sentence_parts,
            "image": obj.image.url,
            "audio": obj.audio_file.url
        })
    
def history(request):
    data=DetectionHistory.objects.all().order_by('-date')
    return render(request,"history.html",{'data':data})


