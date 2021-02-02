//@ts-check
const express = require("express")
const router = express.Router()

const Controller = require("../controllers/toDoController")

const { authenticate } = require("../middlewares/authenticate")
const { authorize } = require("../middlewares/authorize")

router.use(authenticate)

// ? 1. Create ToDo
router.post("/", Controller.create)
// ? 2. Read ToDo
router.get("/", Controller.read)

router.use(authorize)

// ? 3. Get ToDo by id
router.get("/:id", Controller.findById)
// ? 4. Update ToDo (using put)
router.put("/:id", Controller.updatePut)
// ? 5. Update ToDo (using patch)
router.patch("/:id", Controller.updatePatch)
// ? 6. Delete ToDo
router.delete("/:id", Controller.destroy)

module.exports = router
