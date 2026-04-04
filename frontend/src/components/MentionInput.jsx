import React, { useState, useEffect, useRef, useCallback } from 'react';
import MentionList from './MentionList';
import { AppApi } from '../services/api';
import './Mention.css';

// Hook to debounce search
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const getCaretCoordinates = (element, position) => {
    const properties = [
        'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
        'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust',
        'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent',
        'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
    ];

    const div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);

    const style = div.style;
    const computed = window.getComputedStyle(element);

    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.visibility = 'hidden';

    properties.forEach(prop => {
        style[prop] = computed[prop];
    });

    const textBefore = element.value.substring(0, position);
    div.textContent = textBefore;

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    div.appendChild(span);

    const coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']) + 20,
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
    };

    document.body.removeChild(div);
    return coordinates;
};

export default function MentionInput({ onSubmit }) {
    const [value, setValue] = useState('');
    const [showMention, setShowMention] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionPos, setMentionPos] = useState({ start: -1, end: -1 });

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [mentions, setMentions] = useState([]);

    const textareaRef = useRef(null);

    const debouncedQuery = useDebounce(mentionQuery, 300);

    useEffect(() => {
        let isActive = true;
        if (showMention) {
            const fetchApi = async () => {
                setIsLoading(true);
                try {
                    const results = await AppApi.searchUsers(debouncedQuery);
                    if (isActive) {
                        setUsers(results);
                        setSelectedIndex(0);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    if (isActive) setIsLoading(false);
                }
            };
            fetchApi();
        } else {
            setUsers([]);
        }
        return () => { isActive = false; };
    }, [debouncedQuery, showMention]);

    const handleChange = (e) => {
        const text = e.target.value;
        setValue(text);

        const currentCursor = e.target.selectionEnd;
        const textBeforeCursor = text.slice(0, currentCursor);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
            const queryStr = textBeforeCursor.slice(atIndex + 1);

            if (!queryStr.includes(' ')) {
                setShowMention(true);
                setMentionQuery(queryStr);
                setMentionPos({ start: atIndex, end: currentCursor });

                const coords = getCaretCoordinates(textareaRef.current, currentCursor);
                setDropdownPosition(coords);
                return;
            }
        }

        setShowMention(false);
    };

    const handleSelectUser = useCallback((user, isHover = false) => {
        if (isHover) {
            setSelectedIndex(users.findIndex(u => u.id === user.id));
            return;
        }

        const beforeMention = value.slice(0, mentionPos.start);
        const afterMention = value.slice(textareaRef.current.selectionEnd);

        const mentionText = `@${user.fullName}`;
        const newValue = beforeMention + mentionText + ' ' + afterMention;

        setValue(newValue);
        setShowMention(false);

        if (!mentions.find(m => m.id === user.id)) {
            setMentions([...mentions, { id: user.id, display: user.fullName }]);
        }

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = beforeMention.length + mentionText.length + 1;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    }, [users, value, mentionPos, mentions]);

    const handleKeyDown = (e) => {
        if (showMention) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, users.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (users[selectedIndex]) {
                    handleSelectUser(users[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowMention(false);
            }
        }
    };

    const submitReview = () => {
        if (!value.trim()) return;
        if (onSubmit) {
            onSubmit(value, mentions);
        }
        setValue('');
        setMentions([]);
    };

    const renderHighlights = () => {
        if (!value) return <span className="custom-placeholder">Bạn nghĩ sao về sản phẩm này...</span>;
        let content = value;

        const sortedMentions = [...mentions].sort((a, b) => b.display.length - a.display.length);
        let parts = [{ text: content, isMention: false }];

        sortedMentions.forEach(mention => {
            const mentionToken = `@${mention.display}`;
            const newParts = [];
            parts.forEach(part => {
                if (part.isMention) {
                    newParts.push(part);
                } else {
                    const pieces = part.text.split(mentionToken);
                    pieces.forEach((piece, i) => {
                        newParts.push({ text: piece, isMention: false });
                        if (i < pieces.length - 1) {
                            newParts.push({ text: mentionToken, isMention: true });
                        }
                    });
                }
            });
            parts = newParts;
        });

        return parts.map((part, i) =>
            part.isMention ?
                <span key={i} className="fb-mention-tag">{part.text}</span> :
                <span key={i}>{part.text}</span>
        );
    };

    return (
        <div className="fb-comment-box" style={{ margin: 0, maxWidth: '100%' }}>
            <div className="fb-editor-container">
                <div className="fb-highlights">
                    {renderHighlights()}
                </div>

                <textarea
                    ref={textareaRef}
                    className="fb-textarea"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    spellCheck="false"
                />

                {showMention && (
                    <MentionList
                        users={users}
                        isLoading={isLoading}
                        selectedIndex={selectedIndex}
                        onSelect={handleSelectUser}
                        position={dropdownPosition}
                    />
                )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={submitReview} className="btn-primary" style={{ padding: '8px 24px' }}>
                    Đăng Nhận Xét
                </button>
            </div>
        </div>
    );
}
