const first_token = artifacts.require("first_token");

module.exports = function(deployer) {
  deployer.deploy(first_token);
};
