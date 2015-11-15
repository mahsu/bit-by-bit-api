"use strict";
var config = require('../../config');
var blockchain = require('blockchain.info');

module.exports = function (User) {

    User.disableRemoteMethod("create", true);
    User.disableRemoteMethod("deleteById", true);
    User.disableRemoteMethod("upsert", true);
    //User.disableRemoteMethod("find", true);
    User.disableRemoteMethod("findOne",true);
    User.disableRemoteMethod("updateAll", true);
    User.disableRemoteMethod("count", true);
    User.disableRemoteMethod("createChangeStream", true);
    User.disableRemoteMethod("exists", true);

    User.disableRemoteMethod("resetPassword", true);
    User.disableRemoteMethod("confirm", true);

    //User.disableRemoteMethod("__create__goals", false);
    User.disableRemoteMethod("__delete__goals", false);
    User.disableRemoteMethod("__destroyById__goals", false);
    User.disableRemoteMethod("__exists__goals", false);
    User.disableRemoteMethod("__link__goals", false);
    User.disableRemoteMethod("__unlink__goals", false);
    User.disableRemoteMethod("__updateById__goals", false);

    User.disableRemoteMethod("__delete__groups", false);

    User.disableRemoteMethod("__delete__activities", false);

    User.disableRemoteMethod('__count__accessTokens', false);
    User.disableRemoteMethod('__create__accessTokens', false);
    User.disableRemoteMethod('__delete__accessTokens', false);
    User.disableRemoteMethod('__destroyById__accessTokens', false);
    User.disableRemoteMethod('__findById__accessTokens', false);
    User.disableRemoteMethod('__get__accessTokens', false);
    User.disableRemoteMethod('__updateById__accessTokens', false);

    User.disableRemoteMethod("__count__transactions", false);
    User.disableRemoteMethod("__get__transactions", false);
    User.disableRemoteMethod("__create__transactions", false);
    User.disableRemoteMethod("__delete__transactions", false);
    User.disableRemoteMethod("__destroyById__transactions", false);
    User.disableRemoteMethod("__updateById__transactions", false);

    User.observe('before save', function initializeAddress(ctx, next) {
        console.log(ctx);
        if (ctx.isNewInstance) {
            var newUser = ctx.instance;
            var myWallet = new blockchain.MyWallet(config.blockchain.id, config.blockchain.password);
            myWallet.newAddress(function (err, res) {
                if (err) {
                    console.log(err);
                    next(new Error("Unable to generate new address."))
                }
                newUser.address = res.address;
                return next();
            })
        }
        else {
            return next();
        }
    });


    User.afterRemote('*', function stripSensitive(ctx, modelInstance, next) {
        //strip private info
        var WHITE_LIST_FIELDS = ["username"];
        var answer;
        if (ctx.result && ctx.methodString != "user.findById") {
            if (Array.isArray(modelInstance)) {
                answer = [];
                ctx.result.forEach(function (result) {
                    var replacement ={};
                    WHITE_LIST_FIELDS.forEach(function(field) {
                        replacement[field] = result[field];
                    });
                    answer.push(replacement);
                });
            } else {
                answer ={};
                WHITE_LIST_FIELDS.forEach(function(field) {
                    answer[field] = ctx.result[field];
                });
            }
            ctx.result = answer;
        }
        next();
    });


    User.withdraw = function(id, address, amount, cb) {
        console.log(id);
        User.findById(id, function(err, user) {
            if (err) {
                return cb(new Error("Unable to find user."));
            }
            var newbal = user.balance - amount;

            if (newbal < 0) {
                return cb(new Error("Insufficient funds"));
            }
            user.balance = newbal;

            var myWallet = new blockchain.MyWallet(config.blockchain.id, config.blockchain.password);
            myWallet.send({to: address, amount: amount}, function (err, result) {
                if (err) {
                    console.log(err);
                    cb(new Error(err));
                }
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return cb(new Error());
                    }
                    return cb(result);
                });
            })
        })
    };

    User.remoteMethod('withdraw', {
    accepts: [
        {arg: "address", type: "string", required: true, description: "Dest. address"},
        {arg: "amount", type: "number", required: true, description: "In satoshi"}
    ],
    description: "Withdraws an amount into an address from a user.",
    isStatic: false,
    http: {path: "/withdraw", verb: "post"},
    returns: [
        {arg: "message", type: "string"},
        {arg: "tx_hash", type: "string"},
        {arg: "notice", type: "string"}
    ]
    });

    User.register = function(username, password, cb) {
        var credentials = {username: username, password: password};
        User.create(credentials, function(err, user) {
            if (err) {
                cb(new Error(err), null);
            } else {
                User.login(credentials,function(err, accesstoken) {
                    if (err) {
                        console.log(err);
                        return cb(new Error(err), null);
                    }
                    return cb(null, accesstoken.id);
                });

            }
        })
    };

    User.remoteMethod('register', {
        accepts: [
            {arg: "username", type: "string", required: true},
            {arg: "password", type: "string", required: true}
        ],
        description: "Registers a new user.",
        isStatic: true,
        http: {path: "/register", verb: "post"},
        returns: [
            {arg: "access_token", type:"string"}
        ]
    });

    User.search = function(name, skip, l) {

    }

};
