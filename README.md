# Sodapop

## JS library interpreting data from Tulo Payway

### Disclaimer
This is a small library developed for the purpose of demonstrating how the Tulo Payway JS-API can be utilized. Use this library as you wish but do not expect it to be maintained by the team behind Tulo Payway. Some of the features in this library might end up in the finished JS-library developed by the team.

### Usage

#### Basic steps
* Include this library in your page
* Hook it up to the Tulo "envelope" listener
* Register data listeners and add criterias for callbacks
* Implement dialogs depending on criterias and callbacks

##### Example

```
Tulo.register_event_listener('session_status_envelope', function (data) {
  Sodapop.init(data);
  Sodapop.add_data_listener({ criteria: [{ctype: "product", name: "gp_lasvarde", state: "active"}, {ctype: "field", name: "mobile_number", empty: false}, {ctype: "field", name: "loyalty_card_number", empty: true}]}, function (data) {
    console.log("Criteria for callback has been met!");
  });
}
```

_More documentation and samples will be added._
