// Import the necessary styles and the main StickyNotesApp class
import "./style.css";
import Game from "./src/Game";

// Create a new instance of the StickyNotesApp
const app = new Game();
// Initialize the app once the document content is fully loaded
window.addEventListener("DOMContentLoaded", () => app.init());
