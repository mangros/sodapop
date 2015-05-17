# Sodapop

## JS library interpreting data from Tulo Payway

### Disclaimer
This is a small library developed for the purpose of demonstrating how the Tulo Payway JS-API can be utilized. Use this library as you wish but do not expect it to be maintained by the team behind Tulo Payway. Some of the features in this library _might_ end up in the finished JS-library developed by the team.

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

### Features
* Add data listeners and create criterias for either account-properties or product-data and combine them to display relevant dialogs to your customers.
* Sodapop issues callbacks when criterias are met which makes it easy to either display a dialog, notification or some kind of banner. Or something completely different.
* Basic support for [PNotify](http://sciactive.github.io/pnotify/) for displaying dialogs as well as a homegrown "push-down-bar" type of notification.
* Basic support for handling dialogs user has closed using cookies, making them stay away for a configurable period of time.

### Requirements
* [JQuery](https://jquery.com/)
* [PNotify](http://sciactive.github.io/pnotify/) for these type of notifications
* [Bootstrap](http://getbootstrap.com/) for nice looking PNotify dialogs

#### Optional
* [Moment.js](http://momentjs.com/) for nice date-formatting


### Howto

#### Basic structure
Add necessary requirements to your HTML layout page. Sample below:

```
<!DOCTYPE html>
<html>
<head>
  <title>Sample Sodapop</title>
  <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <!-- Optional theme -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
  <link rel="stylesheet" href="/css/pnotify.custom.min.css">  <!-- download if you wish to use pnotify -->
  <link rel="stylesheet" href="/css/sodapop.css"> <!-- included with sodapop -->


  <!-- Latest compiled and minified JavaScript -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
  <script src="http://tulo-api.test.adeprimo.se/javascript/tulo_js_api.js"></script>
  <script src="/js/sodapop.js"></script> <!-- included with sodapop -->
  <script src="/js/pnotify.custom.min.js"></script> <!-- download if you wish to use pnotify -->
  <script src="/js/moment-with-locales.js"></script> <!-- download if you wish to use moment.js -->
</head>
<body>
  <!-- "tulo-msg" container is the homegrown push-down-bar container, remove if you wish. -->
  <div id="tulo-msg">
    <div class="tulo-container">
      <h3 id="tulo-title"></h3>
      <div class="tulo-message"></div>
      <button class="tulo-close">Stäng</button>
    </div>
  </div>
  <!-- main container -->
  <div class="container">
    <!-- content here -->
  </div>
</body>
</html>

```

#### Connect with Tulo
Add Sodapop on event-listener for the session envelop, and add data-listeners. Sample below:
```
Tulo.register_event_listener('session_status_envelope', function (data) {
  Sodapop.init(data);
  Sodapop.add_data_listener({ criterias: [{ctype: "field", name: "customer_number", empty: true}]}, function (data) {
    Sodapop.show_dialog("activate", {
      type: "info",
      title: "Prenumererar du på papperstidningen?",
      text: "Hej "+Sodapop.display_name + "! Om du är prenumerant på papperstidningen kan du när som helst aktivera dina digitala produkter genom att registrera ditt abonnemang</a>.",
      show_again: 86400
    })
  });
  Sodapop.add_data_listener({ criterias: [{ctype: "field", name: "first_name", empty: true}, {ctype: "field", name: "last_name", empty: true}]}, function (data) {
    Sodapop.show_dialog("personalize", {
      plugin: "bar",
      type: "info",
      title: "Hej Jane Doe!",
      text: Sodapop.email + ", det ser inte ut som att du har personaliserat ditt konto ännu, du vet väl att du när som helst kan gå till mitt konto<för att fylla på din profil?",
      show_again: 86400
    })
  });
  Sodapop.add_data_listener({ criteria: [{ctype: "product", name: "gp_lasvarde", state: "active"}, {ctype: "field", name: "mobile_number", empty: false}, {ctype: "field", name: "loyalty_card_number", empty: true}]}, function (data) {
    Sodapop.show_dialog("loyalty_card_simple", {
      type: "info",
      title: "Bara ett klick från spännande erbjudanden!",
      text: "Hej "+Sodapop.display_name+"! Det ser ut som att du är berättigad till ett Läsvärdes-kort, du kan enkelt aktivera ditt läsvärdeskort på mitt konto och få en länk skickad till din mobiltelefon."
    })
  });

});
```
##### API

###### Sodapop.init
Takes the session envelop from Tulo as parameter and does some very basic parsing of the data. This should be added before any data listeners are addded.

###### Sodapop.add_data_listener
Takes a JSON object representing one or several criterias as parameter along with a callback that will be called when the specified criterias have been met.

**Criterias**

A criteria object have the following properties:
* ctype - string - determines what kind of data should be checked for this criteria (mandatory)
  * Valid: "field", "product"
* name - string - identifies the data that should be checked
* empty - bool - should this value be emopty or not? Only valid if ctype == 'field'
* state - string - if ctype == "product" indicates the state of the product
  * Valid: "active", "previous"



###### Sodapop.show_dialog

Parameters:
* Id - string - identifier for the dialog, is used for cookie-handling.
* Options - JSON-oject - determines what kind of dialog should be shown.

**Options**

JSON object determining what kind of notification should be shown and when it should be shown to the user again.
* type - string - valid types for PNotify notifications, such as "info" and "error".
* title - string (html)- title of dialog
* text - string (html) - text for dialog
* show_again - int - number of seconds before next showing of this dialog
* plugin - string - used to change dialog plugin, optional. Omit this and PNotify will be used as default
  * Valid: "bar"
