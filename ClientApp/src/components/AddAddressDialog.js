import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField, DialogContentText
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddAddressDialog extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.state = {
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: ''
        };
    }

    submitHandler(evt) {
        evt.preventDefault();
        // pass the input field value to the event handler passed
        // as a prop by the parent (App)
        const resultObject = { city: this.state.city, district: this.state.district, street: this.state.street, house: this.state.house, numberOfFlat: this.state.numberOfFlat}
        

        this.props.onAddAction(resultObject);

        this.setState({
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: ''
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleClose() {
        this.setState({
            city: '',
            district: '',
            street: '',
            house: '',
            numberOfFlat: ''
        });
    }

    render() {
        const { onAddAction, onCancelAction, showDialog } = this.props;

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
                    Добавить адрес
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="city"
                            label="Город"
                            value={this.state.city}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="district"
                            label="Район"
                            value={this.state.district}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="street"
                            label="Улица"
                            value={this.state.street}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="house"
                            label="Номер дома"
                            type="number"
                            value={this.state.house}
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="numberOfFlat"
                            label="Номер квартиры"
                            type="number"
                            value={this.state.flat}
                            onChange={this.handleChange}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancelAction} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={this.submitHandler} color="secondary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddAddressDialog;