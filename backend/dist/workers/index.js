"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorkers = void 0;
const queue_1 = require("../config/queue");
const upload_worker_1 = require("./upload.worker");
const initWorkers = () => {
    console.log('👷 Initializing Background Workers...');
    // emailQueue removed
    // emailQueue.process(emailWorker);
    // Upload Worker
    // Concurrency: 5 uploads at a time
    queue_1.uploadQueue.process(5, upload_worker_1.uploadWorker);
    console.log('✅ Workers Started');
};
exports.initWorkers = initWorkers;
