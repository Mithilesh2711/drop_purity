var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Accounts = require('../models/accounts');
const { FailedDependency } = require('http-errors');
const { token } = require('morgan');

router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.cors, (req, res) => { res.sendStatus(200); } )

router.get('/staffs',cors.cors, (req,res,next) => {
    Accounts.find()
    .then((user) => {
        if(user!==null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);   
        }

        else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json(user); 
        }
    })
})

router.post('/addstaff',cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Accounts.findOne({username: req.body.username})
    .then((user) => {
        console.log("req",req.body)
        if(user===null) {
            var flow={
                fid:1,
                initialReading : req.body.initialReading,
                finalReading : req.body.finalReading,
                expectedTotal : (parseInt(req.body.finalReading) - parseInt(req.body.initialReading))/2,
                cash : req.body.cash,
                online : req.body.online,
                duesIn : req.body.duesIn,
                duesOut : req.body.duesOut,
                netDues : parseInt(req.body.duesOut) - parseInt(req.body.duesIn),
                tokenIn : req.body.tokenIn,
                tokenOut : req.body.tokenOut,
                netToken : parseInt(req.body.tokenOut) - parseInt(req.body.tokenIn),
                receivedTotal : parseInt(req.body.cash) + parseInt(req.body.online) + parseInt(req.body.duesIn) - parseInt(req.body.duesOut) + parseInt(req.body.tokenIn),
                error : (parseInt(req.body.finalReading) - parseInt(req.body.initialReading))/2 - (parseInt(req.body.cash) + parseInt(req.body.online) + parseInt(req.body.duesIn) - parseInt(req.body.duesOut) + parseInt(req.body.tokenIn)),
                month : ((new Date()).toLocaleDateString()).split('/')[1],
                year : ((new Date()).toLocaleDateString()).split('/')[2]

            };

            if(flow.error > flow.expectedTotal*0.03) {
                var data= {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    earned: flow.receivedTotal*0.25 - flow.error + flow.expectedTotal*0.03,
                    flow: flow
                };


                Accounts.create(data)
                .then((account) => {
                    console.log("account ",account);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"success":true,"msg":"Staff added successfully !","res":account});
                
                })
                .catch((err) => {
                    console.log("errr",err)
                    next(err)
                })  

            }

            else {
                var data= {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    earned: flow.receivedTotal*0.25,
                    flow: flow
                };

                Accounts.create(data)
                .then((account) => {
                    console.log("account ",account);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({"success":true,"msg":"Staff added successfully !","res":account});
                
                })
                .catch((err) => {
                    console.log("errr",err)
                    next(err)
                })  
            }
            
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"success":false,"msg":"Staff already exist"});
        }
    })
})



router.post('/staff/:username',cors.cors, authenticate.verifyUser, authenticate.verifyUser, (req,res,next) => {
    Accounts.findOne({username: req.params.username})
    .then((user) => {
        if(user!=null) {
            var flow={
                fid:user.flow.length + 1,
                initialReading : req.body.initialReading,
                finalReading : req.body.finalReading,
                expectedTotal : (parseInt(req.body.finalReading) - parseInt(req.body.initialReading))/2,
                cash : req.body.cash,
                online : req.body.online,
                duesIn : req.body.duesIn,
                duesOut : req.body.duesOut,
                netDues : user.flow.reverse()[0].netDues + parseInt(req.body.duesOut) - parseInt(req.body.duesIn),
                tokenIn : req.body.tokenIn,
                tokenOut : req.body.tokenOut,
                netToken : user.flow.reverse()[0].netToken + parseInt(req.body.tokenOut) - parseInt(req.body.tokenIn),
                receivedTotal : parseInt(req.body.cash) + parseInt(req.body.online) + parseInt(req.body.duesIn) - parseInt(req.body.duesOut) + parseInt(req.body.tokenIn),
                error : (parseInt(req.body.finalReading) - parseInt(req.body.initialReading))/2 - (parseInt(req.body.cash) + parseInt(req.body.online) + parseInt(req.body.duesIn) - parseInt(req.body.duesOut) + parseInt(req.body.tokenIn)),
                month : ((new Date()).toLocaleDateString()).split('/')[1],
                year : ((new Date()).toLocaleDateString()).split('/')[2]

            };

            console.log(user.flow[0]);
            if(flow.error > flow.expectedTotal*0.03) {

                earned = user.earned + flow.receivedTotal*0.25 - flow.error + flow.expectedTotal*0.03 ;
                
                user.flow.push(flow)
                user.save()
                .then((user) => {
                    user.earned = earned;
                    user.save()
                    .then((account) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({"success":true,"msg":"Account Data added  Successfully!","res":account});
                    
                    }, (err) => next(err))
                    .catch((err) => next(err)); 

                }, (err) => next(err))
                .catch((err) => next(err)); 

            }

            else {
                earned = user.earned + flow.receivedTotal*0.25;
                
                user.flow.push(flow)
                user.save()
                .then((user) => {
                    user.earned = earned;
                    user.save()
                    .then((account) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({"success":true,"msg":"Account Data added  Successfully!","res":account});
                    
                    }, (err) => next(err))
                    .catch((err) => next(err)); 

                }, (err) => next(err))
                .catch((err) => next(err)); 
            }
            
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({"success":false,"msg":"Staff doesnot exist"});
        }
    })
})



module.exports = router;