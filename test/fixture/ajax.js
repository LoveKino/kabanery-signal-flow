const assert = require('assert');

const lumineView = require('kabanery-lumine/lib/util/lumineView');
const {
    Signal,
    onSignalType
} = require('kabanery-lumine/lib/util/signal');
const n = require('kabanery-lumine/lib/util/n');
const Button = require('kabanery-lumine/lib/view/button/button');
const {
    mount
} = require('kabanery');
const {
    signalActionFlow
} = require('../../index.js');

const TestView = lumineView((_, ctx) => {
    return n('div', [
        n(Button, {
            onsignal: onSignalType('click', () => {
                ctx.updateWithNotify(Signal('submit'));
            })
        }, 'submit')
    ]);
}, {
    defaultProps: {
        id: 1000
    }
});

let responseFlag = false;

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'sendRequest',
            content: 'getEntry(.viewState.props.id)'
        }]
    }, {
        runApi: (url) => {
            return fetch(url).then((res) => res.json()).then((data) => {
                responseFlag = true;
                assert.deepEqual(data, {
                    a: 1
                });
            });
        },
        apiMap: {
            getEntry: (id) => {
                return `/api/test?id=${id}`;
            }
        }
    })
}), document.body);

document.querySelector('button').click();

module.exports = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (responseFlag) {
            resolve();
        } else {
            reject();
        }
    }, 1000);
});
