# Cubicler

A Deck-Building Stratrgy Game for the Web.

## Overview

Built in HTML, CSS, and JavaScript. Cubicler is an interactive deck-building game centered around a cubicle worker’s day to day tasks, and how the player can improve their performance with smartly invested technology in between rounds of play. The player will have the option to draw from a pool of objects like keyboards, computer mice, hardware accelerators and more to add to their limited desk space in hopes of achieving the best performance score possible. The goal for each level will be to achieve the allotted proficiency score in order to accomplish a task relevant to cubicle life- like completing a spreadsheet, a VOIP call, and other tasks.

## How to Play

Visit https://cubiclergame.net (or https://https://barneyn1.github.io/Cubicler) to play today! Further instructions for game mechanics are provided on the website.

## Development Team

Nick Barney (Project Leader, Frontend & Backend, Art) - barney1

Collin Follett (Web Hosting, Frontend & Backend) - DrDisc0

Antonios Ibrakhim (Objects & Display, Frontend & Backend) - Antonios1210

Steven Lonsdale-Verbiest (Game Scene Design, Frontend) - Steven-LV

Brandon Morrow (Accessibility & Art, Backend) - brandad17

## System Architecture

### Frontend Architecture
- **Static Web Application**: Built using HTML5, CSS3, and JavaScript without any frameworks.
- **Event-Driven Interactions**: DOM manipulation and user interactions handled through JavaScript event listeners.
- **Responsive Foundation**: Container-based layout with constraints for scalability.
- **Card-Based UI**: Modular content presentation using card components.

### Backend Architecture
- **DOM Ready Pattern**: Uses DOMContentLoaded event to ensure safe element manipulation.
- **Round/Level Based Gameloop**: Engaging repitition with scaling difficulty for strategization.
- **Event Delegation**: Efficient event handling for multiple similar elements (reset, play, undo, shuffle, reroll).
- **Drag & Drop Features**: Usage of mouse drag and drop features for core mechanics.
- **Display Initialization and Updates**: Functions for injecting dynamically selected card images and updating text-based elements within the game.
- **Console Logging**: Development-friendly debugging and user interaction tracking throughout the game.

### Styling and Design
- **CSS Reset**: Universal box-sizing and margin/padding reset for consistent cross-browser rendering.
- **Gradient Design**: Linear gradient backgrounds for visual appeal.

### Research Components
- **Gamified UX**: Implementing engaging layouts and styles to non-game pages for user satisfaction.
- **Visual Feedback**: Providing resolutions of user interaction through progress bars, glow & transform effects, and more.
- **Accessiblity Menu**: In-game menu for visual enhancements like Alt Color, Font Size, and Night Mode.

### Web Hosting
This project is deployed through GitHub Pages on a hosted web domain provided by GoDaddy (https://cubiclergame.net).

## Art
Art components were created using Aseprite, LibreSprite, and GIMP.