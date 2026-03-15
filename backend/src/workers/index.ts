
import { uploadQueue } from '../config/queue';
import { emailWorker } from './email.worker';
import { uploadWorker } from './upload.worker';

export const initWorkers = () => {
    console.log('👷 Initializing Background Workers...');

    // emailQueue removed
    // emailQueue.process(emailWorker);

    // Upload Worker
    // Concurrency: 5 uploads at a time
    uploadQueue.process(5, uploadWorker);

    console.log('✅ Workers Started');
};
