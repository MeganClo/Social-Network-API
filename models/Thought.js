const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
    {
        // set custom id to avoid confusion with parent thought _id
        reactiionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        thoughtBody: {
            type: String,
            required: "You must provide a reply",
            trim: true
        },
        writtenBy: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);


const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: "You must enter a thought",
        minLength: 1,
        maxLength: 280,

    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [ReactionSchema],
},
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
);

ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;