package nzzplugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.datalogic.decode.BarcodeManager;
import com.datalogic.decode.DecodeException;
import com.datalogic.decode.DecodeResult;
import com.datalogic.decode.ReadListener;
import com.datalogic.device.ErrorManager;

import android.content.Context;
import android.widget.Toast;

import android.os.Bundle;

import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class nzzPlugin extends CordovaPlugin {

    private final String LOGTAG = getClass().getName();
    BarcodeManager decoder = null;
    ReadListener listener = null;
    CallbackContext scanCallbackContext = null;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if(action.equals("registerScanner")){
            this.registerScanner(callbackContext);
            return true;
        }
        return false;
    }

    public void registerScanner(CallbackContext callbackContext){
        Context context = cordova.getActivity().getApplicationContext();
        int duration = Toast.LENGTH_LONG;

        Toast toast = Toast.makeText(context, "Hello World @ start", duration);
        toast.show();

        this.scanCallbackContext = callbackContext;
        Log.i(LOGTAG, "onResume");
            decoder = new BarcodeManager();
        }
        ErrorManager.enableExceptions(true);
        try {
            listener = new ReadListener() {
                @Override
                public void onRead(DecodeResult decodeResult) {
                    String message = decodeResult.getText();
                    PluginResult resulta = new PluginResult(PluginResult.Status.OK, "first response");
                    resulta.setKeepCallback(true);
                    scanCallbackContext.sendPluginResult(resulta);
                }
            };
            decoder.addReadListener(listener);

        } catch (DecodeException e) {
            Log.e(LOGTAG, "Error while trying to bind a listener to BarcodeManager", e);
        }
    }
}
