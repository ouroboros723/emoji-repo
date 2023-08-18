import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";

export default function NewParticipantDialog(props) {
    const handleClickOpen = () => {
        props.handleOpen(true);
    };

    const handleClose = () => {
        props.handleOpen(false);
    };

    const execRegister = () => {
        props.execRegister();
        handleClose();
    }

    return (
        <div>
            <Button variant={'contained'} color="primary" onClick={handleClickOpen}>
                参加者追加
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">参加者追加</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="参加者名"
                        type="text"
                        name="name"
                        onChange={props.handleChange}
                        value={props.newParticipant?.name}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="LINE名"
                        type="text"
                        name="lineName"
                        onChange={props.handleChange}
                        value={props.newParticipant?.lineName}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="キャラクター名"
                        name="characterName"
                        type="text"
                        onChange={props.handleChange}
                        value={props.newParticipant?.characterName}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Twitter ID"
                        name="twitterId"
                        type="text"
                        onChange={props.handleChange}
                        value={props.newParticipant?.twitterId}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="参加種別"
                        name="joinType"
                        type="text"
                        onChange={props.handleChange}
                        value={props.newParticipant?.joinType}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="ひとこと"
                        name="comment"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.comment}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="備考"
                        name="remarks"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.remarks}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="参加費"
                        name="entryFee"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.entryFee}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button onClick={execRegister} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

NewParticipantDialog.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
    execRegister: PropTypes.func,
    newParticipant: PropTypes.shape({
        name: PropTypes.string,
        characterName: PropTypes.string,
        lineName: PropTypes.string,
    }),
}
