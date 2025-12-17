/**
 * Rain Effect JavaScript
 * 
 * @package RintikHujan
 * @author franzxml
 * @version 1.0.0
 */

/**
 * Create rain drops
 * @param {number} numberOfDrops - Number of rain drops to create
 */
function createRain(numberOfDrops) {
    const rainContainer = document.querySelector('.rain-container');
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        
        const leftPosition = Math.random() * 100;
        const animationDuration = Math.random() * 1 + 0.5;
        const animationDelay = Math.random() * 2;
        
        drop.style.left = `${leftPosition}%`;
        drop.style.animationDuration = `${animationDuration}s`;
        drop.style.animationDelay = `${animationDelay}s`;
        
        rainContainer.appendChild(drop);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createRain(100);
});