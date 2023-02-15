const { Thought, User } = require('../models');

//function to get all of the thoughts by invoking the find () method with no arguments; then we return the results as JSON and catch errors; errors are sent as JSON w a message and a 500 status code
const thoughtController = {
getThoughts(req, res) {
    Thought.find()
    .sort({createdAt: -1})
    .then((dbThoughtData) => {
        res.json(dbThoughtData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
},
  // Gets a single thought using the findOneAndUpdate method; pass in the ID of the thought and then respond with it, or an error if not found
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            return res.status(404).json({message: 'No thought with this id'});
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err); res.status(500).json(err);
      });
  },
  // creates a thought; accepts request body with entire thought object; bc thoughts are associated with users, we then update the user who created the thought and add the ID of the thought to the thought array
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
            return res.status(404).json({message: 'Thought created, but found no user with that ID'});
        }
        res.json({message: 'Thought created 🎉'});
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Updates using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  // update thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes the thought from the database. looks for an app by ID, then if the thought exists, it looks for any users associated with the app based on the app ID and updates the thoughts array for the User.
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            return res.status(404).json({message: 'No thought with this id!'});
        }
        //removes the thought
        return User.findOneAndUpdate(
            {thoughts: req.params.thoughtId},
            { $pull: {thoughts: req.params.thoughtId}},
            {new: true}
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
            return res.status(404).json({ message: 'Thought created but no user with this id' });
        }
        res.json({ message: 'Thought successfully deleted.' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Adds a reaction to a thought. This method is unique in that we add the entire body of the tag rather than the ID with the mongodb $addToSet operator.
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought with this id!'});}res.json(dbThoughtData);
        })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Remove reaction. This method finds the reaction based on ID. It then updates the reactions array associated with the app in question by removing it's reactionId from the reactions array.
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            return res.status(404).json({message: 'No thought with this id'});
        }
        res.json(dbThoughtData);
    })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
