import { Router } from "express";
import { userLoginHandler, userRegistrationHandle, userEdit, passwordHandler } from "../controllers/user.controllers.js";
import { isLogged, isLoggedIn } from "../middlewares/user.middleware.js";
import hotelRoute from "./hotel.routes.js"
const router = Router();

router.use("/:userID/hotel", hotelRoute)

router.get("/:userID", isLoggedIn, (req, res) => {
    res.render("user", {
        user: req.user,
    })
})

router.get("/:userId/edit", isLogged, (req, res) => {
    res.render("userEdit", {
        user: req.user,
    })
})

router.get("/:userId/logout", (req, res) => {
    res.clearCookie("uid")
    res.redirect(`/user/${req.params.userId}`)
})

router.post("/register", userRegistrationHandle)
router.post("/login", userLoginHandler)
router.post("/:userId/edit", isLogged, userEdit)
router.post("/:userId/edit/password", isLogged, passwordHandler)

export default router