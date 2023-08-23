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
import moment from "moment";
import TextShow from "./TextShow";

export default function EmojiPackManageDialog(props) {

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

    // const handleChangeEmojiPack = (e) => {
    //     let temp = props.emojiPack;
    //     temp[e.target.name] = e.target.value;
    //     props.setEmojiPack(temp, temp.id);
    // };

    const execUpdate = () => {
        props.execUpdate(props.emojiPack.emojiPackId);
        handleClose();
    }

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">絵文字パック編集</DialogTitle>
                <DialogContent>
                    <div id={'detailEmojiPackIconArea'} style={{
                        width: '100%',
                        margin: '10px 0'
                    }}>
                        <img src={props.emojiPack?.iconUrl} style={{
                            width: '100px',
                            textAlign: 'center',
                            margin: 'auto',
                            display: 'block'
                        }}></img>
                    </div>
                    <TextField
                        margin="dense"
                        label="絵文字パック名"
                        type="text"
                        name="name"
                        onChange={props.handleChange}
                        value={props.emojiPack?.name}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="バージョン"
                        type="text"
                        name="version"
                        onChange={props.handleChange}
                        value={props.emojiPack?.version}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="説明"
                        name="description"
                        type="text"
                        onChange={props.handleChange}
                        value={props.emojiPack?.description}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="クレジット"
                        name="credit"
                        type="text"
                        onChange={props.handleChange}
                        value={props.emojiPack?.credit}
                        fullWidth
                    />
                    <TextShow
                        label="作成日時"
                        text={props.emojiPack?.createdAt && moment(props.emojiPack?.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                    />
                    <TextShow
                        label="更新日時"
                        text={props.emojiPack?.createdAt && moment(props.emojiPack?.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                    />
                    {/*todo: ここに全絵文字のプレビューを表示*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        キャンセル
                    </Button>
                    <Button onClick={execUpdate} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

EmojiPackManageDialog.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
    execUpdate: PropTypes.func,
    emojiPack: PropTypes.shape({
        emojiPackId: PropTypes.number,
        iconUrl: PropTypes.string,
        name: PropTypes.string,
        version: PropTypes.string,
        description: PropTypes.string,
        credit: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }),
}
