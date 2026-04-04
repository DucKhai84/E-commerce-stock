import React, { useState, useEffect, useRef } from 'react';
import { AppApi } from '../services/api';

const MentionInput = ({ value, onChange, placeholder, disabled }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const textareaRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Filtered suggestions from API
    useEffect(() => {
        if (showSuggestions && searchQuery.length >= 1) {
            const delayDebounceFn = setTimeout(async () => {
                try {
                    const users = await AppApi.searchUsers(searchQuery);
                    setSuggestions(users);
                    setSelectedIndex(0);
                } catch (err) {
                    console.error("Lỗi tìm kiếm user:", err);
                    setSuggestions([]);
                }
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, showSuggestions]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        const pos = e.target.selectionStart;
        onChange(val);
        setCursorPosition(pos);

        // Check for "@" before cursor
        const textBeforeCursor = val.substring(0, pos);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        // Ensure there's no space between @ and cursor to trigger search
        if (atIndex !== -1 && !textBeforeCursor.substring(atIndex + 1, pos).includes(' ')) {
            setShowSuggestions(true);
            setSearchQuery(textBeforeCursor.substring(atIndex + 1, pos));
        } else {
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertMention(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const insertMention = (user) => {
        const textBeforeAt = value.substring(0, value.lastIndexOf('@', cursorPosition - 1));
        const textAfterCursor = value.substring(cursorPosition);
        const newValue = `${textBeforeAt}@${user.fullName} ${textAfterCursor}`;

        onChange(newValue);
        setShowSuggestions(false);

        // Focus back
        setTimeout(() => {
            textareaRef.current.focus();
            const newPos = textBeforeAt.length + user.fullName.length + 2;
            textareaRef.current.setSelectionRange(newPos, newPos);
        }, 0);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="input-field"
                style={{
                    minHeight: '100px',
                    width: '100%',
                    resize: 'vertical',
                    padding: '16px'
                }}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        width: '250px',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        padding: '8px',
                        marginBottom: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        border: '1px solid var(--accent)'
                    }}
                >
                    {suggestions.map((user, index) => (
                        <div
                            key={user.id}
                            onClick={() => insertMention(user)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: index === selectedIndex ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                color: index === selectedIndex ? 'var(--accent)' : 'inherit',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                {user.fullName[0].toUpperCase()}
                            </div>
                            <span style={{ fontSize: '14px' }}>{user.fullName}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentionInput;
