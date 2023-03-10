const express = require('express'),
router = express.Router()
const { getAllEvents, getFilteredEvents } = require('../BL/event.services')

router.get('/allEvents', async (req,res)=>{
    try {
        let data = await getAllEvents()
        res.send(data)
    } catch(err) {
        console.log(err);
        res.status(err.code ? err.code : 400).send(err.message)
    }
})

router.get('/filteredEvents', async (req, res)=>{
    try {
        let data = await getFilteredEvents(req.body)
        res.send(data)
    } catch(err) {
        console.log(err);
        res.status(err.code ? err.code : 400).send(err.message)
    }
})

module.exports = router
