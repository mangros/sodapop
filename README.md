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
  <link rel="stylesheet" href="/css/pnotify.custom.min.css">  <!-- <- you need to download this -->  
  <link rel="stylesheet" href="/css/infomsg.css"> <!-- <- included with sodapop -->


  <!-- Latest compiled and minified JavaScript -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
  <script src="http://tulo-api.test.adeprimo.se/javascript/tulo_js_api.js"></script>
  <script src="/javascript/sodapop.js"></script>
  <script src="/javascript/pnotify.custom.min.js"></script>
  <script src="/javascript/moment-with-locales.js"></script>
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
