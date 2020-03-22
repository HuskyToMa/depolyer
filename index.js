const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const app = express();

app.use(express.static(path.resolve(__dirname, './ui/dist')));

const _spawn = (name, arr, options) => {
    const ls = spawn(name, arr, options);
    return new Promise((resolve, reject) => {
        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on('error', (err) => {
            reject(err);
        })
        
        ls.on('close', (code) => {
            resolve(code);
        });
    })
}

const getGitFloderName = () => {
    const { gitUrl } = config;
    const urlArr = gitUrl.split('/');
    return urlArr[urlArr.length - 1].split('.')[0];
}

const cloneGit = (res) => {
    _spawn('git', [
        'clone',
        '-b',
        config.tag,
        config.gitUrl
    ]).then(code => {
        const FloderPath = path.resolve(__dirname, getGitFloderName());
        const shPath = `${FloderPath}/depoly.sh`;
        fs.writeFileSync(shPath, config.shCommand);
        _spawn('chmod', [
            'u+x',
            shPath
        ], {
            cwd: FloderPath
        }).then(c => {
            depolySh(res, FloderPath);
        }).catch(err => {
            res.status(200).send({
                success: false,
                message: err
            })
        })
    }).catch(err => {
        res.status(200).send({
            success: false,
            message: err
        })
    })
}

const depolySh = (res, FloderPath) => {
    exec('./depoly.sh', {
        cwd: FloderPath
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
}

app.get('/depoly', (req, res) => {
    cloneGit(res);
})

app.listen(8000);