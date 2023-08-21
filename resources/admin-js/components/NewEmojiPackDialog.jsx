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

export default function NewEmojiPackDialog(props) {
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
                インポート
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">絵文字パック追加</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="絵文字パックURL"
                        type="text"
                        name="emojiPackUrl"
                        onChange={props.handleChange}
                        value={props.newEmojiPack?.emojiPackUrl}
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

NewEmojiPackDialog.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
    execRegister: PropTypes.func,
    newEmojiPack: PropTypes.shape({
        emojiPackUrl: PropTypes.string,
    }),
}
