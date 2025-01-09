const express = require('express');
const { Worker } = require('worker_threads');
const os = require('os');
const workerThreads = os.cpus().length/2; 

const app = express();
app.use(express.json());

app.get('/non-blocking', (req, res) => {
    try {
        return res.status(200).json({ status: 'Successful', message: 'Hello world' });
    } catch (error) {
        return res.status(500).json({ status: 'Failed', message: 'Error occurred' });
    }
});

function createWorker(threadCount) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./new_worker.js', {
            workerData: { thread_count: threadCount },
        });

        // Listen for messages from the worker
        worker.on('message', (data) => resolve(data));

        // Listen for errors from the worker
        worker.on('error', (error) => reject(error));
    });
}

app.get('/blocking', async (req, res) => {
    try {
        const workerPromises = [];
        for (let i = 0; i < workerThreads; i++) {
            workerPromises.push(createWorker(workerThreads)); // Pass thread count
        }

        const threadResults = await Promise.all(workerPromises);
        const total = threadResults.reduce((sum, count) => sum + count, 0);

        res.status(200).json({ status: 'Success', message: 'Success', total });
    } catch (error) {
        res.status(500).json({ status: 'Failed', message: 'Internal Server Error', error: error.message });
    }
});

app.listen(8000, () => {
    console.log("Server is running at http://localhost:8000");
});
