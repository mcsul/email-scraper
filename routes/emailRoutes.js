const express = require("express");
const _controller = require("../controllers/emailController");

const router = express.Router();

router.get("/list", _controller.index);

router.get("/crawl", _controller.crawler);

router.post("/create", _controller.store);

router.post("/update", _controller.update);

router.get("/:id", _controller.get);

router.delete("/:id", _controller.destroy);

module.exports = router;
