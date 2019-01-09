# Disallow awaiting for a value that is not a Promise (await-promise)

This rule prohibits awaiting for a value that is not a Promise.

## Rule Details

Rationale from TSLint:

> While it is valid JavaScript to await a non-Promise-like value (it will resolve immediately),
> this pattern is often a programmer error and the resulting semantics can be unintuitive.
>
> Awaiting non-Promise-like values often is an indication of programmer error,
> such as forgetting to add parenthesis to call a function that returns a Promise.

TODO: CONFIG

Examples of **incorrect** code for this rule:

```js
await true;
await {};
```

Examples of **correct** code for this rule:

```js
await Promise.resolve(true);
await fetch("some-url");
```

## Related to

-   TSLint: ['await-promise'](https://palantir.github.io/tslint/rules/await-promise/)
