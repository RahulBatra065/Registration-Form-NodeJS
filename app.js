'use strict' // i am stupid am i rite?

var express = require('express');
var path = require('path');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var randomstring = require('randomstring')
var dbConn = mongodb.MongoClient.connect('process.env.MONGODB_URI');
const sgMail = require('@sendgrid/mail');
var math = require('math')
sgMail.setApiKey('process.env.SENDGRID_KEY');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/post-feedback', function(req, res) {
    dbConn.then(function(db) {
        var dbo = db.db("") //enter db name
        dbo.collection("registration-camp").find({ refferal: req.body.ref }).toArray(function(err, result) { //attempt to find a match with the entered ref id
            console.log(req.body)
                //console.log(req)
                //console.log(req.body.ref)
            if (result.length !== 0) {
                var dataRecd = req.body;
                var teamID = randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
                });
                var A;
                let time = (A) => {
                    var d = Date();
                    A = d.toString();

                    dataRecd['time'] = A;
                }
                time();

                dataRecd['teamID'] = 'EQ20' + teamID,
                    // response is not nil
                    // console.log(dataRecd['teamID'])
                    res.render('pages/regcool', {
                        time: req.body.time,
                        name: req.body.clname,
                        id: dataRecd['teamID'],
                        mail: req.body.clemail
                    });

                db.collection('registration').insertOne(dataRecd);
                var msg = {
                    to: req.body.clemail,
                    from: '',
                    subject: '',
                    dynamic_template_data: {

                        firstName: req.body.clname,
                        refferal: req.body.ref,
                        teamID: dataRecd['teamID']


                    },

                    templateId: '',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: 'nothing needed',
                };

                sgMail.send(msg);
            }
            if (result.length == 0) { //if response is nil
                res.render('pages/regnotcool', {
                    time: req.body.time

                });

            }
        });
    });
});

app.get('/checker', function(req, res) {
    res.render('pages/checker');
})
app.post('/checker-post', function(req, res) {
    dbConn.then(function(db) {
        var dbo = db.db("");
        dbo.collection("registration-camp").find({ refferal: req.body.refferal }).toArray(function(err, result) {
            // console.log(result);
            //console.log(result['name'])
            if (result.length == 0) {
                res.render('pages/check-fail', {

                })
            }
            if (result.length !== 0) {
                res.render('pages/check-success', {

                    ref: req.body.refferal,


                })
            }
        });
    })
});

console.log('port running on ' + portRunning)
app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');