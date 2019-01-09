/**
 * @fileoverview Disallow awaiting for a value that is not a Promise
 * @author Josh Goldberg
 */
"use strict";
const util = require("../util");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const defaultOptions = [
    {
        allowedNames: [],
    },
];

/**
 * @type {import("eslint").Rule.RuleModule}
 */
module.exports = {
    meta: {
        docs: {
            description: "Disallow awaiting for a value that is not a Promise",
            category: "Functionality",
            recommended: false,
            extraDescription: [util.tslintRule("await-promise")],
            url: util.metaDocsUrl("await-promise"),
        },
        fixable: null,
        messages: {
            await: "Invalid await of a non-Promise value.",
            forAwaitOf: "Invalid for-await-of of a non-AsyncIterable value.",
        },
        schema: [
            {
                type: "object",
                additionalProperties: false,
                properties: {
                    allowedAsyncIterableNames: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                    allowedPromiseNames: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
            },
        ],
        type: "problem",
    },

    create(context) {
        const parserServices = util.getParserServices(context);

        /**
         * @type {import("typescript").TypeChecker}
         */
        const checker = parserServices.program.getTypeChecker();

        const {
            allowedAsyncIterableNames,
            allowedPromiseNames,
        } = util.applyDefault(defaultOptions, context.options)[0];

        const allAsyncIterableNames = new Set([
            "AsyncIterable",
            "AsyncIterableIterator",
            ...allowedAsyncIterableNames,
        ]);
        const allPromiseNames = new Set(["Promise", ...allowedPromiseNames]);

        /**
         * @param {ASTNode} node   Node being awaited.
         * @param {Set<string>} allowedTypeNames   Names the node's type symbol may be called.
         * @returns {boolean} Whether the node's type symbol name exists and isn't included.
         */
        function nodeTypeNameNotIncluded(node, allowedTypeNames) {
            const type = checker.getTypeAtLocation(node);

            return (
                typeof type.symbol !== "undefined" &&
                !allowedTypeNames.has(type.symbol.name)
            );
        }

        return {
            AwaitExpression(node) {
                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(
                    node
                );

                if (
                    typeof originalNode !== "undefined" &&
                    nodeTypeNameNotIncluded(
                        originalNode.argument,
                        allPromiseNames
                    )
                ) {
                    context.report({
                        node,
                        messageId: "await",
                    });
                }
            },
            ForOfStatement(node) {
                if (!node.await) {
                    return;
                }

                const originalNode = parserServices.esTreeNodeToTSNodeMap.get(
                    node
                );

                if (
                    typeof originalNode !== "undefined" &&
                    nodeTypeNameNotIncluded(
                        originalNode.right,
                        allAsyncIterableNames
                    )
                ) {
                    context.report({
                        node,
                        messageId: "forAwaitOf",
                    });
                }
            },
        };
    },
};
