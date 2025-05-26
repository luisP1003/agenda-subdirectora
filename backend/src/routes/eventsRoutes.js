const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventsController");
const upload = require("../middleware/uploadEventImage");

router.get("/", eventsController.getAllEvents);
router.post("/", upload.array("imagenes", 5), eventsController.createEvent);
router.put("/:id", upload.array("imagenes", 5), eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router;
