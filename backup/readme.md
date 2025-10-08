# Cubicler

## Using Replit Development Environment

Hey, Nick here. The new Replit format is annoying so I'm putting some helpful stuff here in case you need help operating the environment.

1. The page .replit.dev/ is NOT the actual updated index page. It fetches the index page at a delayed rate, add index.html (OR html/game.html) to the URL to get your updated page.

2. The filesystem panel for Replit is in the top right, next to the blue publish button (I HATE this). I found out you can move it to the left under the Files ... options.

3. The Edit History can be seen in the Bottom Panel. Helpful for if we need to document what we did.

4. If you're looking for console.log outputs, the Console tab is a little misleading. The Console tab is for the replit http host monitoring, meanwhile the website console (found in Preview -> Devtools [Wrench Icon]) will show the JS console.log outputs

5. Often times you need to clear your browser cache for Replit preview to update and/or grab files properly.

6. Don't worry about the Agent Cost thing when you want to stop the preview, costs are currently minimal I'll update if otherwise.

## Overview

This is a basic starter template for building web applications using vanilla HTML, CSS, and JavaScript. The project provides a clean foundation with modern styling, interactive elements, and a responsive design structure. It features a gradient header, hero section with call-to-action button, feature cards, and utility functions for future development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Web Application**: Built using vanilla HTML5, CSS3, and JavaScript without any frameworks
- **Single Page Structure**: All content served from a single HTML file with inline navigation
- **Component-Based Layout**: Modular design with distinct sections (header, hero, content cards, footer)
- **Event-Driven Interactions**: DOM manipulation and user interactions handled through vanilla JavaScript event listeners

### Styling and Design
- **CSS Reset**: Universal box-sizing and margin/padding reset for consistent cross-browser rendering
- **Modern Typography**: Uses system font stack for optimal performance and native appearance
- **Gradient Design**: Linear gradient backgrounds for visual appeal
- **Responsive Foundation**: Container-based layout with max-width constraints for scalability
- **Card-Based UI**: Modular content presentation using card components
- **CSS Animations**: Transform-based hover effects and temporary state changes

### JavaScript Architecture
- **DOM Ready Pattern**: Uses DOMContentLoaded event to ensure safe element manipulation
- **Event Delegation**: Efficient event handling for multiple similar elements (cards)
- **Utility Functions**: Modular helper functions for common tasks (messaging, time handling, form processing)
- **Console Logging**: Development-friendly debugging and user interaction tracking

## External Dependencies

Currently, this project has no external dependencies and runs entirely on native web technologies:

- **HTML5**: For document structure and semantic markup
- **CSS3**: For styling, animations, and responsive design
- **Vanilla JavaScript**: For interactivity and DOM manipulation
- **Browser APIs**: Relies on standard web APIs (DOM, Console, Date, setTimeout)

The project is designed to be easily extensible with additional libraries, frameworks, or backend services as needed for future development.