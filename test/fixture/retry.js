const assert = require('assert');

const {
    lumineView,
    n,
    mount
} = require('kabanery-lumine');
const Button = require('kabanery-lumine/lib/view/button/button');
const {
    signalActionFlow
} = require('../../index.js');

const TestView = lumineView((_, ctx) => {
    return n('div', [
        n(Button, {
            onsignal: ctx.pass('click', 'submit')
        }, 'submit')
    ]);
}, {
    defaultProps: {}
});

let retryCount = 0;

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'sendRequest',
            content: 'getEntry()',
            retry: 3
        }]
    }, {
        runApi: () => {
            retryCount++;
            throw new Error('Err 123');
        },
        apiMap: {
            getEntry: () => {
                return '/api/fakeApi';
            }
        }
    }, {
        onError: (err) => {
            console.log(err.toString());
        }
    })
}), document.body);

module.exports = new Promise((resolve, reject) => {
    document.querySelector('button').click();

    setTimeout(() => {
        try {
            assert.equal(retryCount, 3);
            resolve();
        } catch (err) {
            reject(err);
        }
    }, 1000);
});
