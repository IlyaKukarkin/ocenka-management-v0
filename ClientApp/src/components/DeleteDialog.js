import React from 'react';
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

const headers = ["адреса", "оценщиков"];

class DeleteDialog extends React.Component {
    render() {
        const { header, onDeleteAction, onCancelAction, showDialog } = this.props;

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
                    Удалить выбранные {headers[header]} ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Нажав на кнопку "Удалить" вы навсегда удалите выбранные {headers[header]} из базы данных.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancelAction} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={onDeleteAction} color="secondary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteDialog;