/**module.exports = function(Friend) {

    Friend.disableRemoteMethod("create", true);
    Friend.disableRemoteMethod("upsert", true);
    Friend.disableRemoteMethod("updateAll", true);
    Friend.disableRemoteMethod("updateAttributes", false);

    Friend.disableRemoteMethod("find", true);
    Friend.disableRemoteMethod("findById", true);
    Friend.disableRemoteMethod("findOne", true);

    Friend.disableRemoteMethod("deleteById", true);

    Friend.disableRemoteMethod("confirm", true);
    Friend.disableRemoteMethod("exists", true);
    Friend.disableRemoteMethod("createChangeStream",true);
};
*/