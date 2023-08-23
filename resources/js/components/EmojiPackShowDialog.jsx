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
import moment from "moment/moment";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import TextShow from "./TextShow";

export default function EmojiPackShowDialog(props) {

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
                <DialogTitle id="form-dialog-title">絵文字パック詳細</DialogTitle>
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
                    <TextShow
                        label="絵文字パック名"
                        text={props.emojiPack?.name}
                    />
                    <TextShow
                        margin="dense"
                        label="バージョン"
                        type="text"
                        name="version"
                        // onChange={props.handleChange}
                        text={props.emojiPack?.version}
                        disabled
                        fullWidth
                    />
                    <TextShow
                        margin="dense"
                        label="説明"
                        name="description"
                        type="text"
                        // onChange={props.handleChange}
                        text={props.emojiPack?.description}
                        disabled
                        fullWidth
                    />
                    <TextShow
                        margin="dense"
                        label="クレジット"
                        name="credit"
                        type="text"
                        // onChange={props.handleChange}
                        text={props.emojiPack?.credit}
                        disabled
                        fullWidth
                    />
                    <TextShow
                        margin="dense"
                        label="作成日時"
                        name="createdAt"
                        type="text"
                        // onChange={props.handleChange}
                        text={props.emojiPack?.createdAt && moment(props.emojiPack?.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                        disabled
                        fullWidth
                    />
                    <TextShow
                        margin="dense"
                        label="更新日時"
                        name="updatedAt"
                        type="text"
                        // onChange={props.handleChange}
                        text={props.emojiPack?.createdAt && moment(props.emojiPack?.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                        disabled
                        fullWidth
                    />
                    {/*todo: ここに全絵文字のプレビューを表示*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

EmojiPackShowDialog.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
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
