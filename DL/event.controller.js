const {errMessage} = require("../errController");
const eventsData = require("./event.model");



const create = async (req,res)=>{
        const Event = req.body;
    
        const newEvent = new eventsData(Event);
    
        try {
            await newEvent.save();
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(409).json({ message: error.message})
            console.log(error);
        }
    }

    const read = async(req, res)=>{
        try {
            const allEvents = await eventsData.find();
    
            res.status(200).json(allEvents);
        } catch (error) {
            res.status(404).json({message: error.message})
        }
    } 

async function readOne (filter) {
    const res = await eventsData.findOne(filter);
    if (!res) throw errMessage.EVENT_NOT_FOUND;
    return res;
}

async function update(id, newData) {
    return await eventsData.updateOne({_id:id}, newData);
}

async function updateAndReturn (id, newData) {
    let data = await eventsData.findOneAndUpdate({_id:id}, newData, {new:true});
    if(!data) throw errMessage.EVENT_NOT_FOUND;
    return data;
}

async function updateAndReturnByAnyFilter(filter, newData) {
    let data = await eventsData.findOneAndUpdate(filter, newData, {new:true});
    if(!data) throw errMessage.EVENT_NOT_FOUND;
    return data;
}
async function del (id) {
    return await update (id, {status:"deleted"});
}

module.exports= {create, read, readOne, update, updateAndReturn, updateAndReturnByAnyFilter, del};
