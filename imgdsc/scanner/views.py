from django.shortcuts import render
from django.http import JsonResponse
from .models import Document
from .utils import process_document
import os
from django.conf import settings

def index(self):
    return render(self, 'scanner/index.html')

def upload_and_process(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']
        doc = Document.objects.create(original_image=image)
        
        # Define output path for processed image
        filename = os.path.basename(doc.original_image.name)
        processed_filename = f"processed_{filename}"
        # Ensure the processed directory exists
        processed_dir = os.path.join(settings.MEDIA_ROOT, 'documents/processed')
        if not os.path.exists(processed_dir):
            os.makedirs(processed_dir)
            
        processed_path = os.path.join(processed_dir, processed_filename)
        
        # Process the image
        success = process_document(doc.original_image.path, processed_path)
        
        if success:
            doc.processed_image.name = f"documents/processed/{processed_filename}"
            doc.save()
            return JsonResponse({
                'success': True,
                'original_url': doc.original_image.url,
                'processed_url': doc.processed_image.url
            })
        else:
            return JsonResponse({'success': False, 'error': 'Image processing failed'})
            
    return JsonResponse({'success': False, 'error': 'Invalid request'})
