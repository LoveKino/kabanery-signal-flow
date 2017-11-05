'use strict';

const {
    getTreeScriptAst,
    updateTree
} = require('./util');

const clientState = {
    localStorage: typeof localStorage !== 'undefined' && localStorage
};

/**
 * action flow
 */
const ACTION_SIGNAL_UPDATE_STATE = 'updateState';
const ACTION_SIGNAL_SEND_REQUEST = 'sendRequest';

/**
 * variableMap: global variable map
 *
 * TODO support general action flow
 */
const signalActionFlow = (signalActionMap, pageEnv, variableMap = {}, {
    variableStub
} = {}) => {
    parseSignalActionMap(signalActionMap, variableMap, {
        variableStub
    });

    // onsignal handler
    return (signal, viewState, ctx) => {
        let actions = signalActionMap[signal.type] || [];
        return runSignalActions(signal, actions, viewState, ctx, pageEnv);
    };
};

const runSignalActions = (signal, actions, viewState, ctx, pageEnv) => {
    return Promise.all(actions.map((action) => {
        return action.content(signal, viewState, ctx, pageEnv);
    }));
};

// TODO validate signalActionMap
const parseSignalActionMap = (signalActionMap, variableMap, {
    variableStub
}) => {
    for (let name in signalActionMap) {
        let actions = signalActionMap[name];
        if (!Array.isArray(actions)) {
            throw new Error(`Expect array for actions in signal action map. But got ${actions}.`);
        }

        for (let i = 0; i < actions.length; i++) {
            parseSignalAction(actions[i], variableMap, {
                variableStub
            });
        }
    }
};

/**
 * parse signal action
 *
 * {
 *   type,
 *   content,
 *   variableMap,
 *   variableStub,
 *   response: action,
 *   error: action
 * }
 */

const parseSignalAction = (signalAction, variableMap, {
    variableStub
}) => {
    const type = signalAction.type;
    const cnt = signalAction.content;

    if (typeof cnt !== 'string' && typeof cnt !== 'function') {
        throw new Error(`Content of action should be string or function, but got ${cnt}, in action ${type}.`);
    }

    let nextVariableMap = getVariableMap(variableMap, signalAction);
    let nextVariableStub = getVariableStub(variableStub, signalAction);

    if (type === ACTION_SIGNAL_UPDATE_STATE) { // update state
        if (typeof cnt === 'string') { // tree script
            // parse code to AST
            const ast = getTreeScriptAst(cnt, nextVariableStub);

            signalAction.content = (signal, viewState, ctx) => {
                return new Promise((resolve, reject) => {
                    try {
                        let data = Object.assign({
                            signal,
                            viewState
                        }, clientState);

                        updateTree(data, ast, nextVariableMap, nextVariableStub);

                        // update page, TODO, if expose signal
                        // TODO silient without update, used to do test
                        ctx.updateWithNotify();

                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        }
    } else if (type === ACTION_SIGNAL_SEND_REQUEST) {
        if (typeof cnt === 'string') {
            let requestAst = getTreeScriptAst(cnt, nextVariableStub);
            let responseUpdate = getResponseHandler(signalAction.response, nextVariableMap, nextVariableStub);
            let errorUpdate = getErrorHandler(signalAction.error, nextVariableMap, nextVariableStub);

            signalAction.content = (signal, viewState, ctx, {
                runApi,
                apiMap
            }) => {
                let requestContext = Object.assign({}, nextVariableMap, apiMap);

                return runApi(
                    updateTree(viewState, requestAst, requestContext, nextVariableStub)
                ).then((response) => {
                    return responseUpdate && responseUpdate(response, viewState, ctx);
                }).catch((err) => {
                    errorUpdate && errorUpdate(err, viewState, ctx);
                    throw err;
                });
            };
        }
    } else {
        throw new Error(`unexpected action type for a signal action, type is ${type}`);
    }
};

const getResponseHandler = (response, variableMap, variableStub) => {
    if (typeof response === 'string') {
        let ast = getTreeScriptAst(response, variableStub);

        return (response, viewState, ctx) => {
            updateTree(Object.assign({
                response,
                viewState
            }, clientState), ast, variableMap, variableStub);

            // update page
            ctx.updateWithNotify();
        };
    } else if (typeof response === 'function') {
        return response;
    }

    return null;
};

const getErrorHandler = (error, variableMap, variableStub) => {
    if (typeof error === 'string') {
        let ast = getTreeScriptAst(error, variableStub);

        return (error, viewState, ctx) => {
            updateTree(Object.assign({
                errorMsg: error.toString(),
                error,
                viewState,
                ctx
            }, clientState), ast, variableMap, variableStub);

            // update page
            ctx.updateWithNotify();
        };
    } else if (typeof error === 'function') {
        return error;
    }

    return null;
};

const getVariableMap = (variableMap, action) => {
    if (!action.variableMap) return variableMap;
    return Object.assign({}, variableMap, action.variableMap);
};

const getVariableStub = (variableStub, action) => {
    if (!action.variableStub) return variableStub;
    return Object.assign({}, variableStub, action.variableStub);
};

module.exports = {
    signalActionFlow,
    runSignalActions
};
