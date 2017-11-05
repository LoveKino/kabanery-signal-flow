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

module.exports = {
    getTreeScriptAst,
    updateTree
};
