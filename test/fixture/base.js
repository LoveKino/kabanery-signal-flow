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
        n('p', `count: ${props.count}`),

        n(Button, {
            onsignal: onSignalType('click', () => {
                ctx.updateWithNotify(Signal('submit'));
            })
        }, 'submit')
    ]);
}, {
    defaultProps: {
        count: 0
    }
});

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'updateState',
            content: '.viewState.props.count=add(.viewState.props.count, 1)',
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
