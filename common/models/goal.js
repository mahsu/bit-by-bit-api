module.exports = function(Goal) {

    Goal.disableRemoteMethod("create", true);
    Goal.disableRemoteMethod("upsert", true);
    Goal.disableRemoteMethod("updateAll", true);
    Goal.disableRemoteMethod("updateAttributes", false);

    Goal.disableRemoteMethod("find", true);
    Goal.disableRemoteMethod("findById", true);
    Goal.disableRemoteMethod("findOne", true);

    Goal.disableRemoteMethod("deleteById", true);

    Goal.disableRemoteMethod("confirm", true);
    Goal.disableRemoteMethod("exists", true);
    Goal.disableRemoteMethod("createChangeStream",true);
};
