import { readFileSync } from 'fs';
import type { NormalizedOutputOptions, Plugin } from 'rollup';

interface MwGadgetConfig {
  /** Path of the gadget definition file. */
  gadgetDef: string,
  /** Additional lazy-load dependencies. */
  softDependencies?: string[],
}

const OPTION_REGEX = /\[(.*?)\]/;

function getGadgetDependencies(gadgetDefPath: string): string[] {
  const content = readFileSync(gadgetDefPath).toString();
  const match = content.match(OPTION_REGEX);
  if (match === null) {
    throw new Error('[rollup-plugin-mediawiki-gadget] Invalid gadget definition.')
  }
  const options = match[1].split('|').map((i) => i.trim());
  if (!options.includes('ResourceLoader')) {
    throw new Error('[rollup-plugin-mediawiki-gadget] Gadget needs to be ResourceLoader compatible.')
  }
  for (const option of options) {
    if (option.startsWith('dependencies')) {
      const dependencies = option.split('=')[1]
        .trim()
        .split(',')
        .map((i) => i.trim());
      return dependencies;
    }
  }
  return [];
}

/**
 * Plugin to respect external dependencies from gadget definition, and transpile dynamic imports.
 * @param config plugin config
 * @returns
 */
function mwGadget(config: MwGadgetConfig): Plugin {
  const dependencies = getGadgetDependencies(config.gadgetDef);
  const softDependencies = config.softDependencies ?? [];
  let outputOptions: NormalizedOutputOptions;

  return {
    name: 'mediawiki-gadget',
    async resolveId(source) {
      if ([...dependencies, ...softDependencies].includes(source)) {
        return false;
      }
    },
    async renderStart(receivedOutputOptions) {
      outputOptions = receivedOutputOptions;
    },
    renderDynamicImport({ targetModuleId }) {
      if (targetModuleId && softDependencies.includes(targetModuleId)) {
        return {
          left: 'mw.loader.using(',
          right: outputOptions.generatedCode.arrowFunctions
            ? `).then(require=>require("${targetModuleId}"))`
            : `).then(function(require){return require("${targetModuleId}")})`,
        };
      }
    },
  };
}

export default mwGadget;
