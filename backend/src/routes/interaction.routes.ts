import express from 'express';
import { toggleLike, toggleWishlist, addComment, getComments, deleteComment } from '../controllers/interaction.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

// Like & Wishlist
router.post('/:id/like', authenticateUser, toggleLike);
router.post('/:id/wishlist', authenticateUser, toggleWishlist);

// Comments
router.get('/:id/comments', getComments); // Public read? Or authenticated? Let's make it public read for now.
router.post('/:id/comments', authenticateUser, addComment);
router.delete('/comments/:commentId', authenticateUser, deleteComment);

export default router;
