import styles from "./users-component.module.scss";
import React, { useContext, useEffect, useState } from "react";
import List from '@mui/material/List';
import ChatComponent from "../chat-component/chat-component";
import UserItemComponent from "../user-item-component/user-item-component";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import ServerDataService from "../../services/server-data.service";
import { UserContext } from "../../contexts/user-context";

const UsersComponent = () => {
    const userContext = useContext(UserContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getServerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userContext.user]);

    const getServerData = async () => {
        const isVerify = await userContext.isVeryfyToken();
        if (!isVerify) {
            return;
        }
        await axios.get(ServerDataService.apiUrl + "api/telegram/getUsers/" + userContext.user.id,
            {
                headers: userContext.getAuthorizeData()
            })
            .then((response) => {
                setUsers(ServerDataService.convertTelegramUsers(response.data));
            })
            .catch((error) => {
                console.log(error);
                setUsers([]);
            });
    };

    return (
        <div className={styles.body_chat}>
            <div className={styles.users}>
                {users.length > 0 && userContext.user.name ? (
                    <List sx={{ width: '100%', background: "#214366" }}>
                        {
                            users.map((element, index) => (
                                <UserItemComponent key={index} userItem={element} />
                            ))
                        }
                    </List>
                ) : (
                    <span>Чаты<br/> не доступны</span>
                )}

            </div>
            <Routes>
                <Route path="user/:senderId" element={<ChatComponent curUserId={userContext.user.id} />} />
                <Route path="*" element={
                    <div className={styles.messages}>
                        <h1>Выберете чат</h1>
                    </div>
                } />
            </Routes>
        </div>
    );
};

export default UsersComponent;