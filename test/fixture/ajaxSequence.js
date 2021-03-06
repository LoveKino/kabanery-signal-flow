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
        props.a && n('span', props.a),
        n(Button, {
            onsignal: ctx.pass('click', 'submit')
        }, 'submit')
    ]);
}, {
    defaultProps: {
        id: 1000,
        a: null
    }
});

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'sendRequest',
            content: 'getEntry(.props.id)',
            response: [
                '.props.a = .response.a;',
                {
                    type: 'sendRequest',
                    content: 'getEntry2(.props.id)',
                    response: '.props.a = add(.response.a, .props.a);'
                }
            ],

            variableMap: {
                add: (v1, v2) => v1 + v2
            }
        }]
    }, {
        runApi: (url) => {
            return fetch(url).then((res) => res.json());
        },
        apiMap: {
            getEntry: (id) => {
                return `/api/test?id=${id}`;
            },

            getEntry2: (id) => {
                return `/api/test2?id=${id}`;
            }
        }
    })
}), document.body);

module.exports = new Promise((resolve, reject) => {
    document.querySelector('button').click();

    setTimeout(() => {
        try {
            assert.equal(document.querySelector('span').textContent, '3');
            resolve();
        } catch (err) {
            reject(err);
        }
    }, 1000);
});
