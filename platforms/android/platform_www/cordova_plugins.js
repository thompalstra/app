cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "nzzplugin.nzzPlugin",
        "file": "plugins/nzzplugin/www/nzzPlugin.js",
        "pluginId": "nzzplugin",
        "clobbers": [
            "cordova.plugins.nzzPlugin"
        ]
    },
    {
        "id": "cordova-plugin-statusbar.statusbar",
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "nzzplugin": "0.0.1",
    "cordova-plugin-statusbar": "2.2.3"
};
// BOTTOM OF METADATA
});