var config = require("../../config.js");

module.exports = function (app) {
    var router = app.loopback.Router();
    router.get('/notify', function (req, res) {
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
            });
            return res.send("*ok*");
        });


    });
    app.use(router);
};
