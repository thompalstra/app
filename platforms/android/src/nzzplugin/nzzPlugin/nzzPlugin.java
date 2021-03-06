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

import android.content.Intent;
import android.content.Context;
import android.widget.Toast;

import android.os.Bundle;

import android.util.Log;

/**
 * This class echoes a string called from JavaScript.
 */
public class nzzPlugin extends CordovaPlugin {

    // @Override
    // static void onCreate(Bundle savedInstanceState){
    //     // super.onCreate(savedInstanceState);
    //
    // }

    private final String LOGTAG = getClass().getName();

	BarcodeManager decoder = null;
	ReadListener listener = null;

    CallbackContext scanCallbackContext = null;

    public void doubleTapToast(CallbackContext callbackContext){
        Context context = cordova.getActivity().getApplicationContext();
        int duration = Toast.LENGTH_LONG;
        Toast toast = Toast.makeText(context, "Double tap the back button to exit", duration);
        toast.show();

        PluginResult result = new PluginResult(PluginResult.Status.OK, "");
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    public void minimize(CallbackContext callbackContext) {
        Intent startMain = new Intent(Intent.ACTION_MAIN);
        startMain.addCategory(Intent.CATEGORY_HOME);
        startMain.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        // this.startActivity(startMain);
        Context context=this.cordova.getActivity().getApplicationContext();
        //or Context context=cordova.getActivity().getApplicationContext();
        // Intent intent=new Intent(context,Next_Activity.class);

        context.startActivity(startMain);
        //or cordova.getActivity().startActivity(intent);
    }

    public void showStartSyncToast(CallbackContext callbackContext){
        Context context = cordova.getActivity().getApplicationContext();
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(context, "Synchroniseren...", duration);
        toast.show();

        PluginResult result = new PluginResult(PluginResult.Status.OK, "");
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }
    public void showEndSyncToast(CallbackContext callbackContext){
        Context context = cordova.getActivity().getApplicationContext();
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(context, "Synchronisatie voltooid.", duration);
        toast.show();

        PluginResult result = new PluginResult(PluginResult.Status.OK, "");
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }


    public void registerScanner(CallbackContext callbackContext){



        this.scanCallbackContext = callbackContext;

        Log.i(LOGTAG, "onResume");

		// If the decoder instance is null, create it.
		if (decoder == null) { // Remember an onPause call will set it to null.
			decoder = new BarcodeManager();
		}

		// From here on, we want to be notified with exceptions in case of errors.
		ErrorManager.enableExceptions(true);

		try {

			// Create an anonymous class.
			listener = new ReadListener() {

				// Implement the callback method.
				@Override
				public void onRead(DecodeResult decodeResult) {
                    String message = decodeResult.getText();
                    PluginResult resulta = new PluginResult(PluginResult.Status.OK, message);
                    resulta.setKeepCallback(true);
                    scanCallbackContext.sendPluginResult(resulta);
				}


			};

			// Remember to add it, as a listener.
			decoder.addReadListener(listener);

            Context context = cordova.getActivity().getApplicationContext();
            int duration = Toast.LENGTH_LONG;
            Toast toast = Toast.makeText(context, "Scanner registered...", duration);
            toast.show();

		} catch (DecodeException e) {
            Context context = cordova.getActivity().getApplicationContext();
            int duration = Toast.LENGTH_LONG;
            Toast toast = Toast.makeText(context, "Could not register scanner.", duration);
            toast.show();

			// Log.e(LOGTAG, "Error while trying to bind a listener to BarcodeManager", e);
		}
    }

    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("coolMethod")) {
            String message = args.getString(0);
            this.coolMethod(message, callbackContext);
            return true;
        } else if(action.equals("registerScanner")){
            this.registerScanner(callbackContext);
            return true;
        } else if(action.equals("doubleTapToast")){
            this.doubleTapToast(callbackContext);
            return true;
        } else if(action.equals("showStartSyncToast")){
            this.showStartSyncToast(callbackContext);
            return true;
        } else if(action.equals("showEndSyncToast")){
            this.showEndSyncToast(callbackContext);
            return true;
        } else if(action.equals("minimize")){
            this.minimize(callbackContext);
            return true;
        }
        return false;
    }

    private void coolMethod(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}
