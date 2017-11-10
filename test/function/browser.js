'use strict';

const browserJsEnv = require('browser-js-env');
const promisify = require('es6-promisify');
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);

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
                },

                '/api/test2': (req, res) => {
                    res.end(JSON.stringify({
                        a: 2
                    }));
                }

            }
        });
    });
};

let testFiles = {
    'base': path.join(__dirname, '../fixture/base.js'),
    'ajax': path.join(__dirname, '../fixture/ajax.js'),
    'errorAjax': path.join(__dirname, '../fixture/errorAjax.js'),
    'sequenceContent': path.join(__dirname, '../fixture/sequenceContent.js'),
    'delay': path.join(__dirname, '../fixture/delay.js'),
    'retry': path.join(__dirname, '../fixture/retry.js'),
    'ajaxSequence': path.join(__dirname, '../fixture/ajaxSequence.js')
};

describe('signal-flow', () => {
    for (let name in testFiles) {
        it(name, () => {
            return runFileInBrowser(testFiles[name]);
        });
    }
});
