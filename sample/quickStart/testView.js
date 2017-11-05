const lumineView = require('kabanery-lumine/lib/util/lumineView');
const n = require('kabanery-lumine/lib/util/n');
const Button = require('kabanery-lumine/lib/view/button/button');
const {mount} = require('kabanery');

const TestView = lumineView(() => {
    return n(Button, 'test');
});

mount(TestView(), document.body);
