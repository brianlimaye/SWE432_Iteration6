// Listener for glow effect
let selectedElement = null;

function toggleActive(element) {
    if (selectedElement) {
        selectedElement.classList.remove('active');
    }

    element.classList.add('active');
    selectedElement = element;
}

// Validate time format (hh:mm)
function isValidTimeFormat(time) {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

// Compare start and end times
function validateTimes() {
    const startTimeInput = document.getElementById("start_time");
    const endTimeInput = document.getElementById("end_time");
    const errorMessage = document.getElementById("error-message");
    const errorPopup = document.getElementById("error-popup");

    if (!isValidTimeFormat(startTimeInput.value) || !isValidTimeFormat(endTimeInput.value)) {
        errorMessage.textContent = "Please enter valid time formats (hh:mm).";
        showErrorPopup(errorPopup);
    } else {
        const startTime = new Date(`2000-01-01T${startTimeInput.value}`);
        const endTime = new Date(`2000-01-01T${endTimeInput.value}`);

        if (endTime < startTime) {
            errorMessage.textContent = "End time cannot be before the start time.";
            showErrorPopup(errorPopup);
        }
    }
}

// Show the error pop-up
function showErrorPopup(errorPopup) {
    errorPopup.style.display = "block";

    // Hide the error pop-up after 10 seconds
    setTimeout(function() {
        errorPopup.style.display = "none";
    }, 10000);
}

// Add songs to playlist 
function addSong(clickedSong) {
    // Get the song element that was clicked
    const songElement = clickedSong.parentElement;
    
    // Clone the song element to add it to the playlist
    const newSongElement = songElement.cloneNode(true);

    // Remove the "add" image from the cloned element
    const addImageClone = newSongElement.querySelector("img[src='img/add.png']");
    if (addImageClone) {
        addImageClone.remove();
    }

    // Add the cloned song element to the current playlist
    const currentPlaylist = document.querySelector(".container");
    currentPlaylist.appendChild(newSongElement);
}
