'use strict';

let browserJsEnv = require('browser-js-env');
let promisify = require('es6-promisify');
let fs = require('fs');
let path = require('path');
let readFile = promisify(fs.readFile);

const puppeteer = require('puppeteer');

const headlessOpen = async(url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle'
    });

    return {
        kill: () => {
            browser.close();
        }
    };
};

let runFileInBrowser = (file) => {
    return readFile(file).then((str) => {
        return browserJsEnv(str, {
            clean: true,
            open: headlessOpen,
            cwd: path.dirname(file),
            apiMap: {
                '/api/test': (req, res) => {
                    res.end(JSON.stringify({
                        a: 1
                    }));
                }
            },

        });
    });
};

let testFiles = {
    'base': path.join(__dirname, '../fixture/base.js'),
    'ajax': path.join(__dirname, '../fixture/ajax.js')
};

describe('signal-flow', () => {
    for (let name in testFiles) {
        it(name, () => {
            return runFileInBrowser(testFiles[name]);
        });
    }
});
