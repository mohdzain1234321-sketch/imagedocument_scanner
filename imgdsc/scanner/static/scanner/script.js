const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const processingUI = document.getElementById('processing');
const uploadUI = document.getElementById('drop-zone');
const resultUI = document.getElementById('result');

const originalPreview = document.getElementById('original-preview');
const processedPreview = document.getElementById('processed-preview');
const downloadBtn = document.getElementById('download-btn');

// Handle click on drop zone
dropZone.onclick = () => fileInput.click();

// Handle file selection
fileInput.onchange = (e) => {
    if (e.target.files.length > 0) {
        uploadFile(e.target.files[0]);
    }
};

// Drag and drop logic
dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#6366f1";
    dropZone.style.background = "#1e293b";
};

dropZone.ondragleave = () => {
    dropZone.style.borderColor = "#334155";
    dropZone.style.background = "#1e293b";
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        uploadFile(e.dataTransfer.files[0]);
    }
};

function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));

    uploadUI.style.display = 'none';
    processingUI.style.display = 'block';

    fetch('/upload/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            originalPreview.src = data.original_url;
            processedPreview.src = data.processed_url;
            downloadBtn.href = data.processed_url;
            
            processingUI.style.display = 'none';
            resultUI.style.display = 'block';
        } else {
            alert('Error: ' + data.error);
            resetUI();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during upload.');
        resetUI();
    });
}

function resetUI() {
    uploadUI.style.display = 'block';
    processingUI.style.display = 'none';
    resultUI.style.display = 'none';
    fileInput.value = '';
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
