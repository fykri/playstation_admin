const router = require("express").Router();
const { addUser, login, getToken, logout } = require("./services_user");

router.post("/add-user", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        await addUser(username, password);
        return res.status(201).json({
            success: true,
            message: "data user created",
        });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const { accessToken, refreshToken } = await login(username, password);
        return res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .status(200)
            .json({
                success: true,
                message: "Login Berhasil",
                accessToken,
            });
    } catch (error) {
        next(error);
    }
});

router.get("/getToken", async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const accessToken  = await getToken(refreshToken);
        console.log(accessToken)
        return res.status(200).json({
            success: true,
            message: "token berhasil didapatkan",
            data: accessToken,
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/logout', async(req,res,next)=> {
    try {
        const {refreshToken} = req.cookies
        await logout(refreshToken)
        res.clearCookie(refreshToken, {
            httpOnly:true,
            sameSite: 'strict',
            secure: true
        })
        return res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router;
