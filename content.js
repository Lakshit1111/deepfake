// Function to make the bubble draggable and save its position
function makeBubbleDraggable(bubble) {
    let isDragging = false;
    let wasDragged = false;
    let offsetX, offsetY;

    // Load position from local storage if available
    // const savedPosition = JSON.parse(localStorage.getItem('bubblePosition'));
    // if (savedPosition) {
    //     // bubble.style.left = `${savedPosition.x}px`;
    //     // bubble.style.top = `${savedPosition.y}px`;
    //     // bubble.style.bottom = 'auto'; // Ensure proper positioning
    //     // bubble.style.right = 'auto';
    // } else {
    //     // Set initial partially visible position if no saved position
    //     bubble.style.right = '-25px';  // Adjust this value to ensure half visibility
    //     bubble.style.top = '50%';
    //     bubble.style.transform = 'translateY(-50%)';
    // }

    // Mouse down event to start dragging
    bubble.addEventListener('mousedown', (e) => {
        isDragging = true;
        wasDragged = false; // Reset the dragged state
        bubble.style.cursor = 'grabbing';
        // offsetX = e.clientX - bubble.getBoundingClientRect()./left;
        offsetY = e.clientY - bubble.getBoundingClientRect().top;
    });

    // Mouse move event to handle dragging
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            wasDragged = true; // Set dragged state to true when moving
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            // bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            bubble.style.bottom = 'auto';
            bubble.style.right = 'auto';
        }
    });

    // Mouse up event to stop dragging and save position
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            bubble.style.cursor = 'grab';
            if (wasDragged) {
                // Save the new position in local storage
                const position = {
                    x: bubble.getBoundingClientRect().left,
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

    bubble.addEventListener('click', () => {
        alert('Click on an image or video to check for deepfakes.');
        enableMediaSelection(); // Your function to trigger deepfake detection
    });
    
    document.body.appendChild(bubble);
    // makeBubbleDraggable(bubble);
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
        const videoUrl = media.src;
        // Implement video frame capture and detection logic
        alert(`Checking video for deepfake: ${videoUrl}`);
    }
}

// Inject the floating action bubble into the page
createFloatingBubble();
