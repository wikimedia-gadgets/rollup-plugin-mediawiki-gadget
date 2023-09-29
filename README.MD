# rollup-plugin-mediawiki-gadget

<a href="https://www.npmjs.com/package/rollup-plugin-mediawiki-gadget">
  <img src="https://img.shields.io/npm/v/rollup-plugin-mediawiki-gadget.svg" alt="npm version" >
</a>

Roll up MediaWiki gadgets with modern goodies.

This plugin provides support for integrating Rollup with external packages from MediaWiki ResourceLoader.


## Usage
`.gadgetdefinition`:
```
* my-gadget [ ResourceLoader | package | dependencies=user.options ] | my-gadget.js | my-gadget-main.js | my-gadget-AppComponent.js
```

`rollup.config.js`:
```js
import mwGadget from 'rollup-plugin-mediawiki-gadgets';

export default {
  output:{
    // Or 'iife' for a single bundle
    format: 'cjs',

    // By default the generated code uses arrow functions for smaller code size
    // Set this if you need ECMAScript 5 compatibility
    generatedCode: 'es5',
  },
  plugins: [
    mwGadget({
      // Note that the gadget must be ResourceLoader compatible
      gadgetDef: '.gadgetdefinition',

      // Additional dependencies to load conditionally using import()
      // It will be transpiled to mw.loader.using calls on the fly
      softDependencies: ['vue', '@wikimedia/codex'],
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
