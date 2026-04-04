const prisma = require('../config/prisma');

const addReview = async (userId, productId, reviewData) => {
  const { rating, comment } = reviewData;
  if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

  return await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment
    }
  });
};

const getProductReviews = async (productId) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { fullName: true }
      }
    }
  });
};

const deleteReview = async (id, requestingUser) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error('Review not found');

  if (review.userId !== requestingUser.userId && requestingUser.role !== 'ADMIN') {
    throw new Error('Access denied');
  }

  return await prisma.review.delete({
    where: { id }
  });
};

module.exports = {
  addReview,
  getProductReviews,
  deleteReview
};
