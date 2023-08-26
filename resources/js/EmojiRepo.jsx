import React, {Component} from 'react';
import {
    AppBar,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@material-ui/core";
import axios from "axios";
import CommentShow from "../admin-js/components/CommentShow";
import DownloadIcon from '@mui/icons-material/Download';
import EmojiPackShowDialog from "./components/EmojiPackShowDialog";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

class EmojiRepo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            emojis: [],
            isEmojiPackDialogOpen: false,
            isNewEmojiPackDialogOpen: false,
            isCommentShowDialogOpen: [],
            isLoaded: false,
            editEmojiPack: {
                emojiPackKind: null,
                name: '',
                characterName: '',
                lineName: '',
                twitterId: '',
                comment: '',
                isPayed: null,
                entryFee: null,
                joinType: null,
                remarks: null,
            },
            newEmojiPack: {
                sourceUrl: '',
            }
        }

        this.overlayWidth = '100%';

        this.title = this.props.siteTitle;

        const yenFormatter = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            currencyDisplay: 'name',
        });

        this.handleNewEmojiPackDialogOpen = (open) => {
            this.setState({isNewEmojiPackDialogOpen: open});
        }

        this.handleEmojiPackManageDialogOpen = (open, index) => {
            if(open === true) {
                let editEmojiPack = this.state.data[index];
                this.getEmojiList(editEmojiPack?.emojiPackId);
                this.setState({editEmojiPack: editEmojiPack});
            } else {
                let editEmojiPack = {
                    emojiPackKind: null,
                    name: '',
                    characterName: '',
                    lineName: '',
                    twitterId: '',
                    comment: '',
                    isPayed: null,
                    entryFee: null,
                    joinType: null,
                    remarks: null,
                }
                this.setState({editEmojiPack: editEmojiPack});
                this.setState({emojis: []});
            }
            this.setState({isEmojiPackDialogOpen: open});
        }

        this.handleCommentShowDialogOpen = (open, index) => {
            let isCommentShowDialogOpen = this.state.isCommentShowDialogOpen;
            isCommentShowDialogOpen[index] = open;
            this.setState({isCommentShowDialogOpen: isCommentShowDialogOpen});
        }

        this.newEmojiPackChangeValue = (e) => {
            let newEmojiPack = this.state.newEmojiPack;
            newEmojiPack[e.target.name] = e.target.value;
            this.setState({newEmojiPack: newEmojiPack});
        }

        // this.emojiPackChangeValue = (e) => {
        //     let emojiPack = this.state.editEmojiPack;
        //     emojiPack[e.target.name] = e.target.value;
        //     this.setState({editEmojiPack: emojiPack});
        // }

        // this.setEmojiPack = (emojiPack, index) => {
        //     let temp = this.state.data;
        //     temp[index] = emojiPack;
        //     this.setState({data: temp});
        // }

        this.execRegister = () => {
            axios.post(`/api/emoji/add`, this.state.newEmojiPack)
                .then(()=> {
                    this.getEmojiPackList();
                    const newEmojiPack =  {
                        sourceUrl: '',
                    }
                    this.setState({newEmojiPack: newEmojiPack});
                })
                .catch(() => {
                    alert('登録に失敗しました。時間をおいてお試しください。');
                });
        }

        this.makeList = () => {
            return this.state.data.map((value, index) => {
                return (
                    <TableRow>
                        <TableCell style={{minWidth: '120px'}}>
                            <img style={{width: '50px'}} src={value?.iconUrl} />
                        </TableCell>
                        <TableCell style={{minWidth: '120px'}}>
                            {value?.name}
                        </TableCell>
                        <TableCell>
                            {value?.version}
                        </TableCell>
                        <TableCell>
                            <div style={{textAlign: 'center', margin: '20px'}}>
                                <Button variant={'contained'} color="primary" onClick={() => this.handleEmojiPackManageDialogOpen(true, index)}>
                                    <ChatBubbleIcon />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button variant={'contained'} color="primary" onClick={() => {
                                window.open(this.props?.concurrentRedirectUrl+value?.sourceUrl, '_blank');
                            }}>
                                <DownloadIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            });
        }

        this.getEmojiPackList = () => {
            axios.get(`/api/emoji`)
                .then((response) => {
                    this.setState({data: response.data.body});
                    this.setState({isLoaded: true});
                });
        }

        this.getEmojiList = (emojiPackId) => {
            if(emojiPackId) {
                axios.get("/api/emoji/"+emojiPackId)
                    .then((response) => {
                        this.setState({emojis: response.data.body?.emojis ?? []});
                    });
            }
        }
    }

    componentDidMount() {
        this.getEmojiPackList();
        // setTimeout(() => { // テスト用
        //     this.getEmojiPackList();
        // }, 8000);
        // setInterval(() => {
        //     this.getEmojiPackList();
        // }, 8000);
    }

    render() {
        this.overlayWidth = document.querySelector('#tableBody')?.scrollWidth ? document.querySelector('#tableBody')?.scrollWidth+'px' : '100%';
        return (
            <>
                <div style={{flexGrow: 1}}>
                    <AppBar position="fixed">
                        <Typography variant="h6" style={{padding: '10px'}}>
                            {this.props.siteTitle}
                        </Typography>
                    </AppBar>
                </div>
                <TableContainer id={'tableRoot'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto', marginTop: '60px'}}>
                    <Table id={'tableBody'} style={{width: '100%', minHeight: '120px'}}>
                        <TableHead>
                            <TableRow >
                                <TableCell></TableCell>
                                <TableCell>絵文字パック名</TableCell>
                                <TableCell>バージョン</TableCell>
                                <TableCell>詳細</TableCell>
                                <TableCell>インストール</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.makeList()}
                        </TableBody>
                    </Table>
                    {this.state.isLoaded ? null : <div id={'circularRoot'} style={{position: 'absolute', width: this.overlayWidth, height: '100%', textAlign: 'center', backgroundColor: 'rgb(127 127 127 / 51%)', 'bottom': '0'}}><CircularProgress style={{position: 'absolute', top: '38%', transform: 'translate(0, -50%)'}} />
                    </div>}
                </TableContainer>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <EmojiPackShowDialog open={this.state.isEmojiPackDialogOpen} handleChange={this.emojiPackChangeValue} emojiPack={this.state.editEmojiPack} emojis={this.state.emojis} handleOpen={(open) => this.handleEmojiPackManageDialogOpen(open, null)} concurrentRedirectUrl={this.props?.concurrentRedirectUrl} />
                </div>
            </>
        );
    }
}

export default EmojiRepo;

