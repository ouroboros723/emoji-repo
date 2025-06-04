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
            <Button variant={'contained'} color="primary" onClick={() => {window.location.href='/admin/login'}}>
                ログインして登録
            </Button>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" style={props?.style}>
                <DialogTitle id="form-dialog-title">絵文字パック追加</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="絵文字パックURL"
                        type="text"
                        name="sourceUrl"
                        onChange={props.handleChange}
                        value={props.newEmojiPack?.sourceUrl}
                        fullWidth
                    />
                    <b style={{fontSize: '14.3px'}}>注意: 登録した絵文字パックの情報の修正・削除は<a href={props?.adminConcrntUrl} target={'_blank'}>管理者</a>に依頼する必要があります。</b>
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
        sourceUrl: PropTypes.string,
    }),
    adminConcrntUrl: PropTypes.string,
    style: PropTypes.object,
}
