/**
 * This service updates device columns. It is triggered by the _WebAdaIncomingWebhookRequest_ trigger.
 * @param {string} body.device_name - Name of the device whose column needs to be updated
 * @param {string} body.new_value - New value of the column to which it needs to be updated
 * @param {string} body.request_url - Request url of the incoming request
 */
function WebAdaDeviceUpdateViaWebhook(req, resp){
    const DEVICE_COLUMN_TO_UPDATE = "temperature";
    const URL_SHOULD_CONTAIN_FOR_DEVICE_UPDATE = "deviceUpdate";

    ClearBlade.init({request:req});
    
    var webhookData = JSON.parse(req.params.body);
    
    //only process the incoming webhook if the URL contains a path we expect
    if (webhookData.request_url.indexOf(URL_SHOULD_CONTAIN_FOR_DEVICE_UPDATE) > -1) {
        var deviceName = webhookData.body.device_name;
        var newValue = webhookData.body.new_value;
        var updateObj = {};
        updateObj[DEVICE_COLUMN_TO_UPDATE] = newValue;
        
        ClearBlade.updateDevice(deviceName, updateObj, true, function (err, data) {
            if (err) {
                log("Failed to update device: " + JSON.stringify(data));
                resp.error("Failed to update device!");
            } else {
                resp.success("Device Updated Successfully");
            }
        });
    }
}