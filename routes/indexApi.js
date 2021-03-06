var express = require('express');
var router = express.Router();
var brainparts = require('../controllers/brainApi');

router.get('/brainparts', brainparts.allParts);
router.get('/brainparts/:brainpartid', brainparts.showPart);
router.post('/brainparts', brainparts.createPart);
router.delete('/brainparts/:brainpartid', brainparts.deletePart);
router.put('/brainparts/:brainpartid', brainparts.updateMeaning);

router.put('/brainparts/:brainpartid/functionalities', brainparts.updateFunctionalities);

module.exports = router;