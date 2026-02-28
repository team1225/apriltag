import AprilTag, { FAMILIES } from '@monumental-works/apriltag-node';
import Camera from './camera.js';
import fs from 'fs';

async function main() {
    // Initialize AprilTag detector
    const detector = new AprilTag(FAMILIES.TAG36H11);
    await detector.ensureInitialized();

    // Initialize camera
    const camera = new Camera(0);
    let imageWidth = camera.width;
    let imageHeight = camera.height;
    try {
        // Capture image from camera
        const imageBuffer = await camera.captureImage();

        fs.writeFileSync('img.raw', imageBuffer);
        
        // Detect AprilTags
        const detections = detector.detect(imageWidth, imageHeight, imageBuffer);
        
        console.log('Detections:', JSON.stringify(detections));

        let tag = detections[0];
        let width = Math.abs(tag.corners[0][0]-tag.corners[2][0]);
        let height = Math.abs(tag.corners[0][1]-tag.corners[2][1]);
        let area = width * height;
        let percentage = area / (imageHeight * imageWidth);
        let scale = 16.24735;
        let exponent = -0.530211;
        let distance = scale * Math.pow(percentage, exponent);

        console.log('Width:', width);
        console.log('Height:', height);
        console.log('Area:', area);
        console.log('Percentage:', percentage);
        console.log('distance:', distance);
        


    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
 