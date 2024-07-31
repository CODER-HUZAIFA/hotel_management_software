import { app } from "./app.js";
import dbConnection from "./database/db.js";

dbConnection()
.then(() => {
    app.listen(3000, () => {
        console.log("App is listning on port 3000")
    })
})