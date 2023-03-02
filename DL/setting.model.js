const mongoose = require ("mongoose");

const settingSchema = new mongoose.Schema ({
    categories : [
        {
            icon: String,
            name: String
        }
    ],
    audience : [
        {
            icon : String,
            name : String
        }
    ]
});

const settings = mongoose.model("setting", settingSchema);

module.exports = settings;