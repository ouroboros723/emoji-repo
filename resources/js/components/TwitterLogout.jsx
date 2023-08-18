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

export default function TwitterLogout(props) {
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
            <Button style={{backgroundColor: 'red'}} variant={'contained'} color="primary" onClick={handleClickOpen}>
                ログアウト
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">ログアウト</DialogTitle>
                <DialogContent>
                    <p>ログアウトしますか？</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button href="/auth/twitter/logout" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

TwitterLogout.propTypes = {
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
