function makeBubbleDraggable(bubble) {
    let isDragging = false;
    let wasDragged = false;
    let offsetY;

    // Load position from local storage if available
    const savedPosition = JSON.parse(localStorage.getItem('bubblePosition'));
    if (savedPosition) {
        bubble.style.top = `${savedPosition.y}px`;
    }

    // Function to disable text selection
    function disableTextSelection() {
        document.body.style.userSelect = 'none';
    }

    // Function to enable text selection
    function enableTextSelection() {
        document.body.style.userSelect = 'all';
    }

    // Mouse down event to start dragging
    bubble.addEventListener('mousedown', (e) => {
        isDragging = true;
        wasDragged = false; // Reset the dragged state
        offsetY = e.clientY - bubble.getBoundingClientRect().top;
        disableTextSelection(); // Disable text selection
    });

    // Mouse move event to handle dragging
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            wasDragged = true; // Set dragged state to true when moving
            const y = e.clientY - offsetY;
            bubble.style.top = `${y}px`;
        }
    });

    // Mouse up event to stop dragging and save position
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            enableTextSelection(); // Enable text selection
            bubble.style.cursor = 'grab';
            if (wasDragged) {
                // Save the new position in local storage
                const position = {
                    y: bubble.getBoundingClientRect().top
                };
                localStorage.setItem('bubblePosition', JSON.stringify(position));
            }
        }
    });

    // Click event only if the bubble was not dragged
    bubble.addEventListener('click', (e) => {
        if (!wasDragged) {
            alert('Click on an image or video to check for deepfakes.');
            enableMediaSelection(); // Your function to trigger deepfake detection
        }
    });
}

// Function to create the floating action bubble
function createFloatingBubble() {
    const bubble = document.createElement('div');
    bubble.id = 'deepfake-detect-bubble';
    bubble.setAttribute('aria-label', 'Check for deepfakes'); // Accessibility
    bubble.setAttribute('role', 'button'); // Accessibility
    bubble.title = 'Click to start selecting media for deepfake detection';

    bubble.innerHTML = '<i class="fas fa-search"> D </i>';

    makeBubbleDraggable(bubble);
    
    document.body.appendChild(bubble);
}

// Function to enable selection of media elements
function enableMediaSelection() {
    const mediaElements = [...document.querySelectorAll('img, video')];
    
    mediaElements.forEach(media => {
        media.style.outline = '2px solid #ff0000';
        media.style.cursor = 'pointer';

        // Add click event listener to media elements
        media.addEventListener('click', function handleMediaClick(event) {
            event.stopPropagation();
            event.preventDefault();

            // Perform deepfake detection on the selected media
            detectDeepfake(media);

            // Reset styles and remove click event after selection
            media.style.outline = '';
            media.style.cursor = '';
            media.removeEventListener('click', handleMediaClick);
        }, { once: true });
    });

    // Click outside to cancel selection
    document.addEventListener('click', cancelMediaSelection, { once: true });
}

// Function to cancel the media selection mode
function cancelMediaSelection() {
    const mediaElements = [...document.querySelectorAll('img, video')];
    mediaElements.forEach(media => {
        media.style.outline = '';
        media.style.cursor = '';
    });
}

// Function to perform deepfake detection
function detectDeepfake(media) {
    if (media.tagName.toLowerCase() === 'img') {
        const imageUrl = media.src;
        downloadImageAndSendToModel(imageUrl);
        alert(`Checking image for deepfake: ${imageUrl}`);
    } else if (media.tagName.toLowerCase() === 'video') {
        const videoUrl = media.src;
        alert(`Checking video for deepfake: ${videoUrl}`);
        extractFramesFromVideo(media);
    }
}

// Function to download the image and send to the model
function downloadImageAndSendToModel(imageUrl) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const formData = new FormData();
            formData.append('file', blob, 'image.png');

            // Send the image data to your cloud-hosted model for detection
            sendImageToModel(formData);
        })
        .catch(error => console.error('Error downloading image:', error));
}

// Function to send the downloaded image to your model
function sendImageToModel(formData) {
    const apiUrl = 'https://kxngh-sih-deepsecure.hf.space/api/predict'; // Update if needed

    fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the model
        console.log(data); // For debugging purposes
        if (data && data.isDeepfake) {
            alert('Deepfake detected!');
        } else {
            alert('No deepfake detected.');
        }
    })
    .catch(error => console.error('Error sending image to model:', error));
}

// Function to extract frames from a video and send to the model
function extractFramesFromVideo(video) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Extract frames at regular intervals (e.g., every 2 seconds)
    const frameInterval = 2; // in seconds
    const duration = video.duration;
    
    video.currentTime = 0; // Start from the beginning

    video.addEventListener('seeked', function captureFrame() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            const formData = new FormData();
            formData.append('file', blob, `frame_${video.currentTime}.jpg`);
            sendImageToModel(formData);
        }, 'image/jpeg');

        // Move to the next frame
        if (video.currentTime + frameInterval <= duration) {
            video.currentTime += frameInterval;
        } else {
            video.removeEventListener('seeked', captureFrame);
        }
    });

    // Start processing frames
    video.currentTime = frameInterval;
}

// Inject the floating action bubble into the page
createFloatingBubble();
