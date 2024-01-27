import styles from './telegram-page.module.scss';
import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Typography } from '@mui/material';
import UsersComponent from '../../components/users-component/users-component';
import RegisterDialogComponent from '../../components/dialogs/register-dialog-component/register-dialog-component';
import AutorizeDialogComponent from '../../components/dialogs/autorize-dialog-component/autorize-dialog-component';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getServerUserData } from '../../store/create-store';

const TelegramPage = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openRegistration, setOpenRegistration] = useState(false);
    const [openAutorization, setOpenAutorization] = useState(false);

    useEffect(() => {
        getUserData();
        document.addEventListener("keydown", onEscape, false);
        return () => {
            document.removeEventListener("keydown", onEscape, false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onEscape = (event) => {
        if (event.key === "Escape") {
            dispatch({ type: "setChatId", payload: 0 });
            navigate(`/telegram`);
        }
    };

    const getUserData = async () => {
        const user = await getServerUserData();
        dispatch({type: "setUser", payload: user});
    };

    const onLogOut = () => {
        dispatch({ type: "logOut" });
        navigate(`/telegram`);
    };

    const onOpenAutorize = () => {
        setOpenAutorization(true);
    };

    const onCloseAutorize = () => {
        setOpenAutorization(false);
    };

    const onOpenRegistration = () => {
        setOpenRegistration(true);
    };

    const onCloseRegistration = () => {
        setOpenRegistration(false);
    };

    let isAuthorize = false;
    if (store.user.id > 0) {
        isAuthorize = true;
    }
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                {isAuthorize && <AccountCircleIcon
                    sx={{ width: '50px', height: '50px', cursor: "pointer" }}
                    className={styles.margin_right}
                    onClick={() => onOpenRegistration()}
                />}
                {isAuthorize &&
                    <Typography
                        sx={{ display: 'inline', fontSize: "24px" }}
                        component="span"
                        variant="body2"
                        color="white"
                    >
                        Здравствуйте, {store.user.name}!
                    </Typography>
                }
                {isAuthorize && <Button onClick={() => onLogOut()} sx={{ marginLeft: '12px' }} variant="contained">Выйти</Button>}
                {!isAuthorize && <Button onClick={() => onOpenRegistration()} sx={{ marginLeft: '12px' }} variant="contained">Зарегистрироваться</Button>}
                {!isAuthorize && <Button onClick={() => onOpenAutorize()} sx={{ marginLeft: '12px' }} variant="contained">Войти</Button>}
            </div>
            <UsersComponent />
            <AutorizeDialogComponent open={openAutorization} onClose={() => onCloseAutorize()} />
            <RegisterDialogComponent open={openRegistration} onClose={() => onCloseRegistration()} edited={isAuthorize} />
        </div>
    );
};

export default TelegramPage;