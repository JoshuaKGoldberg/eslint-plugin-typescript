/**
 * @fileoverview Disallow iterating over an array with a for-in loop
 * @author Josh Goldberg
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/await-promise"),
    RuleTester = require("eslint").RuleTester,
    path = require("path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

// RuleTester.it = function(text, method) {
//     return method.call({ break: true });
// };

const rootDir = path.join(process.cwd(), "tests/lib/fixtures");
const filename = path.join(rootDir, "empty.ts");
const parserOptions = {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: "./tsconfig.json",
};
const ruleTester = new RuleTester({
    parserOptions,
    parser: "typescript-eslint-parser",
});
// const messages = {
//     await: "Invalid 'await' of a non-Promise value",
//     forAwaitOf: "Invalid 'for-await-of' of a non-AsyncIterable value.",
// };

ruleTester.run("await-promise", rule, {
    valid: [
        {
            code: `
// async function correct() {
//     await Promise.resolve(true);
//     await otherAsyncFunction();
// }

// async otherAsyncFunction() { }
`,
            filename,
        },
        //         {
        //             filename,
        //             code: `
        // async function correct(foo: AsyncIterable<string>) {
        //     for await (const element of foo) {}
        //     for await (const element of asyncGenerator()) {}
        // }

        // async function* asyncGenerator() {
        //     yield 1;
        // }
        // `,
        //         },
    ],

    invalid: [
        //         {
        //             filename,
        //             code: `
        // async function _() {
        //     await true;
        //     await {};
        // }
        // `,
        //             errors: [
        //                 {
        //                     message: messages.await,
        //                     type: "AwaitExpression",
        //                 },
        //             ],
        //         },
        //         {
        //             filename,
        //             code: `
        // async function incorrect(foo: Array<Promise<string>) {
        //     for await (const element of foo) {}
        // }
        // `,
        //             errors: [
        //                 {
        //                     message: messages.forAwaitOf,
        //                     type: "ForOfStatement",
        //                 },
        //             ],
        //         },
    ],
});
