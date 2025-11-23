//Use this script for non-game related features
// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("Web app loaded successfully!");
    
    // Get references to elements
    const cards = document.querySelectorAll(".card");

    // Accordion functionality
    cards.forEach(card => {
        card.addEventListener("click", () => {
          const header = card.querySelector(".accordion");
          const desc = card.querySelector(".accordionDesc");

          if (desc.style.display === "block") {
            desc.style.display = "none";
            header.querySelector("i").classList.remove("bx-chevron-up");
            header.querySelector("i").classList.add("bx-chevron-down");
          } else {
            desc.style.display = "block";
            header.querySelector("i").classList.remove("bx-chevron-down");
            header.querySelector("i").classList.add("bx-chevron-up");
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
    
    // Make some functions globally available
    window.webApp = {
        showMessage,
        getCurrentTime,
    };
    
    // Log that everything is ready
    showMessage('All scripts loaded and ready!');
});