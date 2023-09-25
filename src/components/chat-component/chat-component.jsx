import styles from "./chat-component.module.scss";
import React, { useContext, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import ChatItemComponent from "../chat-item-component/chat-item-component";
import axios from "axios";
import ServerDataService from "../../services/server-data.service";
import MessageCreateModel from "../../models/MessageCreateModel";
import MessageUpdateModel from "../../models/MessageUpdateModel";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/user-context";

const ChatComponent = () => {
    const userContext = useContext(UserContext);
    const { senderId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [curIndex, setIndex] = useState(-1);

    useEffect(() => {
        userContext.chatIdSetter(senderId);
        getServerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [senderId, userContext.user.id]);

    const getServerData = async () => {
        const isVerify = await userContext.isVeryfyToken();
        if (!isVerify) {
            return;
        }
        await axios.get(ServerDataService.apiUrl + "api/telegram/all/" + userContext.user.id + "/" + senderId + "/",
            {
                headers: userContext.getAuthorizeData()
            })
            .then((response) => {
                setMessages(ServerDataService.convertTelegramMessages(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addMessage = async () => {
        if (text.trim("") === "" || userContext.user.id === undefined) {
            return;
        }
        if (curIndex >= 0 && messages[curIndex] !== undefined
            && messages[curIndex].userId === userContext.user.id && messages[curIndex].id > 0) {
            const isVerify = await userContext.isVeryfyToken();
            if (!isVerify) {
                return;
            }
            await axios.put(ServerDataService.apiUrl + "api/messages/update",
                new MessageUpdateModel(
                    messages[curIndex].id,
                    text,
                    userContext.user.id,
                    messages[curIndex].senderId
                ),
                {
                    headers: userContext.getAuthorizeData()
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
            cancelEdit();
            await getServerData();
            return;
        }
        const isVerify = await userContext.isVeryfyToken();
        if (!isVerify) {
            return;
        }
        await axios.post(ServerDataService.apiUrl + "api/messages/add",
            new MessageCreateModel(
                text,
                userContext.user.id,
                senderId
            ),
            {
                headers: userContext.getAuthorizeData()
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        cancelEdit();
        await getServerData();
    };

    const removeMessage = async () => {
        if (curIndex < 0 || messages[curIndex].id === undefined || messages[curIndex].id <= 0) {
            return;
        }
        const result = window.confirm("Вы уверены, что хотите удалить сообщение?");
        if (!result) {
            return;
        }
        const isVerify = await userContext.isVeryfyToken();
        if (!isVerify) {
            return;
        }
        await axios.delete(ServerDataService.apiUrl + "api/messages/delete/" + messages[curIndex].id + "/",
            {
                headers: userContext.getAuthorizeData()
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        cancelEdit();
        await getServerData();
    };

    const setToEdit = (index) => {
        if (curIndex === index) {
            cancelEdit();
            return;
        }
        if (index < 0 || messages[index].userId !== userContext.user.id) {
            return;
        }
        setIndex(index);
        setText(messages[index].text);
    };

    const cancelEdit = () => {
        setIndex(-1);
        setText("");
    };

    let sendIcon = <SendIcon onClick={addMessage} sx={{cursor: "pointer"}} />;
    return (
        <div className={styles.messages}>
            <div className={styles.messages_field}>
                {
                    messages.map((element, index) => (
                        <ChatItemComponent key={index} message={element} editItem={() => setToEdit(index)} index={index} curIndex={curIndex} />
                    ))
                }
            </div>
            <form className={styles.form_input}>
                <TextField
                    sx={{
                        "& .MuiInputBase-root": {
                            color: 'primary.main'
                        },
                        "& .MuiFormLabel-root": {
                            color: 'primary.main'
                        },
                        "& .MuiInputBase-root:before": {
                            borderColor: 'primary.main'
                        }
                    }}
                    value={text} onChange={(event) => setText(event.target.value)}
                    fullWidth={true} color="primary" label="Введите сообщение" variant="standard" type="text"
                    InputProps={{
                        endAdornment: (
                            sendIcon
                        )
                    }} />
                {curIndex >= 0 && <Button onClick={removeMessage} variant="outlined"><DeleteIcon /></Button>}
            </form>
        </div>
    );
}

export default ChatComponent;