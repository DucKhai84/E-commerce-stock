import React from 'react';
import './Mention.css';

const MentionItem = ({ user, isSelected, onSelect }) => {
    return (
        <div
            className={`mention-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(user)}
            onMouseEnter={() => onSelect(user, true)} // For hover state if needed
        >
            <img src={user.avatarUrl} alt={user.username} className="mention-item-avatar" />
            <span className="mention-item-username">{user.username}</span>
        </div>
    );
};

export default MentionItem;
