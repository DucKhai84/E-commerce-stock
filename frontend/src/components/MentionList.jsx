import React from 'react';
import MentionItem from './MentionItem';
import './Mention.css';

const MentionList = ({ users, isLoading, selectedIndex, onSelect, position }) => {
    return (
        <div
            className="mention-dropdown"
            style={{ top: position.top, left: position.left }}
        >
            {isLoading ? (
                <div className="mention-dropdown-status">Đang tìm dữ liệu...</div>
            ) : users.length === 0 ? (
                <div className="mention-dropdown-status">Không ai phù hợp</div>
            ) : (
                <div className="mention-list-container">
                    {users.map((user, index) => (
                        <MentionItem
                            key={user.id}
                            user={user}
                            isSelected={index === selectedIndex}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentionList;
