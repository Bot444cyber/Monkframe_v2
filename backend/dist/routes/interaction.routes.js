"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interaction_controller_1 = require("../controllers/interaction.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Like & Wishlist
router.post('/:id/like', auth_middleware_1.authenticateUser, interaction_controller_1.toggleLike);
router.post('/:id/wishlist', auth_middleware_1.authenticateUser, interaction_controller_1.toggleWishlist);
// Comments
router.get('/:id/comments', interaction_controller_1.getComments); // Public read? Or authenticated? Let's make it public read for now.
router.post('/:id/comments', auth_middleware_1.authenticateUser, interaction_controller_1.addComment);
router.delete('/comments/:commentId', auth_middleware_1.authenticateUser, interaction_controller_1.deleteComment);
exports.default = router;
