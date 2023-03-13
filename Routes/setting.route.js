const express = require('express'),
router = express.Router()
const { getSetting } = require('../BL/setting.services')

router.get('', async (req,res)=>{
    try {
       const data = await getSetting(req.body)
       res.send(data)
    } catch(err) {
        console.log(err);
    }
})

module.exports = router
