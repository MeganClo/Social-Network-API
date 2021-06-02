const router = require("express").Router();

const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    addReaction,
    removeReaction,
    removeThought,
} = require("../../controllers/thought-controller");

router
    .route("/")
    .get(getAllThoughts)
    .post(addThought);

router
    .route("/:id")
    .get(getThoughtById)
    .delete(removeThought)
    .put(updateThought);

router
    .route("/thoughtId/reactions")
    .post(addReaction)
    .delete(removeReaction);

module.exports = router;
