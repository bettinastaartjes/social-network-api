const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

// Schema to create thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'Gotta leave a thought!',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
        type: String,
        required: true
      },
      reactions: [reactionSchema]
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `reactionCount` that gets the amount of reactions per user
thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
