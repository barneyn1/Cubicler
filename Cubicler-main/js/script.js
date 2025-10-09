//Use this script for non-game related features
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web app loaded successfully!');
    
    // Get references to elements
    const playBtn = document.getElementById('playBtn');
    const cards = document.querySelectorAll('.card');
    
    // Add click event to play button
    if (playBtn)
        playBtn.addEventListener('click', function() {
            console.log('Play button clicked');
        });

    // Accordion functionality
    document.querySelectorAll(".accordion").forEach(button => {
        button.addEventListener("click", () => {
          const desc = button.nextElementSibling;

          if (desc.style.display === "block") {
            desc.style.display = "none";
            button.querySelector("i").classList.remove("bx-chevron-up");
            button.querySelector("i").classList.add("bx-chevron-down");
          } else {
            desc.style.display = "block";
            button.querySelector("i").classList.remove("bx-chevron-down");
            button.querySelector("i").classList.add("bx-chevron-up");
          }
        });
      });
    
    // Add hover effects to cards
    cards.forEach((card, index) => {
        card.addEventListener('click', function() {
            console.log(`Card ${index + 1} clicked`);
            
            // Add a simple animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
    
    // Simple utility functions
    function showMessage(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
    
    function getCurrentTime() {
        return new Date().toLocaleTimeString();
    }
    
    // Example of how to handle form submissions (if you add forms later)
    function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log('Form submitted:', data);
        return data;
    }
    
    // Make some functions globally available
    window.webApp = {
        showMessage,
        getCurrentTime,
        handleFormSubmit
    };
    
    // Log that everything is ready
    showMessage('All scripts loaded and ready!');
});