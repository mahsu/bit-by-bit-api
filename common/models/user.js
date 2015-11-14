"use strict";
var config = require('../../config');
var blockchain = require('blockchain.info');

module.exports = function (User) {

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
    })
};
