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

