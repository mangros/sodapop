if (Tulo) {

  var Sodapop = (function($) {

    var version = "0.1";
    var initialized = 0;
    var data = {};
    var display_name = "";
    var email = "";
    var frozen_packages = [];
    var frozen_until = "";
    var previous_packages = [];
    var active_products = [];

    var Encoding = {
        encode:function(input) {
            var encoded = encodeURIComponent(input);
            return encoded;
        },
        decode:function(input) {
            var decoded = decodeURIComponent(input);
            return decoded;
        }
    };
    var Cookie = {
      setCookie:function (key, value, options) {
        key = "SODAPOP_" + key;
          if (value !== undefined) {
              options = $.extend({}, options);

              if (value === null) {
                  options.expires = -1;
              }

              if (typeof options.expires === 'number') {
                  var days = options.expires, t = options.expires = new Date();
                  t.setDate(t.getDate() + days);
              }

              return (document.cookie = [
                  Encoding.encode(key), '=', Encoding.encode(String(value)),
                  options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                  options.path    ? '; path=' + options.path : '',
                  options.domain  ? '; domain=' + options.domain : '',
                  options.secure  ? '; secure' : ''
              ].join(''));
          }
      },
      getCookie:function (key) {
        key = "SODAPOP_" + key;
          var cookies = document.cookie.split('; ');
          for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
              if (Encoding.decode(parts.shift()) === key) {
                  var value = parts.join('=');
                  return Encoding.decode(value);
              }
          }
          return null;
      }
    };
    var Options = {

    };
    var Dialog = {

      show: function(id, options, onclose) {
        if (Cookie.getCookie(id) == 1) {
          log("Cookie "+id+" prevents dialog to be shown");
          return;
        }
        if (Sodapop.initialized > 1 ) {
          return;
        }

        if (options.plugin == "bar") {
          if (options.timeout === undefined) {
            options.timeout = 30*1000;
          }
          Dialog.open_bar(id, options);
        }
        else {
          var opts = {
            type: "info",
            hide: false,
            buttons: {
              sticker: false
            }
          };
          opts = $.extend(opts, options)
          notice = new PNotify(opts);
          notice.get().click(function(e) {
            if (notice.state == "closing" || notice.state == "open") {
              if (opts.show_again != 0) {
                var expires = new Date();
                expires.setSeconds(expires.getSeconds() + opts.show_again);
                Cookie.setCookie(id, 1, {expires: expires});
              }

              if (onclose !== undefined) {
                onclose;
              }
            }
          });
        }
      },
      open_bar: function(id, options, title, message) {
          var tulodiv = $('#tulo-msg');
          if (options.type == "info" ) {
            tulodiv.css("background-color", "#d9edf7");
            $("#tulo-title").css("color", "#31708f");
            $("#tulo-msg .tulo-message").css("color", "#31708f");
          }
          else if (options.type == "error"){
            tulodiv.css("background-color", "#f2dede");
            $("#tulo-title").css("color", "#a94442");
            $("#tulo-msg .tulo-message").css("color", "#a94442");
          }

          $("#tulo-title").text(options.title);
          $("#tulo-msg .tulo-message").html(options.text);
          tulodiv.bind('click', function() {
              $(this).slideUp(200);
              if (options.show_again != 0) {
                var expires = new Date();
                expires.setSeconds(expires.getSeconds() + options.show_again);
                Cookie.setCookie(id, 1, {expires: expires});
              }
          });
          tulodiv.slideDown("slow");
          setTimeout(function() { tulodiv.slideUp(500) }, options.timeout);
          return false;
      }


    };
    var Payload = {
      register:function (payload) {
        if (Sodapop.initialized >= 1 ) {
          Sodapop.initialized = Sodapop.initialized + 1;
          return;
        }

        log("Initializing soda ["+Sodapop.initialized+"]");
        if (payload !== undefined) {
          if (payload.session.active) {
            Sodapop.display_name = payload.session.display_name;
            Sodapop.email = payload.session.contact_email;
            Sodapop.data = payload.session;
            if (payload.session.frozen_products !== undefined) {
              Sodapop.frozen_products = payload.session.frozen_products.product_codes;
              Sodapop.frozen_until = payload.session.frozen_products.grace_period_to;
            }
            if (payload.session.previous_packages !== undefined) {
              Sodapop.previous_packages = payload.session.previous_packages;
            }
            if (payload.session.products !== undefined) {
              Sodapop.active_products = payload.session.products;
            }
          }
          Sodapop.initialized = Sodapop.initialized + 1;
        }
      },
      register_listener: function(type, options, callback) {
        if (type == 'active') {
          if (Sodapop.active_products.length > 0) {
            if (Payload.has_product(options.product_code)) {
              callback(Sodapop.active_products);
            }
          }
        }
        else if (type == 'frozen') {
          if (Sodapop.frozen_products.length > 0) {
            callback(Sodapop.frozen_products, Sodapop.frozen_until);
          }
        }
        else if (type == 'previous') {
          if (Sodapop.previous_packages.length > 0) {
            if (options.product_code !== undefined) {
              var had_product = false;
              jQuery.each(Sodapop.previous_packages, function(i) {
                var previous = Sodapop.previous_packages[i];
                log("Previous: "+previous);
                if (previous == options.product_code) {
                  callback(previous);
                  return false;
                }
              })
            }
            else {
              callback(Sodapop.previous_packages);
            }
          }
        }
        else if (type == 'data') {
          criteria = options.criterias;
          fulfilled = [];
          jQuery.each(criteria, function(i) {
            crit = criteria[i];
            if (crit.ctype == "field") {
              if (crit.name !== undefined) {
                var field = "Sodapop.data."+crit.name;
                var field_data = eval(field);
                if (crit.empty) {
                  if (field_data == "" ) {
                    fulfilled.push(crit.name);
                  }
                }
                else {
                  if (field_data != "") {
                    fulfilled.push(crit.name);
                  }
                }
              }
            }
            else if (crit.ctype == "product") {
              if (crit.state == "active") {
                if (Payload.has_product(crit.name)) {
                  fulfilled.push(crit.name);
                }
              }
              else if (crit.state == "previous") {
                if (Payload.had_product(crit.name)) {
                  fulfilled.push(crit.name);
                }
              }
            }
          });
          if (fulfilled.length == criteria.length) {
            log("Criteria has been fulfilled!");
            callback(Sodapop.data);
          }
          else {
            log("Criteria has not been fulfilled.");
          }
        }
      },
      has_product: function(product_code) {
        var has_product = false;
        jQuery.each(Sodapop.active_products, function(i) {
          if (Sodapop.active_products[i] == product_code) {
            has_product = true;
            return false;
          }
        })
        return has_product;
      },
      had_product: function(product_code) {
        var had_product = false;
        jQuery.each(Sodapop.previous_packages, function(i) {
          var previous = Sodapop.previous_packages[i];
          log("Previous: "+previous);
          if (previous == product_code) {
            had_product = true;
            return false;
          }
        })
        return had_product;
      }
    };

    var log = function(message) {
        console.log("<SODAPOP> "+message);
    };


    return {
      init: function(payload, options) {
        Payload.register(payload);
      },
      show_dialog: function(options, callback) {
        Dialog.show(options, callback);
      },
      add_frozen_package_listener: function(options, callback) {
        Payload.register_listener('frozen', options, callback);
      },
      add_previous_package_listener: function(options, callback) {
        Payload.register_listener('previous', options, callback);
      },
      add_active_package_listener: function(options, callback) {
        Payload.register_listener('active', options, callback);
      },
      add_data_listener: function(options, callback) {
        Payload.register_listener('data', options, callback);
      },
    }

  })(jQuery.noConflict());

  Sodapop.initialized = 0;
}
