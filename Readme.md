
# ipm package: webhook-adapter

## Overview

Example system for leveraging the ClearBlade [webhook-adapter](https://github.com/ClearBlade/webhook-adapter) to easily update a device from an external application.

This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)

## Setup

1. Modify the library called webada_constants to include the platform url you are using.
2. Save and Test the service called webadaSetup to create the webada_user@clearblade.com and webada_editor@clearblade.com example users, as well as the needed adapter device, and an example device to update later on.
3. Update the webhook-adapter-amd64 settings, specifically the Start-up Command, with your platform url, messaging url, listen port, system key, and system secret.

## Usage

In order to leverage this example system, you will need to have a gateway, cloud VM, or local VM to run a ClearBlade Edge on, which will run the webhook-adapter, and accept incoming HTTP requests.

Navigate to the Edges page of the console, and you will see an example Edge (Edge1) has already been created. You just need to select the setup instructions, and follow them to install and start the edge on your gateway/VM.

A few minutes after starting the edge, the webhook-adapter should be up and running. You can navigate to the Adapters page of the console, and verify this. If it is working as expected, the Status should be `Running`. Now you can easily test the adapter using a curl from the command line, or your favorite HTTP request application. Here is an example curl:

```bash
curl http://<gateway or VM IP address>:8008/deviceUpdate -X PUT -d '{"device_name":"zone328-temp", "new_value":87.3}'
```

### Code Services
- webadaDeviceUpdateViaWebhook 
- webadaGetHistory
- webadaSetup

### Code Libraries
- webada_constants
- webada_setup_assistant

### Code Triggers
- webadaIncomingWebhookRequest

### Portals
- webada Incoming Webhooks

## Thank you

Powered by ClearBlade Enterprise IoT Platform: [https://platform.clearblade.com](https://platform.clearblade.com)
