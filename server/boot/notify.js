var config = require("../../config.js");

module.exports = function (app) {
    var router = app.loopback.Router();
    router.get('/notify', function (req, res, next) {
        console.log("notifying ", req.query.input_transaction_hash);
        if (process.env.NODE_ENV == "production") {
            if (req.query.test == true)
                return res.sendStatus(403);
        }

        if (req.query.secret != config.blockchain.callback_secret)
            return res.sendStatus(403);

        var User = app.models.user;
        User.findOne({where: {address: req.query.input_address}}, function (err, user) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            if (user == null) return res.sendStatus(403);
            user.Transaction.create({
                value: req.query.value,
                hash: req.query.input_transaction_hash
            }, function(err, res) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }else {
                    user.balance += req.query.value;
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        return res.send("*ok*");
                    })

                }
            });

        });


    });
    app.use(router);
};
