/**
 * Setups default Users, Roles and Devices for the system.
 */
function WebAdaSetup(req, resp){
    
    const DEFAULT_USERS = [{
        // User Credentials for the default Portal Viewer User
        email: "webada_user@clearblade.com",
        password: "clearblade", // recommended to change this to something unique
        roles: ["webada Portal Viewer"]
    }, {
        // User Credentials for the default Portal Editor User
        email: "webada_editor@clearblade.com",
        password: "clearblade", // recommended to change this to something unique
        roles: ["webada Portal Editor"]
    }];
    
    const DEFAULT_DEVICES = [{
        // Default device used for by the webhook-adapter
        device_name: "webhook-adapter",
        active_key: "clearblade", // recommended to change this to something unique (if changed, you will need to update the active key in the adapter config, see the README.md for full details)
        roles: ["webada Webhook Adapter"],
        type: "adapter"
    }, {
        // Example device that can be updated via a webhook
        device_name: "zone328-temp",
        active_key: "clearblade", // recommended to change this to something unique
        roles: [],
        type: "zone-temp",
        temperature: 0
    }];
    
    
    SetupAssistant(webada_platform_url, req, DEFAULT_USERS, DEFAULT_DEVICES, function (err, data) {
        if (err) {
            log("Failed to setup system: " + data);
            resp.error("failed");
        } else {
            resp.success('All Users, Devices, and Roles have been setup successfully for the webhook-adapter IPM package!');
        } 
    });
    
    
}

