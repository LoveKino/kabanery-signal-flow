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

const TestView = lumineView(({
    props
}, ctx) => {
    return n('div', [
        props.errorMsg && n('span', props.errorMsg),
        n(Button, {
            onsignal: onSignalType('click', () => {
                ctx.updateWithNotify(Signal('submit'));
            })
        }, 'submit')
    ]);
}, {
    defaultProps: {
        errorMsg: null
    }
});

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'sendRequest',
            content: 'getEntry(.viewState.props.id)',
            error: '.viewState.props.errorMsg = .errorMsg'
        }]
    }, {
        runApi: (url) => {
            return fetch(url).then((res) => res.json()).then(() => {
                throw new Error('err123');
            });
        },
        apiMap: {
            getEntry: (id) => {
                return `/api/test?id=${id}`;
            }
        }
    })
}), document.body);

module.exports = new Promise((resolve, reject) => {
    document.querySelector('button').click();
    setTimeout(() => {
        try {
            assert.equal(document.querySelector('span').textContent, 'Error: err123');
            resolve();
        } catch (err) {
            reject(err);
        }
    }, 1000);
});
