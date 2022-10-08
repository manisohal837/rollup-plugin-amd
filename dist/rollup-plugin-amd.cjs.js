'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var convert = _interopDefault(require('@buxlabs/amd-to-es6'));
var rollupPluginutils = require('rollup-pluginutils');

var firstpass = /\b(?:define)\b/;
var importStatement = /\b(import .*['"])(.*)(['"].*\n)/g;

function index(options) {
    if ( options === void 0 ) options = {};

    options.converter = options.converter || {};
    options.converter.sourceMap = options.converter.hasOwnProperty('sourceMap') ? options.converter.sourceMap : true;

    var filter = rollupPluginutils.createFilter( options.include, options.exclude );

    return {
        name: 'amd',

        transform: function transform (code, id) {
            if ( !filter( id ) ) { return; }
            if ( !firstpass.test( code ) ) { return; }

            var transformed = convert(code, options.converter);

            if (typeof transformed === 'object') {
                transformed.code = transformed.source;
                delete transformed.source;
            }

            if (options.rewire) {
                if (typeof transformed === 'object') {
                    transformed.code = transformed.code.replace(importStatement, function (match, begin, moduleId, end) {
                        return ("" + begin + (options.rewire(moduleId, id) || moduleId) + end);
                    });
                } else {
                    transformed = transformed.replace(importStatement, function (match, begin, moduleId, end) {
                        return ("" + begin + (options.rewire(moduleId, id) || moduleId) + end);
                    });
                }
            }

            return transformed;
        }
    };
}

module.exports = index;
//# sourceMappingURL=rollup-plugin-amd.cjs.js.map
