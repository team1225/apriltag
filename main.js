import AprilTag, { FAMILIES } from '@monumental-works/apriltag-node';

const detector = new AprilTag(FAMILIES.TAG36H11);

// Optionally pre-initialize for consistent timing
await detector.ensureInitialized();

const detections = detector.detect(width, height, imageBuffer);

console.log(detections);
 