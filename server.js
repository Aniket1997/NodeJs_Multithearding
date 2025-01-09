const express = require('express');

const app = express();
app.use(express.json());

app.get('/non-blocking',(req, res) => {
    try {
        return res.status(200).json({ status: 'Successful', message:'Hello world' });
    } catch (error) {
        return res.status(500).json({ status: 'Failed', message: 'Error occurred' });
    }
});


app.get('/blocking', async (req, res) => {
    try {
        let counter = 0;
        for(let i=0;i<2000_0000_0000_0000;i++)
        {
            counter++;
        }
        return res.status(200).json({ status: 'Success', message: 'Success', counter });
    } catch (error) {
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error' });
    }
});


app.listen(8000,()=>{
    console.log("Hello world");
})