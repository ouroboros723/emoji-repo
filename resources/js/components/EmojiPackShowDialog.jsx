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
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import TextShow from "./TextShow";
import DownloadIcon from "@mui/icons-material/Download";

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

    const showEmojiList = () => {
        if(props.emojis) {
            return props.emojis.map((value, index) => {

                return (
                    <img alt={value?.shortcode} title={':'+value?.shortcode+':'} src={value.imageURL} style={{height: '30px'}} loading="lazy"></img>
                );
            });
        } else {
            return null;
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

    const getErrors = (errors) => {
        return Object.keys(errors).map((key) => {
            return (
                <>
                    {
                        (errors[key]?.emptyShortCode !== null && errors[key]?.emptyShortCode !== undefined) ?
                            <li>
                                <span>ショートコードがありません。</span>
                                <img alt={'count: '+key} title={'count: '+key} src={errors[key]?.emptyShortCode?.imageURL} style={{height: '30px'}}></img>
                            </li>
                            :  null
                    }
                    {
                            (errors[key]?.emptyImageUrl !== null && errors[key]?.emptyImageUrl !== undefined) ?
                                <li>
                                    <span>絵文字URLがありません。</span>
                                    <div>{':'+errors[key]?.emptyImageUrl?.shortcode+':'}</div>

                                </li>
                                : null
                    }
                    {
                        (errors[key]?.emptyImageUrl !== null && errors[key]?.emptyImageUrl !== undefined) ?
                            <li>
                                <span>絵文字URLが不正です。</span>
                                <div>{':'+errors[key]?.emptyImageUrl?.shortcode+':'}</div>

                            </li>
                            : null
                    }
                </>
            );
        });
    }

    const getWarnings = (warnings) => {
        return Object.keys(warnings).map((key) => {

            return (
                <>
                    {
                        (warnings[key]?.invalidShortCode !== null && warnings[key]?.invalidShortCode !== undefined) ?
                            <li>
                                <span>一部のSNSで絵文字が正しく表示されない可能性があります。</span>
                                <div>
                                    <img alt={'count: '+key} title={'count: '+key} src={warnings[key].invalidShortCode?.imageURL} style={{height: '30px', margin: '0 5px 0 0'}}></img>
                                    <span>{':'+warnings[key]?.invalidShortCode?.shortcode+':'}</span>
                                </div>
                            </li>
                            :  null
                    }
                </>
            );
        });
    }

    const warnings = props.emojiPackStatus?.[props.emojiPack?.emojiPackId]?.body?.warnings ?? {};
    const errors = props.emojiPackStatus?.[props.emojiPack?.emojiPackId]?.body?.errors ?? {};
    const warningLength = Object.keys(warnings)?.length;
    const errorLength = Object.keys(errors)?.length;

    return (
        <div>
            <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">絵文字パック詳細</DialogTitle>
                <DialogContent>
                    {
                        (errorLength > 0) ?
                            <div id={'emojiPackErrors'} style={{
                                width: '100%',
                                margin: '10px 0',
                                padding: '5px',
                                backgroundColor: '#ffcbcb'
                            }}>
                                <div><b>エラー</b></div>
                                <span>この絵文字パックには次の問題があります。</span>
                                    {
                                        errors?.[0]?.message === 'access_failed' ? <li>絵文字メタデータにアクセス出来ません。</li> : null
                                    }
                                    {getErrors(errors)}
                            </div>
                            : null
                    }
                    {
                        (warningLength > 0) ?
                            <div id={'emojiPackWarnings'} style={{
                                width: '100%',
                                margin: '10px 0',
                                padding: '5px',
                                backgroundColor: '#ffe9a4'
                            }}>
                                <div><b>互換性の問題</b></div>
                                {getWarnings(warnings)}
                            </div>
                            : null
                    }
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
                    <div id={'emojisList'}>
                        <p>絵文字プレビュー</p>
                        {showEmojiList()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button disabled={errorLength > 0} variant={'contained'} color="primary" style={{position: 'absolute', left: '10px'}} onClick={() => {
                        window.open(props?.concurrentRedirectUrl+props.emojiPack?.sourceUrl, '_blank');
                    }}>
                        <DownloadIcon /> インストール
                    </Button>
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
    emojis: PropTypes.array.isRequired,
    concurrentRedirectUrl: PropTypes.string,
    emojiPackStatus: PropTypes.object,
    emojiPack: PropTypes.shape({
        emojiPackId: PropTypes.number,
        sourceUrl: PropTypes.string,
        iconUrl: PropTypes.string,
        name: PropTypes.string,
        version: PropTypes.string,
        description: PropTypes.string,
        credit: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }),
}
