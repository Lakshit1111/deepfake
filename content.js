// content.js
function makeBubbleDraggable(bubble) {
    let isDragging = false;
    let offsetX, offsetY;

    bubble.addEventListener('mousedown', (e) => {
        isDragging = true;
        bubble.style.cursor = 'grabbing'; // Change cursor to grabbing
        offsetX = e.clientX - bubble.getBoundingClientRect().left;
        offsetY = e.clientY - bubble.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            bubble.style.bottom = 'auto'; // Prevents conflicting CSS styles
            bubble.style.right = 'auto';  // Prevents conflicting CSS styles
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        bubble.style.cursor = 'grab'; // Revert cursor to grab
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
    
    bubble.addEventListener('mouseenter', () => {
        bubble.style.transform = 'scale(1.1)';
    });

    bubble.addEventListener('mouseleave', () => {
        bubble.style.transform = 'scale(1)';
    });

    bubble.addEventListener('click', () => {
        alert('Click on an image or video to check for deepfakes.');
        enableMediaSelection();
    });

    document.body.appendChild(bubble);
    makeBubbleDraggable(bubble);
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

// Function to perform deepfake detection (placeholder)
function detectDeepfake(media) {
    if (media.tagName.toLowerCase() === 'img') {
        const imageUrl = media.src;
        // Send image URL to your backend or local model
        alert(`Checking image for deepfake: ${imageUrl}`);
    } else if (media.tagName.toLowerCase() === 'video') {
        // Implement video frame capture and detection logic
        alert('Checking video for deepfake.');
    }
}

// Inject the floating action bubble into the page
createFloatingBubble();
