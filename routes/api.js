// ! use Better Comment on VSCODE.
var express = require('express');
var router = express.Router();

// * import controllers
const controllerApi = require("../controllers/cntrlApi");

// * il sert a ajouter un employee.
router.post('/addEmployee', controllerApi.addEmployee);

// * il permet aussi de filtrer par Date de création
router.get("/employees", controllerApi.getEmployees);

// * l'employe fait un checkin
router.post("/check-in", controllerApi.checkin);

// * l'employe fait un checkout
router.post("/check-out", controllerApi.checkout);


module.exports = router;