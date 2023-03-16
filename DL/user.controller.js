const userData = require("./user.model");
const { errorMsg } = require("../errController");


async function create(data) {
    return await userData.create(data);
};


async function find(filter) {
    const res = await userData.findOne(filter).populate('setting.settingData');
    if (!res) throw errorMsg.USER_NOT_FOUND;
    return res;
};


module.exports = {
    create,
    find,
}