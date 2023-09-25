import styles from "./chat-item-component.module.scss";
import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { UserContext } from "../../contexts/user-context";

const ChatItemComponent = ({message, editItem, index, curIndex}) => {
    const userContext = useContext(UserContext);

    let messageItemClass = styles.messages_item_left;
    let messageTextAlign = styles.message_left;
    if (curIndex === index) {
        messageTextAlign = styles.message_left_selected;
    }
    if (message.userId === userContext.user.id) {
        messageItemClass = styles.messages_item_right;
        messageTextAlign = styles.message_right;
        if (curIndex === index) {
            messageTextAlign = styles.message_right_selected;
        }
    }
    return (
        <div className={messageItemClass}>
            <div className={messageTextAlign} onClick={editItem}>
                <Typography
                    sx={{ display: 'inline', color: "white", textAlign: "start" }}
                    component="span"
                    variant="body2"
                >
                    {message.text}
                </Typography>
                <Typography
                    sx={{ display: 'inline', color: "white", marginTop: "5px" }}
                    component="span"
                    variant="body2"
                >
                    {message.created.toLocaleDateString() + ", " + message.created.toLocaleTimeString().slice(0, -3)}
                </Typography>
            </div>
        </div>
    );
};

ChatItemComponent.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.number,
        text: PropTypes.string,
        created: PropTypes.object,
        edited: PropTypes.object,
        userId: PropTypes.number,
        senderId: PropTypes.number
    }),
    editItem: PropTypes.func,
    index: PropTypes.number,
    curIndex: PropTypes.number
};

export default ChatItemComponent;
