const {
    addConsole,
    getConsoleData,
    deleteConsole,
    updateDataConsole,
} = require("./services_console");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await getConsoleData();
        res.status(200).json({
            message: "data exists",
            data: result.map((e)=> ({
                id_console: e.id_console,
                console_type: e.console_type,
                hourly_price:e.hourly_price,
                package: e.package,
                quantity: e.quantity
            })),
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const data = req.body;
        await addConsole(data);
        return res.status(201).json({
            success: true,
            message: "data berhasil ditambahkan",
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/delete-data/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteConsole(id);
        res.status(200).json({
            success: true,
            message: "data berhasil dihapus",
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/:id_console", async (req, res, next) => {
    try {
        const { id_console } = req.params;
        await updateDataConsole(id_console, req.body);
        res.status(200).json({
            success: true,
            message: 'data berhasil di update'
        })
    } catch (error) {
        next(error);
    }
});

module.exports = router;
