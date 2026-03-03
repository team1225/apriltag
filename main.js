import AprilTag, { FAMILIES } from '@monumental-works/apriltag-node';
import Camera from './camera.js';

function distance(point1, point2) {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
}

async function main() {
    
    
    // Initialize AprilTag detector
    const detector = new AprilTag(FAMILIES.TAG36H11);
    await detector.ensureInitialized();

    // Initialize camera
    const camera = new Camera(0);

    console.log("Warming up");
    camera.warmUp(); // Warm up the camera to stabilize exposure

    let imageWidth = camera.width;
    let imageHeight = camera.height;
    try {
        // Capture image from camera
        const imageBuffer = await camera.captureImage();
        
        let rgbBuffer = Camera.grayToRGB(imageBuffer);
        
        // Detect AprilTags
        const detections = detector.detect(imageWidth, imageHeight, imageBuffer);
        
        if (detections.length === 0) {
            console.log('No tags detected');
        } else {
            console.log('Detections:', JSON.stringify(detections));
            
            let tag = detections[0];

            let bottomLength = distance(tag.corners[0], tag.corners[1]);
            let rightLength = distance(tag.corners[1], tag.corners[2]);
            let topLength = distance(tag.corners[2], tag.corners[3]);
            let leftLength = distance(tag.corners[3], tag.corners[0]);

            let downUpDiagonal = distance(tag.corners[0], tag.corners[2]);
            let upDownDiagonal = distance(tag.corners[1], tag.corners[3]);
            let averageSideLength = (bottomLength + rightLength + topLength + leftLength) / 4;
            let areaAverage = averageSideLength * averageSideLength;

            // approximate depth based on how much of the image the tag covers
            const imageArea = imageWidth * imageHeight;
            const percentage = areaAverage / imageArea;
            const scale = 0.1624735;
            const exponent = -0.530211;
            const aproxDistance = scale * Math.pow(percentage, exponent);

            // full 3-D pose (rotation + translation) requires camera intrinsics
            // and a PnP solver; apriltag-node only returns pixel coords.




        

            console.log(`Tag ID: ${tag.id}, Bottom: ${bottomLength.toFixed(2)}, Right: ${rightLength.toFixed(2)}, Top: ${topLength.toFixed(2)}, Left: ${leftLength.toFixed(2)}, Down Diagonal: ${downUpDiagonal.toFixed(2)}, Up Diagonal: ${upDownDiagonal.toFixed(2)}, Average Area: ${areaAverage}, Distance: ${aproxDistance.toFixed(2)} m`);

            rgbBuffer[Math.floor(tag.corners[0][1]) * imageWidth * 3 + Math.floor(tag.corners[0][0]) * 3] = 255; // Mark corner 1
            rgbBuffer[Math.floor(tag.corners[0][1]) * imageWidth * 3 + Math.floor(tag.corners[0][0]) * 3 + 1] = 0; // Mark corner 1
            rgbBuffer[Math.floor(tag.corners[0][1]) * imageWidth * 3 + Math.floor(tag.corners[0][0]) * 3 + 2] = 0; // Mark corner 1

            rgbBuffer[(Math.floor(tag.corners[1][1]) * imageWidth * 3 + Math.floor(tag.corners[1][0]) * 3)] = 0; // Mark corner 2
            rgbBuffer[(Math.floor(tag.corners[1][1]) * imageWidth * 3 + Math.floor(tag.corners[1][0]) * 3)+1] = 255; // Mark corner 2
            rgbBuffer[(Math.floor(tag.corners[1][1]) * imageWidth * 3 + Math.floor(tag.corners[1][0]) * 3)+2] = 255; // Mark corner 2

            rgbBuffer[(Math.floor(tag.corners[2][1]) * imageWidth * 3 + Math.floor(tag.corners[2][0]) * 3)] = 0; // Mark corner 3
            rgbBuffer[(Math.floor(tag.corners[2][1]) * imageWidth * 3 + Math.floor(tag.corners[2][0]) * 3)+1] = 0; // Mark corner 3
            rgbBuffer[(Math.floor(tag.corners[2][1]) * imageWidth * 3 + Math.floor(tag.corners[2][0]) * 3)+2] = 255; // Mark corner 3

            rgbBuffer[(Math.floor(tag.corners[3][1]) * imageWidth * 3 + Math.floor(tag.corners[3][0]) * 3)] = 255; // Mark corner 4
            rgbBuffer[(Math.floor(tag.corners[3][1]) * imageWidth * 3 + Math.floor(tag.corners[3][0]) * 3)+1] = 255; // Mark corner 4
            rgbBuffer[(Math.floor(tag.corners[3][1]) * imageWidth * 3 + Math.floor(tag.corners[3][0]) * 3)+2] = 0; // Mark corner 4

            rgbBuffer[(Math.floor(tag.center[1]) * imageWidth * 3 + Math.floor(tag.center[0]) * 3)] = 0; // Mark center
            rgbBuffer[(Math.floor(tag.center[1]) * imageWidth * 3 + Math.floor(tag.center[0]) * 3)+1] = 255; // Mark center
            rgbBuffer[(Math.floor(tag.center[1]) * imageWidth * 3 + Math.floor(tag.center[0]) * 3)+2] = 255; // Mark center
        }

        Camera.toFile(rgbBuffer, 'captured_image.ppm', imageWidth, imageHeight);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
 