// indexController.js
const path = require("path");

function index(req, res) {
  res.sendFile(path.join(__dirname, "../views/login_reg.html"));
}

module.exports = {
  index,
};
