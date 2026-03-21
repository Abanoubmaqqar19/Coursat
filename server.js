require("dotenv").config();
const app = require("./app.js")
const ConnectDB=require("./src/config/db.js")

const PORT = process.env.PORT || 3000;

const startConnection = async () => {
    await ConnectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
};



startConnection(); 