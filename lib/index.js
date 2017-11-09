'use strict';

const {
    getTreeScriptAst,
    updateTree,
    sequence,
    delay
} = require('./util');

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
    // TODO validate signalActionMap
    // TODO do not modify source map, generate a new one
    let contentMap = {};

    for (const name in signalActionMap) {
        contentMap[name] = parseActions(signalActionMap[name], variableMap, variableStub);
    }
    // handler
    return (signal, viewState, ctx) => {
        if (contentMap[signal.type]) {
            const source = {
                signal,
                viewState,
                props: viewState.props
            };

            return contentMap[signal.type](source, ctx, pageEnv);
        }
    };
};

const parseActions = (actions, variableMap, variableStub) => {
    if (!actions) return null;

    if (!Array.isArray(actions)) {
        actions = [actions];
    }

    const contents = actions.map((action) => {
        let signalAction = action;

        if (typeof signalAction === 'string') {
            signalAction = {
                content: signalAction
            };
        } else if (typeof signalAction === 'number') {
            const time = signalAction;
            signalAction = {
                content: () => delay(time)
            };
        }

        return parseSignalActionContent(signalAction, variableMap, variableStub);
    });

    return (...params) => {
        return sequence(contents, params);
    };
};

const parseSignalActionContent = (action, _variableMap, _variableStub) => {
    const type = action.type || ACTION_SIGNAL_UPDATE_STATE;
    const cnt = action.content;
    if (typeof cnt !== 'string' && typeof cnt !== 'function') {
        throw new Error(`Content of action should be string or function, but got ${cnt}, in action ${type}.`);
    }

    const nextVariableMap = getVariableMap(_variableMap, action);
    const nextVariableStub = getVariableStub(_variableStub, action);

    if (typeof cnt === 'string') {
        if (type === ACTION_SIGNAL_UPDATE_STATE) { // update state
            return updateStateHandler(action, nextVariableMap, nextVariableStub);
        } else if (type === ACTION_SIGNAL_SEND_REQUEST) {
            return sendRequestHandler(action, nextVariableMap, nextVariableStub);
        } else {
            throw new Error(`unexpected action type for a signal action, type is ${type}`);
        }
    } else {
        return cnt;
    }
};

/**
 * update state action handlers
 *
 * {
 *   type,
 *   content,
 *   variableMap,
 *   variableStub
 * }
 */

const updateStateHandler = (action, variableMap, variableStub) => {
    const ast = getTreeScriptAst(action.content, variableStub);

    return (source, ctx) => {
        try {
            updateTree(source, ast, variableMap, variableStub);
            ctx.updateWithNotify();

            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    };
};

/**
 * send request action
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
// TODO retry

const sendRequestHandler = (action, variableMap, variableStub) => {
    // TODO forbidden assign or other update opeartion in tree-script
    const requestAst = getTreeScriptAst(action.content, variableStub);
    const responseUpdate = parseActions(action.response, variableMap, variableStub);
    const errorUpdate = parseActions(action.error, variableMap, variableStub);

    return (source, ctx, {
        runApi,
        apiMap
    }) => {
        let apiRet = null;
        try {
            const requestContext = Object.assign({}, variableMap, apiMap);
            const apiData = updateTree(source, requestAst, requestContext, variableStub);

            apiRet = runApi(apiData);
        } catch (err) {
            apiRet = Promise.reject(err);
        }

        return Promise.resolve(apiRet).then((response) => {
            return responseUpdate && responseUpdate(Object.assign({
                response
            }, source), ctx);
        }).catch((error) => {
            errorUpdate && errorUpdate(Object.assign({
                errorMsg: error.toString(),
                error
            }, source), ctx);
            throw error;
        });
    };
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
    signalActionFlow
};
