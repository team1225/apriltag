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
    
    static grayToRGB(grayBuffer) {
        const rgbBuffer = Buffer.alloc(grayBuffer.length * 3);
        for (let i = 0; i < grayBuffer.length; i++) {
            const grayValue = grayBuffer[i];
            rgbBuffer[i * 3] = grayValue;     // R
            rgbBuffer[i * 3 + 1] = grayValue; // G
            rgbBuffer[i * 3 + 2] = grayValue; // B
        }
        return rgbBuffer;
    }

    static toFile(buffer, filename, width, height) {
        const header = `P6\n${width} ${height}\n255\n`;
        const headerBuffer = Buffer.from(header, "ascii");
        const imageBuffer = Buffer.concat([headerBuffer, buffer]);
        fs.writeFileSync(filename, imageBuffer);
    }
}

export default Camera;
