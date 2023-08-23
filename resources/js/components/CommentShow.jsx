import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import {Avatar, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

export default function CommentShow(props) {

    const yenFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        currencyDisplay: 'name',
    });

    const handleClickOpen = () => {
        props.handleOpen(true);
    };

    const handleClose = () => {
        props.handleOpen(false);
    };

    const handleChangeBool = (e) => {
        if(Number(e.target.value) === 1) {
            let dummyE = {
                target: {
                    name: e.target.name,
                    value: true,
                }
            };
            props.handleChange(dummyE);
        }

        if(Number(e.target.value) === 0) {
            let dummyE = {
                target: {
                    name: e.target.name,
                    value: false,
                }
            };
            props.handleChange(dummyE);
        }
    }

    // const handleChangeParticipant = (e) => {
    //     let temp = props.participant;
    //     temp[e.target.name] = e.target.value;
    //     props.setParticipant(temp, temp.id);
    // };

    const handleChangePayment = (e) => {
        setPayment(e.target.value);
    };

    const execUpdate = () => {
        props.execUpdate(props.participant.id);
        handleClose();
    }

    return (
        <div>
            <Button color="primary" onClick={handleClickOpen}>
                <ChatBubbleIcon />
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">ひとこと</DialogTitle>
                <DialogContent>
                    <p>{props.participant?.comment}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

CommentShow.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
    execUpdate: PropTypes.func,
    participant: PropTypes.shape({
        name: PropTypes.string,
        characterName: PropTypes.string,
        lineName: PropTypes.string,
        isPayed: PropTypes.bool,
        comment: PropTypes.string,
    }),
}
