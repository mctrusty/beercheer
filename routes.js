var uu      = require('underscore')
  , db      = require('./models')
  , Constants = require('./constants');

var build_errfn = function(errmsg, response) {
    return function errfn(err) {
	console.log(err);
	response.send(errmsg);
    };
};

/*
   Define the routes for the app, i.e. the functions
   which are executed once specific URLs are encountered.

    example.com/ -> indexfn
    example.com/orders -> orderfn
    example.com/refresh_orders -> refresh_orderfn
    example.com/api/orders -> api_orderfn

   Specifically, in each case we get an HTTP request as a JS object
   ('request') and use it along with internal server variables to synthesize
   and return an HTTP response ('response'). In our simple example none of
   the features of the request are used aside from the path itself; in a
   more complex example you might want to return different results on the
   basis of the user's IP.

   The responses are generated by accessing the "Order" table in the local
   PostgreSQL database through the Sequelize ORM (specifically through
   model/order.js) and using the resulting Order instances to either
   populate server-side templates (via response.render), to trigger a
   redirect to another URL (via response.redirect), or to directly send data
   (via response.json or response.send).

   Note that to the maximum extent possible, these handler functions do not
   do heavy work on Order instances. We save that for the classMethods and
   instanceMethods defined in model/order.js. Instead, route handlers focus
   on the networking aspects of parsing the request and response, initiating
   the query to the database, and packaging it all up in a request.
*/
var indexfn = function(request, response) {
    response.render("homepage", {
	name: Constants.APP_NAME,
	title: "My First " + Constants.APP_NAME,
	product_name: Constants.PRODUCT_NAME,
	twitter_username: Constants.TWITTER_USERNAME,
	twitter_tweet: Constants.TWITTER_TWEET,
	product_short_description: Constants.PRODUCT_SHORT_DESCRIPTION,
	coinbase_preorder_data_code: Constants.COINBASE_PREORDER_DATA_CODE
    });
};

var orderfn = function(request, response) {
    var successcb = function(orders_json) {
	response.render("orderpage", {orders: orders_json});
    };
    var errcb = build_errfn('error retrieving orders', response);
    global.db.Order.allToJSON(successcb, errcb);
};

var api_orderfn = function(request, response) {
    var successcb = function(totals) {
	var data = uu.extend(totals,
			     {target: Constants.FUNDING_TARGET,
			      unit_symbol: Constants.FUNDING_UNIT_SYMBOL,
			      days_left: Constants.days_left()});
	data.total_funded *= Constants.FUNDING_SI_SCALE;
	response.json(data);
    };
    var errcb = build_errfn('error retrieving API orders', response);
    global.db.Order.totals(successcb, errcb);
};

var refresh_orderfn = function(request, response) {
    var cb = function(err) {
	if(err) {
	    console.log("Error in refresh_orderfn");
	    response.send("Error refreshing orders.");
	} else {
	    response.redirect("/orders");
	}
    };
    global.db.Order.refreshFromCoinbase(cb);
};


/*
   Helper functions which create a ROUTES array for export and use by web.js

   Each element in the ROUTES array has two fields: path and fn,
   corresponding to the relative path (the resource asked for by the HTTP
   request) and the function executed when that resource is requested.

     [ { path: '/', fn: [Function] },
       { path: '/orders', fn: [Function] },
       { path: '/api/orders', fn: [Function] },
       { path: '/refresh_orders', fn: [Function] } ]

   It is certainly possible to implement define_routes with a simple for
   loop, but we use a few underscore methods (object, zip, map, pairs), just
   to familiarize you with the use of functional programming, which
   becomes more necessary when dealing with async programming.
*/
var define_routes = function(dict) {
    var toroute = function(item) {
	return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
    };
    return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_routes({
    '/': indexfn
//    '/orders': orderfn,
//    '/api/orders': api_orderfn,
//    '/refresh_orders': refresh_orderfn
});

module.exports = ROUTES;
