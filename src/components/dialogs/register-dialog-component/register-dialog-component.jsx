import React, { useContext, useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import PropTypes from 'prop-types';
import { DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { UserContext } from "../../../contexts/user-context";
import RegisterModel from "../../../models/RegisterModel";
import axios from "axios";
import ServerDataService from "../../../services/server-data.service";

const RegisterDialogComponent = ({ onClose, open, edited }) => {
    const userContext = useContext(UserContext);
    const [registerModel, setRegister] = useState(new RegisterModel("", "", "", ""));

    useEffect(() => {
        if (edited) {
            setRegister(new RegisterModel(
                userContext.user.login,
                userContext.user.name,
                "",
                ""
            ));
        }
    }, [edited, userContext.user.login, userContext.user.name])

    const registerHandle = async () => {
        if (registerModel.login === undefined || registerModel.login.trim("") === "") {
            alert("Введите логин пользователя");
            return;
        }
        if (registerModel.name === undefined || registerModel.name.trim("") === "") {
            alert("Введите имя пользователя");
            return;
        }
        if (registerModel.password === undefined || registerModel.password.trim("") === "") {
            alert("Введите пароль пользователя");
            return;
        }
        if (registerModel.repeat_password === undefined || registerModel.repeat_password.trim("") === "") {
            alert("Повторите пароль пользователя");
            return;
        }
        if (registerModel.password !== registerModel.repeat_password) {
            alert("Пароли не совпадают");
            setRegister({ ...setRegister, password: "", repeat_password: "" });
            return;
        }
        if (edited) {
            if (registerModel.name === undefined || registerModel.name.trim("") === "") {
                alert("Введите имя пользователя");
                return;
            }
            if (registerModel.password === undefined || registerModel.password.trim("") === "") {
                alert("Введите пароль пользователя");
                return;
            }
            if (registerModel.repeat_password === undefined || registerModel.repeat_password.trim("") === "") {
                alert("Повторите пароль пользователя");
                return;
            }
            if (registerModel.password !== registerModel.repeat_password) {
                alert("Пароли не совпадают");
                setRegister({ ...setRegister, password: "", repeat_password: "" });
                return;
            }
            const isVerify = await userContext.isVeryfyToken();
            if (!isVerify) {
                return;
            }
            await axios.put(ServerDataService.apiUrl + "api/telegram/user-update",
                new RegisterModel(
                    registerModel.login,
                    registerModel.name,
                    registerModel.password,
                    registerModel.repeat_password
                ),
                {
                    headers: userContext.getAuthorizeData()
                })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                    onClose();
                    return;
                });
            await userContext.getUserData();
            onClose();
            return;
        }
        await axios.post(ServerDataService.apiUrl + "api/telegram/register",
            new RegisterModel(
                registerModel.login,
                registerModel.name,
                registerModel.password,
                registerModel.repeat_password
            ))
            .then((resp) => {
                console.log("success");
                localStorage.setItem("login", resp.data.login);
                localStorage.setItem("accessToken", resp.data.accessToken);
                localStorage.setItem("refreshToken", resp.data.refreshToken);
                localStorage.setItem("tokenExpire", resp.data.tokenExpire);
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.error);
                setRegister(new RegisterModel("", "", "", ""));
                return;
            });
        await userContext.getUserData();
        onClose();
    };

    return (
        <Dialog
            PaperProps={{
                style: {
                    backgroundColor: '#0a2138',
                    padding: '20px',
                },
            }}
            open={open} onClose={onClose}>
            <DialogTitle sx={{ m: 0, p: 2, color: 'primary.main' }} id="customized-dialog-title">
                {edited ? "Изменение профиля пользователя" : "Регистрация"}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'primary.main',
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ borderColor: "transparent", padding: "12px 0" }} dividers>
                {!edited &&
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
                            },
                            width: '100%',
                            marginBottom: '12px'
                        }}
                        label="Логин" variant="standard"
                        value={registerModel.login} onChange={(event) => setRegister({
                            ...registerModel,
                            login: event.target.value
                        })}
                    />
                }
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
                        },
                        width: '100%',
                        marginBottom: '12px'
                    }}
                    label="Имя" variant="standard"
                    value={registerModel.name} onChange={(event) => setRegister({
                        ...registerModel,
                        name: event.target.value
                    })}
                />
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
                        },
                        width: '100%',
                        marginBottom: '12px'
                    }}
                    label="Пароль" variant="standard" type="password"
                    value={registerModel.password} onChange={(event) => setRegister({
                        ...registerModel,
                        password: event.target.value
                    })}
                />
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
                        },
                        width: '100%',
                        marginBottom: '12px'
                    }}
                    label="Повторите пароль" variant="standard" type="password"
                    value={registerModel.repeat_password} onChange={(event) => setRegister({
                        ...registerModel,
                        repeat_password: event.target.value
                    })}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginTop: "12px" }}>
                <Button onClick={() => registerHandle()} variant="contained">Зарегистрироваться</Button>
            </DialogActions>
        </Dialog>
    );
};

RegisterDialogComponent.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
    edited: PropTypes.bool
};

export default RegisterDialogComponent;