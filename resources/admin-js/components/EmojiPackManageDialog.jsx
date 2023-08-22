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
        // console.log(e.target.value);

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
    //     console.log("parent emojiPack:", temp);
    //     props.setEmojiPack(temp, temp.id);
    // };

    const handleChangePayment = (e) => {
        setPayment(e.target.value);
    };

    const execUpdate = () => {
        props.execUpdate(props.emojiPack.id);
        handleClose();
    }

    const [payment, setPayment] = useState(4000);

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
                    <TextField
                        margin="dense"
                        label="作成日時"
                        name="createdAt"
                        type="text"
                        onChange={props.handleChange}
                        value={props.emojiPack?.createdAt && moment(props.emojiPack?.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                        disabled
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="更新日時"
                        name="updatedAt"
                        type="text"
                        onChange={props.handleChange}
                        value={props.emojiPack?.createdAt && moment(props.emojiPack?.updatedAt).format('YYYY/MM/DD HH:mm:ss')}
                        disabled
                        fullWidth
                    />
                    {/*todo: 変更地位に値が書き換わるのを防ぐために、一時変数をvalueに導入*/}
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
