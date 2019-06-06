import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography
} from '@material-ui/core';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ShowContractDialog extends React.Component {
    constructor(props) {
        super(props);

        this.myHandleClose = this.myHandleClose.bind(this);
    }

    myHandleClose() {
        this.props.onCancelAction();
    }

    render() {
        const { showDialog, Contract } = this.props;

        if (Contract.client === undefined) {
            return (<div/>);
        } else {

            return (
                <Dialog
                    open={showDialog}
                    onClose={this.myHandleClose}
                    TransitionComponent={Transition}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        Контракт - подробно
                </DialogTitle>
                    <DialogContent>
                        <Typography component={'span'} variant="body1">
                            Контракт
                        <ul>
                                <li>{Contract.contractSumm}</li>
                                <li>{Contract.prepaid}</li>
                                <li>{Contract.startDate}</li>
                                <li>{Contract.finishDate}</li>
                            </ul>
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Клиент
                        {Contract.clientType === 'Indiv' ?
                                <ul>
                                    <li>{Contract.client.surname}</li>
                                    <li>{Contract.client.name}</li>
                                    <li>{Contract.client.patronymic}</li>
                                </ul> :
                                <ul>
                                    <li>{Contract.client.companyName}</li>
                                    <li>{Contract.client.mailAddress}</li>
                                    <li>{Contract.client.paymentAccount}</li>
                                </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Объект оценки
                        {Contract.objectType === 'Flat' ?
                                <ul>
                                    <li>{Contract.object.area}</li>
                                    <li>{Contract.object.numberOfRooms}</li>
                                    <li>{Contract.object.floor}</li>
                                    <li>{Contract.object.street}</li>
                                    <li>{Contract.object.house}</li>
                                </ul> :
                                Contract.objectType === 'Car' ?
                                    <ul>
                                        <li>{Contract.object.mark}</li>
                                        <li>{Contract.object.model}</li>
                                        <li>{Contract.object.licenseNumber}</li>
                                    </ul> :
                                    <ul>
                                        <li>{Contract.object.area}</li>
                                        <li>{Contract.object.usageType}</li>
                                    </ul>
                            }
                        </Typography>
                        <Typography component={'span'} variant="body1">
                            Оценщик
                        <ul>
                                <li>{Contract.appraiser.surname}</li>
                                <li>{Contract.appraiser.name}</li>
                                <li>{Contract.appraiser.patronymic}</li>
                                <li>{Contract.appraiser.position}</li>
                            </ul>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.myHandleClose} color="primary">
                            Закрыть
                    </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export default ShowContractDialog;