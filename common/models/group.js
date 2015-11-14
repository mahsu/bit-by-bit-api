module.exports = function(Group) {

    Group.disableRemoteMethod("create", true);
    Group.disableRemoteMethod("upsert", true);
    Group.disableRemoteMethod("updateAll", true);
    Group.disableRemoteMethod("updateAttributes", false);

    Group.disableRemoteMethod("find", true);
    Group.disableRemoteMethod("findById", true);
    Group.disableRemoteMethod("findOne", true);

    Group.disableRemoteMethod("deleteById", true);

    Group.disableRemoteMethod("confirm", true);
    Group.disableRemoteMethod("exists", true);
    Group.disableRemoteMethod("createChangeStream",true);

    Group.disableRemoteMethod("__delete__goals", false);

    Group.disableRemoteMethod("__create__users", false);
    Group.disableRemoteMethod("__delete__users", false);
    Group.disableRemoteMethod("__updateById__users", false);
    Group.disableRemoteMethod("__destroyById__users", false);
};
