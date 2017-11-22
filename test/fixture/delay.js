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
const {
    delay
} = require('../../lib/util');

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
        'submit': [1000, '1? .props.count=2: 0']
    })
}), document.body);

document.querySelector('button').click();

module.exports = delay(500).then(() => {
    assert.equal(document.querySelector('p').textContent, 'count: 0');
    return delay(600);
}).then(() => {
    assert.equal(document.querySelector('p').textContent, 'count: 2');
});
