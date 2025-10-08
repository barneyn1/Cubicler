//Use this script for non-game related features
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web app loaded successfully!');
    
    // Get references to elements
    const startBtn = document.getElementById('startBtn');
    const cards = document.querySelectorAll('.card');
    
    // Add click event to start button
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            alert('Welcome to your web app! Start building amazing features.');
            console.log('Start button clicked');
            
            // Add some visual feedback
            startBtn.textContent = 'Let\'s Go!';
            setTimeout(() => {
                startBtn.textContent = 'Get Started';
            }, 2000);
        });
    }
    
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