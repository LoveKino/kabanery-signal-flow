'use strict';

const {
    parseStrToAst,
    checkAST,
    executeAST
} = require('tree-script');

const JsonTree = require('tree-script/lib/jsonTree'); // using json tree, right now

const getTreeScriptAst = (code, variableStub) => {
    let ast = parseStrToAst(code);

    if (variableStub) {
        checkAST(ast, {
            variableStub
        });
    }

    return ast;
};

const updateTree = (source, ast, variableMap, variableStub) => {
    let tree = JsonTree(source);

    return executeAST(ast, {
        queryByPath: tree.queryByPath,
        setByPath: tree.setByPath,
        removeByPath: tree.removeByPath,
        appendByPath: tree.appendByPath,
        variableMap,
        variableStub
    });
};

const sequence = (fns, params = []) => {
    if (!fns.length) return Promise.resolve([]);
    const top = fns[0];

    return Promise.resolve(top(...params)).then((fstRet) => {
        return sequence(fns.slice(1), params).then(rest => {
            rest.unshift(fstRet);
            return rest;
        });
    });
};

const delay = (t) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, t);
    });
};

const retry = (fn, params, count = 0) => {
    return applyFunPromise(fn, params).catch(err => {
        if (count <= 1) {
            throw err;
        } else {
            return retry(fn, params, count - 1);
        }
    });
};

const applyFunPromise = (fn, params) => {
    try {
        return Promise.resolve(fn(...params));
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = {
    getTreeScriptAst,
    updateTree,
    sequence,
    delay,
    retry,
    applyFunPromise
};
