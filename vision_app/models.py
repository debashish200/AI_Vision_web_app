from django.db import models

# Create your models here.


class DetectionHistory(models.Model):
    image=models.ImageField(upload_to='uploads/')
    detected_objects=models.TextField()
    audio_file=models.FileField(upload_to="audio/")
    date=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.detected_objects
    
    