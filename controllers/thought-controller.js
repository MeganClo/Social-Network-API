const { Thought, User } = require("../models");

const thoughtController = {
    // add a thought  
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true, runValidators: true } 
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: "No User found with this ID."});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
};

module.exports = thoughtController;