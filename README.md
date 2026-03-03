# AprilTag Detection with Node.js

A Node.js application for detecting AprilTags from camera input using the `@monumental-works/apriltag-node` library. This project captures images from a USB camera, detects AprilTag markers, and calculates distance based on tag size.

## Features

- Real-time AprilTag detection from USB camera
- Distance estimation based on detected tag size
- Support for TAG36H11 family
- Raw image capture and processing
- Cross-platform support (Linux, macOS, Windows)

## Prerequisites

- Node.js (version 16 or higher)
- FFmpeg for camera capture
- USB camera or webcam
- Linux: `v4l2` compatible camera device

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd apriltag
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install FFmpeg:
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

## Usage

### Basic Usage

Run the main application to detect AprilTags from camera:

```bash
node main.js
```

### Camera Configuration

The camera is configured by default for:
- Device ID: 0 (first camera)
- Resolution: 640x480
- Format: YUYV422 → Grayscale

You can modify the camera settings in `camera.js` or create a new instance with different parameters:

```javascript
const camera = new Camera(deviceId);
camera.width = 1280;  // Custom width
camera.height = 720;  // Custom height
```

### AprilTag Detection

The application uses the TAG36H11 family by default. You can change this in `main.js`:

```javascript
const detector = new AprilTag(FAMILIES.TAG36H11); // or other families
```

Available families include:
- `TAG16H5`
- `TAG25H7`
- `TAG25H9`
- `TAG36H11`
- `TAG36ARTOOLKIT`
- `TAGCIRCLE21H7`
- `TAGCIRCLE49H12`
- `TAGSTANDARD41H12`
- `TAGSTANDARD52H13`

## Output

The application outputs:
- Detection results in JSON format
- Tag dimensions (width, height, area)
- Screen percentage coverage
- Estimated distance using calibrated formula

Example output:
```json
{
  "id": 0,
  "family": "tag36h11",
  "hamming": 0,
  "decision_margin": 48.5,
  "corners": [[120, 80], [200, 80], [200, 160], [120, 160]],
  "center": [160, 120]
}
```

## Distance Calculation

Distance is calculated using the formula:
```
distance = scale * (percentage ^ exponent)
```

Where:
- `scale = 16.24735`
- `exponent = -0.530211`
- `percentage = tag_area / image_area`

You may need to recalibrate these values for your specific camera setup and tag size. To calibrate plug real distance as x and percentage area of the tag as y to https://mycurvefit.com/ or similar.

## File Structure

```
apriltag/
├── main.js          # Main application logic
├── camera.js        # Camera capture implementation
├── package.json     # Node.js dependencies
├── README.md        # This file
├── LICENSE.md       # License information
└── captured_image   # Captured debug image (generated)
```

## Dependencies

- `@monumental-works/apriltag-node`: AprilTag detection library
- FFmpeg: Camera capture and image processing

## Troubleshooting

### Camera Not Found
- Ensure your camera is connected and recognized by the system
- Check device ID (try different values: 0, 1, 2, etc.)

### FFmpeg Issues
- Ensure FFmpeg is installed and in your PATH
- Check camera format compatibility with your device
- Try different input formats in `camera.js`

### No Tags Detected
- Ensure AprilTag is visible in camera view
- Check lighting conditions
- Verify correct tag family is being used
- Adjust camera focus if applicable

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## Acknowledgments

- Uses [@monumental-works/apriltag-node](https://github.com/monumental-works/apriltag-node) for AprilTag detection
- Based on the [AprilTag library](https://april.eecs.umich.edu/software/apriltag.html) from the University of Michigan
- Uses FFmpeg as an external command-line tool for camera capture and image processing
- generative AI was used highly throughout the development process
