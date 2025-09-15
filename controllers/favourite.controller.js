const Favorite = require('../models/Favourite');

// Add to Favorite
exports.addToFavorite = async (req, res) => {
  try {
    const userID = req.user.userID;
    const postID  = req.params.id;

    const updated = await Favorite.findOneAndUpdate(
      { userID },
      { $addToSet: { posts: postID } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Added to favorites', favorites: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove from Favorite
exports.removeFromFavorite = async (req, res) => {
  try {
    const userID = req.user.userID;
    const postID = req.params.id;

    const updated = await Favorite.findOneAndUpdate(
      { userID },
      { $pull: { posts: postID } },
      { new: true }
    );

    res.status(200).json({ message: 'Removed from favorites', favorites: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User Favorites
exports.getFavorites = async (req, res) => {
  try {
    const userID = req.user.userID;
    const fav = await Favorite.findOne({ userID }).populate('posts');
    if (!fav) return res.status(404).json({ message: 'No favorites found' });

    res.status(200).json(fav.posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
