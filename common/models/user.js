"use strict";
var config = require('../../config');
var blockchain = require('blockchain.info');

module.exports = function (User) {

    User.disableRemoteMethod("deleteById", true);
    User.disableRemoteMethod("upsert", true);
    User.disableRemoteMethod("find", true);
    User.disableRemoteMethod("findOne",true);
    User.disableRemoteMethod("updateAll", true);
    User.disableRemoteMethod("count", true);
    User.disableRemoteMethod("createChangeStream", true);
    User.disableRemoteMethod("exists", true);

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
        {arg: "amount", type: "number", required: true, description: "In satoshi"} ],
        description: "Withdraws an amount into an address from a user.",
        isStatic: false,
        http: {path: "/withdraw", verb: "post"},
        returns: [
            {arg: "message", type: "string"},
            {arg: "tx_hash", type: "string"},
            {arg: "notice", type: "string"} ]
    })
};
