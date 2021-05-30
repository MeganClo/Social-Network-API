const { User } = require('../models');

const userController = {
    // GET all Users
    getAllUser(req, res) {
        User.find({})
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // GET one User by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate([
                {
                    path: "friends",
                    select: "-__v",
                },
                {
                    path: "thoughts",
                    select: "-__v",
                }
            ])
            .select("-__v")
            .then(dbUserData => {
                // If no User is found, send 404
                if (!dbUserData) {
                    res.status(404).json({ message: "No User found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // POST create User
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    // PUT update a User by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete a User by id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .then(() => {
                // remove user comments
                Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({ message: "Deleted user!" });
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    // POST add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User found with this id" });
                    return;
                }
                // need to add this user to friend's list as well
                User.findOneAndUpdate(
                    { _id: params.friendId },
                    { $addToSet: { friends: params.userId } },
                    { new: true, runValidators: true }
                )
                    .then(dbFriendData => {
                        if (!dbFriendData) {
                            res.status(404).json({ message: "No User found with this id" });
                            return;
                        }
                        res.json(dbUserData);
                    })
                    .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },
};


module.exports = userController;