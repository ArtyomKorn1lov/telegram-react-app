import React, { useContext, useState } from "react";
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
import AuthorizeModel from "../../../models/AuthorizeModel";
import axios from "axios";
import ServerDataService from "../../../services/server-data.service";

const AutorizeDialogComponent = ({ onClose, open }) => {
    const userContext = useContext(UserContext);
    const [authorizeModel, setAuth] = useState(new AuthorizeModel("", ""));

    const authHandle = async () => {
        if (authorizeModel.login === undefined || authorizeModel.login.trim("") === "") {
            alert("Введите логин");
            return;
        }
        if (authorizeModel.password === undefined || authorizeModel.password.trim("") === "") {
            alert("Введите пароль");
            return;
        }
        await axios.post(ServerDataService.apiUrl + "api/telegram/autorize",
            new AuthorizeModel(
                authorizeModel.login,
                authorizeModel.password
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
                setAuth(new AuthorizeModel("", ""));
                return;
            });
        await userContext.getUserData();
        onClose();
    }

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
                Войти
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
                    value={authorizeModel.name}
                    onChange={(event) => setAuth({ ...authorizeModel, login: event.target.value })}
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
                    value={authorizeModel.password}
                    onChange={(event) => setAuth({ ...authorizeModel, password: event.target.value })}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", marginTop: "12px" }}>
                <Button onClick={() => authHandle()} variant="contained">Войти</Button>
            </DialogActions>
        </Dialog>
    );
};

AutorizeDialogComponent.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};

export default AutorizeDialogComponent;