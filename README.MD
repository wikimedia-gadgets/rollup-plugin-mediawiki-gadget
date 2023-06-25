# rollup-plugin-mediawiki-gadget

<a href="https://www.npmjs.com/package/rollup-plugin-mediawiki-gadget">
  <img src="https://img.shields.io/npm/v/rollup-plugin-mediawiki-gadget.svg" alt="npm version" >
</a>

Roll up MediaWiki gadgets with modern goodies.

This plugin provides support for integrating Rollup with external packages from MediaWiki ResourceLoader.


## Usage
`gadget-def.txt`:
```
* codextest [ResourceLoader | package | dependencies=user.options ] | codextest.js | codextest-main.js | codextest-ChangeNameDialog.js
```

`rollup.config.js`:
```js
import mwGadget from 'rollup-plugin-mediawiki-gadgets';

export default {
  output:{
    format: 'cjs', // Or 'iife' for a single bundle
  },
  plugins: [
    mwGadget({
      // Note that the gadget must be ResourceLoader compatible
      gadgetDef: './gadget-def.txt',

      // Additional dependencies to load conditionally using import()
      // It will be transpiled to mw.loader.using calls on the fly
      softDependencies: ['vue', '@wikimedia/codex']
    })
  ]
};
```

### Vite Compatibility
To use with Vite you need to specify `enforce: 'pre'`.

`vite.config.js`:
```js
export default {
  plugins: [
    {
      ...mwGadget(/* ... */),
      enforce: 'pre'
    }
  ]
};
```
