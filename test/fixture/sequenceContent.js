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

const TestView = lumineView(({
    props
}, ctx) => {
    return n('div', [
        n('p', `count: ${props.count}`),

        n(Button, {
            onsignal: ctx.pass('click', 'submit')
        }, 'submit')
    ]);
}, {
    defaultProps: {
        count: 0
    }
});

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: ['.props.count=10', '.props.count=20']
    })
}), document.body);

document.querySelector('button').click();

module.exports = new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            assert.equal(document.querySelector('p').textContent, 'count: 20');
            resolve();
        } catch (err) {
            reject(err);
        }
    }, 17);
});
