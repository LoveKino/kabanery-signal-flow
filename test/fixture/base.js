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
        'submit': [{
            content: '.props.count=add(.props.count, 1)',
            variableMap: {
                add: (a, b) => a + b
            }
        }]
    })
}), document.body);

document.querySelector('button').click();

assert.equal(document.querySelector('p').textContent, 'count: 1');

document.querySelector('button').click();

assert.equal(document.querySelector('p').textContent, 'count: 2');
