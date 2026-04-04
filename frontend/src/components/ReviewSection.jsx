import React, { useState } from 'react';

const ReviewForm = ({ productId, onSubmitSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await onSubmitSuccess(rating, comment);
            setComment('');
            setRating(5);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                style={{
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: star <= rating ? '#fadb14' : 'rgba(255,255,255,0.2)',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            padding: '16px',
                            fontSize: '15px',
                            outline: 'none',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="btn-primary"
                    style={{
                        padding: '12px 24px',
                        opacity: submitting || !comment.trim() ? 0.5 : 1
                    }}
                >
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>
        </div>
    );
};

const ReviewItem = ({ review }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', display: 'flex', gap: '16px' }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), #fadb14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
            }}>
                {review.user?.fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600' }}>{review.user?.fullName}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(review.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= review.rating ? '#fadb14' : 'rgba(255,255,255,0.1)', fontSize: '14px' }}>
                            ★
                        </span>
                    ))}
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px' }}>{review.comment}</p>
            </div>
        </div>
    );
};

const ReviewSection = ({ productId, reviews, onNewReview }) => {
    return (
        <div style={{ marginTop: '64px' }}>
            <h2 style={{ marginBottom: '32px', fontSize: '28px' }} className="gradient-text">Đánh giá từ khách hàng</h2>

            <ReviewForm productId={productId} onSubmitSuccess={onNewReview} />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {reviews.length > 0 ? (
                    reviews.map((rev) => <ReviewItem key={rev.id} review={rev} />)
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét sản phẩm này!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
