

import { processUpload } from '../services/upload.service';

// Mock Queue Implementation for Shared Hosting
// Executes jobs IMMEDIATELY (synchronously or awaited) instead of adding to Redis

interface QueueMock {
    add: (data: any, options?: any) => Promise<void>;
    process: (...args: any[]) => void;
}



export const uploadQueue: QueueMock = {
    add: async (jobData: any) => {
        console.log("Mock Queue: Processing Upload immediately...");
        await processUpload(jobData);
    },
    process: (...args: any[]) => { } // No-op
};
