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

export default function TwitterLogin(props) {
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
                プロフィール編集(Twitterログイン)
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">プロフィール編集(Twitterログイン)</DialogTitle>
                <DialogContent>
                    <p>プロフィールの編集にはTwitterアカウントでのログインが必要です。</p>
                    <p>※Twitterアカウントの情報は、TwitterIDに基づく本人確認のために使用します。<br />
                        ※本人確認完了後、Twitterから取得した情報は即時に破棄されます。</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button href="/login/twitter" color="primary">
                        Twitterでログイン
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

TwitterLogin.propTypes = {
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
