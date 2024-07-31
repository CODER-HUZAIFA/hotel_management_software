import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import userRouter from "./routes/user.routes.js";
import { isLogged } from "./middlewares/user.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("C:/Users/HUZAIFA ANSARI/Desktop/Hotel Management/public"))
app.use(cookieParser());
app.set("view engine", "ejs")

app.use("/user", userRouter)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
});

app.use((req, res, next) => {
    res.render("error")
})

export { app }