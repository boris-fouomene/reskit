module.exports = function(api){
  const babel = require("../resk-expo/babel.config")(api);
  babel.plugins.push(["babel-plugin-react-docgen-typescript", { exclude: "node_modules" }]);
  return babel;
}
