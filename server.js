const express = require('express');
const { Worker } = require('worker_threads');

const app = express();
app.use(express.json());

// Non-blocking route
app.get('/non-blocking', (req, res) => {
    try {
        return res.status(200).json({ status: 'Successful', message: 'Hello world' });
    } catch (error) {
        return res.status(500).json({ status: 'Failed', message: 'Error occurred' });
    }
});

// Blocking route optimized with worker_threads
app.get('/blocking', (req, res) => {
    const worker = new Worker('./worker.js');  // Assuming worker.js is in the same directory

    worker.postMessage('start'); // Send message to worker to start computation

    worker.on('message', (result) => {
        return res.status(200).json({ status: 'Success', message: 'Success', counter: result });
    });

    worker.on('error', (error) => {
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error' });
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            return res.status(500).json({ status: 'Failed', message: 'Worker stopped with an error' });
        }
    });
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
