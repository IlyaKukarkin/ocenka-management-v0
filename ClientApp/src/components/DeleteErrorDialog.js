﻿import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const headers = ["Оценщик", "Пользователь", "Адрес", "Клиент", "Квартира", "договоры", "Участок", "Автомобиль"];

class DeleteErrorDialog extends React.Component {
    render() {
        const { header, onCancelAction, showDialog } = this.props;

        return (
            <Dialog
                open={showDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Ошибка
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {headers[header]} состоит в договоре. Для удаления удалите сначала соответсвующий договор.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancelAction} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteErrorDialog;