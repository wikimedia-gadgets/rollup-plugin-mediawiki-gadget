# rollup-plugin-mediawiki-gadget

Roll up MediaWiki gadgets with modern goodies.

This plugin provides support for integrating Rollup with external packages from MediaWiki ResourceLoader.


## Usage
`gadget-def.txt`:
```
* codextest [ResourceLoader | package | dependencies=user.options ] | codextest.js | codextest-main.js | codextest-ChangeNameDialog.js
```

`vite.config.js`:
```js
import mwGadgets from 'rollup-plugin-mediawiki-gadgets';

export default {
  plugins: [
    mwGadgets({
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
To use with Vite you need to specify `enforce: 'pre'`:
```js
export default {
  plugins: [
    {
      ...mwGadgets(/* ... */),
      enforce: 'pre'
    }
  ]
};
```
