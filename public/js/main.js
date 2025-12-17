/**
 * Main JavaScript
 * 
 * @package RintikHujan
 * @author franzxml
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Rintik Hujan initialized');
    
    const bgMusic = document.getElementById('bgMusic');
    
    // Auto-play music on user interaction
    document.body.addEventListener('click', function() {
        bgMusic.play().catch(function(error) {
            console.log('Audio autoplay prevented:', error);
        });
    }, { once: true });
});