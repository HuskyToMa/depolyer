const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.get('/depoly', (req, res) => {
    exec('./depoly.sh', {
        cwd: __dirname
    }, (err, stdout, stderr) => {
        
        if (err) {
            res.status(200).send({
                success: false,
                message: stderr
            })
            return ;
        };

        res.status(200).send({
            success: true,
            message: ''
        })
    });
})

app.listen(8000);