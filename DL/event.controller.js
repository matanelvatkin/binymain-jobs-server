const { errMessage } = require("../errController");
const eventsData = require("./event.model");
const settingData = require("./setting.model");

async function create(data) {
  return await eventsData.create(data);
}

async function read(filter) {
  //return await eventsData.find(filter).populate('targetAudience');
  return await eventsData.find(filter).populate({
      path: 'targetAudience',
      model: settingData,
      select: 'settingData'
    })
    .exec((err, events) => {
      if (err) {
        console.error(err);
      } else {
        console.log(events);
      }
    });
  
}

async function readOne(filter) {
  const res = await eventsData.findOne(filter).populate({
    path: 'targetAudience',
    model: settingData,
    select: 'settingData'
  })
  .exec((err, events) => {
    if (err) {
      console.error(err);
    } else {
      console.log(events);
    }
  });
  //   path: 'targetAudience',
  //   populate: {path: 'settingData'}
  // });
    // model: 'setting',
    // select: 'icon name'
  
  // populate: {
  // path: 'settingData',
  // select: 'icon name',
  // }
//});
  // model: 'Setting',
  // select: 'icon name',
  //});
  if (!res) throw errMessage.EVENT_NOT_FOUND;
  return res;
}

async function update(id, newData) {
  return await eventsData.updateOne({ _id: id }, newData);
}

async function updateAndReturn(id, newData) {
  let data = await eventsData.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });
  if (!data) throw errMessage.EVENT_NOT_FOUND;
  return data;
}

async function updateAndReturnByAnyFilter(filter, newData) {
  let data = await eventsData.findOneAndUpdate(filter, newData, { new: true });
  if (!data) throw errMessage.EVENT_NOT_FOUND;
  return data;
}
async function del(id) {
  return await update(id, { status: "deleted" });
}

module.exports = {
  create,
  read,
  readOne,
  update,
  updateAndReturn,
  updateAndReturnByAnyFilter,
  del,
};
