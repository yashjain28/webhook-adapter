function SetupAssistant(platformURL, requestObj, users, devices, callback) {
    
    if (platformURL === undefined || platformURL === null || platformURL === "") {
        callback(true, "Platform URL is required");
    }
    
    var roleNameToIdMap = {};
    
    function getSystemRoles() {
        var options = {
            uri: platformURL + "/admin/user/" + requestObj.systemKey + "/roles",
            headers: {"ClearBlade-DevToken": requestObj.userToken}
        };
        var requestObject = Requests();
        requestObject.get(options, function (err, httpresponse) {
            if (err === true) {
                callback(true, "Failed to fetch system roles: " + httpresponse);
            } else {
                roles = JSON.parse(httpresponse);
                for (var x = 0; x < roles.length; x++) {
                    roleNameToIdMap[roles[x].Name] = roles[x].ID;
                }
                createUsers();
            }
        });
    }
    
    function createUsers() {
        if (users && users.length > 0) {
            var createdUsersCount = 0;
            for (var x = 0; x < users.length; x++) {
                ClearBlade.init({
                    systemKey: requestObj.systemKey,
                    systemSecret: requestObj.systemSecret,
                    registerUser: true,
                    email: users[x].email,
                    password: users[x].password,
                    callback: function (user, err, body) {
                        log(JSON.stringify(user.roles));
                        if (err) {
                            callback(true, "Failed to create user: " + JSON.stringify(body));
                        } else {
                            var new_user_id = body.user_id;
                            
                            ClearBlade.init({request: requestObj});
                            
                            var rolesToAdd = [];
                            
                            for (var y = 0; y < user.roles.length; y++) {
                                rolesToAdd.push(roleNameToIdMap[user.roles[y]]);
                            }
                            
                            var options = {
                                uri: platformURL + "/admin/user/" + requestObj.systemKey,
                                headers: {"ClearBlade-DevToken": requestObj.userToken},
                                body: {
                                    user: new_user_id,
                                    changes: {
                                        roles: {
                                            add: rolesToAdd
                                        }
                                    }
                                }
                            };
                            var requestObject = Requests();
                            requestObject.put(options, function (err, httpresponse) {
                                if (err) {
                                    callback(true, "Failed to Add Roles to User: " + httpresponse);
                                } else {
                                    createdUsersCount++;
                                    if (createdUsersCount === users.length) {
                                        createDevices();
                                    }
                                }
                            });
                        }
                    }.bind(this, users[x])
                });
            }
        } else {
            createDevices();
        }
        
    }
    
    function createDevices() {
        if (devices && devices.length > 0) {
            var createdDevicesCount = 0;
            for (var x = 0; x < devices.length; x++) {
                var deviceObj = {
                    allow_certificate_auth: false,
                    allow_key_auth: true,
                    active_key: devices[x].active_key,
                    enabled: true,
                    name: devices[x].device_name,
                    type: devices[x].type,
                    state: ""
                };
                ClearBlade.createDevice(devices[x].device_name, deviceObj, true, function (device, err, data) {
                    if (err) {
                        callback(true, "Failed to create device: " + JSON.stringify(data));
                    } else {
                        var rolesToAdd = [];
                        
                        for (var y = 0; y < device.roles.length; y++) {
                            rolesToAdd.push(roleNameToIdMap[device.roles[y]]);
                        }
                        
                        var options = {
                            uri: platformURL + "/admin/devices/roles/" + requestObj.systemKey + "/" + device.device_name,
                            headers: {"ClearBlade-DevToken": requestObj.userToken},
                            body: {
                                add: rolesToAdd
                            }
                        };
                        
                        var requestObject = Requests();
                        requestObject.put(options, function (err, httpresponse) {
                            if (err) {
                                callback(true, "Failed to add roles to device: " + httpresponse);
                            } else {
                                createdDevicesCount++;
                                if (createdDevicesCount === devices.length) {
                                    callback(false);
                                }
                            }
                        });
                    }
                }.bind(this, devices[x]));
                
            }
        } else {
            callback(false);
        }
    }
    
    getSystemRoles();
    
}