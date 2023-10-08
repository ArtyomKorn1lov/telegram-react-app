import styles from "./users-component.module.scss";
import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ChatComponent from "../chat-component/chat-component";
import UserItemComponent from "../user-item-component/user-item-component";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import ServerDataService from "../../services/server-data.service";
import { useSelector } from 'react-redux';
import { veryfyToken, getHeadAuthoriseData } from "../../store/create-store";

const UsersComponent = () => {
    const store = useSelector((state) => state);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getServerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.user]);

    const getServerData = async () => {
        const isVerify = await veryfyToken();
        if (!isVerify) {
            return;
        }
        await axios.get(ServerDataService.apiUrl + "api/telegram/getUsers/" + store.user.id,
            {
                headers: getHeadAuthoriseData()
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
                {users.length > 0 && store.user.name ? (
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
                <Route path="user/:senderId" element={<ChatComponent curUserId={store.user.id} />} />
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