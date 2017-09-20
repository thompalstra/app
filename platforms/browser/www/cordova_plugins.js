cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nzzplugin/www/nzzPlugin.js",
        "id": "nzzplugin.nzzPlugin",
        "pluginId": "nzzplugin",
        "clobbers": [
            "cordova.plugins.nzzPlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/src/browser/StatusBarProxy.js",
        "id": "cordova-plugin-statusbar.StatusBarProxy",
        "pluginId": "cordova-plugin-statusbar",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "nzzplugin": "0.0.1",
    "cordova-plugin-statusbar": "2.2.3"
}
// BOTTOM OF METADATA
});