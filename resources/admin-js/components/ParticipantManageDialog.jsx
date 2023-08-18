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

export default function ParticipantManageDialog(props) {

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

    // const handleChangeParticipant = (e) => {
    //     let temp = props.participant;
    //     temp[e.target.name] = e.target.value;
    //     console.log("parent participant:", temp);
    //     props.setParticipant(temp, temp.id);
    // };

    const handleChangePayment = (e) => {
        setPayment(e.target.value);
    };

    const execUpdate = () => {
        props.execUpdate(props.participant.id);
        handleClose();
    }

    const [payment, setPayment] = useState(4000);

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">参加者詳細</DialogTitle>
                <DialogContent>
                    {/*todo: キャラクタ画像*/}
                    {/*<Avatar alt="charPhoto" src="/static/images/avatar/1.jpg" style={null} />*/}
                    <TextField
                        margin="dense"
                        label="参加者名"
                        type="text"
                        name="name"
                        onChange={props.handleChange}
                        value={props.participant?.name}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="LINE名"
                        type="text"
                        name="lineName"
                        onChange={props.handleChange}
                        value={props.participant?.lineName}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="キャラクター名"
                        name="characterName"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.characterName}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Twitter ID"
                        name="twitterId"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.twitterId}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="参加種別"
                        name="joinType"
                        type="text"
                        onChange={props.handleChange}
                        value={props.participant?.joinType}
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
                    {/*todo: 変更地位に値が書き換わるのを防ぐために、一時変数をvalueに導入*/}
                    <FormControl component="fieldset">
                        <FormLabel component="legend">支払い</FormLabel>
                        <RadioGroup aria-label="支払状況" name="isPayed" value={Number(props.participant.isPayed)} onChange={handleChangeBool}>
                            <FormControlLabel value={0} control={<Radio />} label="未入金" />
                            <FormControlLabel value={1} control={<Radio />} label="入金済み" />
                        </RadioGroup>
                    </FormControl>
                    { props.participant.isPayed == true ?
                        <>
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="支払額" name="payment" value={Number(payment)} onChange={handleChangePayment}>
                                    <FormControlLabel value={2000} control={<Radio />} label="2,000円" />
                                    <FormControlLabel value={4000} control={<Radio />} label="4,000円" />
                                    <FormControlLabel value={5000} control={<Radio />} label="5,000円" />
                                    <FormControlLabel value={10000} control={<Radio />} label="10,000円" />
                                </RadioGroup>
                            </FormControl>
                            <DialogContentText>おつり: {yenFormatter.format(payment ? payment - props.participant?.entryFee : 0)}</DialogContentText>
                        </>
                        :
                        null
                    }
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

ParticipantManageDialog.propTypes = {
    open: PropTypes.bool,
    handleOpen: PropTypes.func,
    handleChange: PropTypes.func,
    execUpdate: PropTypes.func,
    participant: PropTypes.shape({
        name: PropTypes.string,
        characterName: PropTypes.string,
        lineName: PropTypes.string,
        payment: PropTypes.string,
        isPayed: PropTypes.bool,
    }),
}
