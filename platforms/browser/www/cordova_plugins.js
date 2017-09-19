cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nzzplugin/www/nzzPlugin.js",
        "id": "nzzplugin.nzzPlugin",
        "pluginId": "nzzplugin",
        "clobbers": [
            "cordova.plugins.nzzPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "nzzplugin": "0.0.1"
}
// BOTTOM OF METADATA
});