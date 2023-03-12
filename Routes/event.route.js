import { create, read, readOne } from "../DL/event.controller";

const express = require('express'),
router = express.Router()

router.post('/newEvent', create)
router.get('/home', read)
router.get('/searchEvent', read)
router.get('/viewEvent', readOne)


module.exports = router
