module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

    //disable validation for email
    delete server.models.User.validations.email;
};
