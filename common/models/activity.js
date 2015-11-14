module.exports = function(Activity) {
    Activity.disableRemoteMethod("create", true);
    Activity.disableRemoteMethod("upsert", true);
    Activity.disableRemoteMethod("updateAll", true);
    Activity.disableRemoteMethod("updateAttributes", false);

    Activity.disableRemoteMethod("find", true);
    Activity.disableRemoteMethod("findById", true);
    Activity.disableRemoteMethod("findOne", true);

    Activity.disableRemoteMethod("deleteById", true);
    Activity.disableRemoteMethod("confirm", true);
    Activity.disableRemoteMethod("exists", true);
    Activity.disableRemoteMethod("createChangeStream", true);

};
