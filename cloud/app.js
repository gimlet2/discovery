// These two lines are required to initialize Express in Cloud Code.
require('cloud/app.js');
express = require('express');
app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
app.use(express.basicAuth('username', 'password'));

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function (req, res) {
    res.send({message: 'Congrats, you just set up your app!'});
});

app.post('/service', function (req, res) {
    var Service = Parse.Object.extend("Service");

    var query = new Parse.Query("Service");
    query.equalTo('name', req.body.name);
    query.find({
        success: function (result) {
            if (result.length === 0) {
                var service = new Service();
                service.set('name', req.body.name);
                service.set('ip', req.body.ip);
                service.set('type', req.body.type);
                service.save(null, {
                    success: function (r) {
                        res.send(201);
                    }, error: function (e) {
                        res.send(500, e.message);
                    }
                });
            } else {
                var service = result[0];
                service.set('name', req.body.name);
                service.set('ip', req.body.ip);
                service.set('type', req.body.type);
                service.save(null, {
                    success: function (r) {
                        res.send(200);
                    }, error: function (e) {
                        res.send(500, e.message);
                    }
                });
            }
        }, error: function (e) {
        }
    })


});

app.get('/service', function (req, res) {
    var query = new Parse.Query("Service");
    var callback = {
        success: function (result) {
            res.send(result);
        }, error: function (e) {
            res.send(500, e.message);
        }
    };
    if (req.query.type) {
        query.equalTo('type', req.query.type);
        query.find(callback);
    } else if (req.query.name) {
        query.equalTo('name', req.query.name);
        query.first(callback);
    }

});

app.listen();
