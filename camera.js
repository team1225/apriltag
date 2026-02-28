import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

class Camera {
    constructor(deviceId = 0) {
        this.deviceId = deviceId;
        this.width = 640;
        this.height = 480;
    }

    async captureImage() {
        const timestamp = Date.now();
        const rawFile = `/tmp/camera_${timestamp}.raw`;
        
        try {
            // Capture raw grayscale frame using ffmpeg
            await execAsync(`ffmpeg -f v4l2 -input_format yuyv422 -video_size ${this.width}x${this.height} -i /dev/video${this.deviceId} -pix_fmt gray -frames 1 -f rawvideo ${rawFile}`);
            
            // Read and return raw image buffer
            const imageBuffer = fs.readFileSync(rawFile);
            fs.unlinkSync(rawFile); // Clean up
            return imageBuffer;
            
        } catch (error) {
            // Clean up on error
            if (fs.existsSync(rawFile)) fs.unlinkSync(rawFile);
            throw new Error(`Camera capture failed: ${error.message}`);
        }
    }

}

export default Camera;
