# Custom Multiselect

This case study is implemented to showcase a working example of a custom multiselect component. It is **NOT** designed for general purpose. Rather, it is specifically designed for being compatible with only _Rick & Morty API_. A general purpose multiselect component might be considered to be designed later on.

The component is designed in such a way that a user can interact with the component by keyboard navigation as well. Note that in order to interact with the component by keyboard, it should be focused first. The following key combinations will take actions as listed below:

- When pressing _Escape_ key,
  - if options wrapper is open, it will be dismissed.
  - if options wrapper is dismissed, nothing will happen.
- When pressing _Enter_ key,
  - if options wrapper is dismissed, it will be opened.
  - if options wrapper is open, nothing will happen.
- When pressing _ArrowDown_ key,
  - if options wrapper is dismissed, it will be opened.
  - if options wrapper is open, user can start navigating through the available options till the last option.
- When pressing _ArrowUp_ key,
  - if options wrapper is dismissed, nothing will happen.
  - if options wrapper is open, user can start navigating through the available options till the first option.
- When pressing _Space_ key,
  - if focus is on `<input>` element, nothing will happen and user can keep typing.
  - if focus is on any `<Badge>` component, remove currently focused badge from the selected ones.
  - if focus is on any `<SelectOption>` component, toggle selection status for currently focused `<SelectOption>`.
- When pressing _Shift + Backspace_ key,
  - user can perform default keyboard navigation in backward direction as browser enables.
    - e.g. for navigating among selected badge(s)' remove buttons, user can use this key combination and to remove one, user can press _Space_ when focused.
- When pressing _ArrowRight_ or _ArrowLeft_ key,
  - user can navigate among selected badge(s)' remove buttons.

## Gotchas

Before start interacting with this component, it is important to note a couple of gotchas at this point. They are all known to be related to the misimplementation of code logics somewhere and hopefully they will be fixed in the future. The list is below:

- When pressing _ArrowDown_ key for the second time (the first time it is pressed, options wrapper will be opeend as stated above), the focus will immediately be on the second option. The expected behavior is that the focus should be on the first option but it is not. Except for the first time, the first option will be focusable, though.

- When focus is on any option and pressing _Space_ key to toggle selection status of that option, options wrapper will be scrolled up or down for some reason and the currently focused option will be out of sight. However, when pressing either _ArrowUp_ or _ArrowDown_ key, the focus and the next focused option will be visible again.

- When focus is on any badge(s)' remove button, if _Space_ key is pressed, the selection will be removed as expected, but the focus order will be lost. In order to get the focus back, _Tab_ button should be pressed.

- When making a search, e.g. searching for _`ick s    `_ string, the API will still return the results including such as _Rick Sanchez_, but `ick S` token will not be highlighted in that case. The expected behavior is that API should not return such results due to the mismatch of search string and the resulted string and the logic to highlight matched string token is designed based on this assumption. One way would be to trim the searched string from the end to discard `\s` character(s), but it is deliberately not implemented.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
