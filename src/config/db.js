const mongoose = require("mongoose");

const ConnectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGOURL);
    console.log(`mongo connected ${connection.connection.host}`)

}
module.exports = ConnectDB;