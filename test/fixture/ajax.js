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

let responseFlag = false;

mount(n(TestView, {
    onsignal: signalActionFlow({
        submit: [{
            type: 'sendRequest',
            content: 'getEntry(.viewState.props.id)',
            response: '.props.a = .response.a;'
        }]
    }, {
        runApi: (url) => {
            return fetch(url).then((res) => res.json()).then((data) => {
                responseFlag = true;
                assert.deepEqual(data, {
                    a: 1
                });

                return data;
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
        if (responseFlag) {
            try {
                assert.equal(document.querySelector('span').textContent, '1');
                resolve();
            } catch (err) {
                reject(err);
            }
        } else {
            reject(new Error('no response'));
        }
    }, 1000);
});
