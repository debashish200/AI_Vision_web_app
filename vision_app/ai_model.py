import torch
from collections import Counter

model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

def detect_objects(image_path):
    results = model(image_path)
    detections = results.pandas().xyxy[0]

    names = detections['name'].tolist()

    # Count objects
    counts = Counter(names)

    return counts
