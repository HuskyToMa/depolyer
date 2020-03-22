const path = require('path');

module.exports = {
    productUrl: path.resolve(__dirname, './mj_react'),
    gitUrl: 'https://gitee.com/husky_Ma/tuanfan.git',
    tag: 'master',
    shCommand: `#!/bin/bash

npm i
npm run build    
    `
}