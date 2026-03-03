from django.db import models
import os

class Document(models.Model):
    original_image = models.ImageField(upload_to='documents/original/')
    processed_image = models.ImageField(upload_to='documents/processed/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document {self.id} - {self.uploaded_at}"

    def delete(self, *args, **kwargs):
        # Delete the actual files from the filesystem
        if self.original_image:
            if os.path.isfile(self.original_image.path):
                os.remove(self.original_image.path)
        if self.processed_image:
            if os.path.isfile(self.processed_image.path):
                os.remove(self.processed_image.path)
        super().delete(*args, **kwargs)
