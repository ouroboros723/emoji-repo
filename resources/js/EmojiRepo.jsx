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
    TableRow, Typography,
    TextField
} from "@material-ui/core";
import axios from "axios";
import CommentShow from "../admin-js/components/CommentShow";
import DownloadIcon from '@mui/icons-material/Download';
import EmojiPackShowDialog from "./components/EmojiPackShowDialog";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewEmojiPackDialog from "./components/NewEmojiPackDialog";

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
            },
            emojiPackStatus: {
                body: {},
                isStatusLoaded: false,
            },
            searchTerm: '',
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

        this.handleSearchChange = (event) => {
            this.setState({ searchTerm: event.target.value });
        };

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
                .catch((error) => {
                    let responseData = error.response.data;
                    if(responseData.message === 'already_registered') {
                        alert('この絵文字パックは既に登録されています。');
                    } else {
                        alert("登録に失敗しました。時間をおいてお試しください。\n" + responseData?.message);
                    }
                });
        }

        this.checkEmojiPack = (emojiPackId) => {
            axios.get(`/api/emoji/check/`+emojiPackId)
                .then((response)=> {
                    let emojiPackStatus = this.state.emojiPackStatus;
                    if(response.data?.exception === 'ErrorException') {
                        emojiPackStatus[emojiPackId] = {
                            body:
                                {
                                    errors:
                                        [
                                            {
                                                success: 'false',
                                                message: 'access_failed',
                                            }
                                        ],
                                    warnings: [],
                                },
                            checkSuccess: true,
                            isStatusLoaded: true
                        };
                        this.setState({emojiPackStatus: emojiPackStatus});
                    } else {
                        emojiPackStatus[emojiPackId] = response.data;
                        emojiPackStatus[emojiPackId] = {
                            ...emojiPackStatus[emojiPackId],
                            checkSuccess: true,
                            isStatusLoaded: true
                        }
                        this.setState({emojiPackStatus: emojiPackStatus});
                    }
                })
                .catch((error) => {
                    if(error.response.status === 502) {
                        let emojiPackStatus = this.state.emojiPackStatus;
                        emojiPackStatus[emojiPackId] = {
                            body:
                                {
                                    errors:
                                        [
                                            {
                                                success: 'false',
                                                message: 'access_failed',
                                            }
                                        ],
                                    warnings: [],
                                },
                            checkSuccess: true,
                            isStatusLoaded: true
                        };
                        this.setState({emojiPackStatus: emojiPackStatus});
                    } else {
                        let emojiPackStatus = this.state.emojiPackStatus;
                        emojiPackStatus[emojiPackId] = {
                            ...emojiPackStatus[emojiPackId],
                            checkSuccess: false,
                            isStatusLoaded: true
                        }
                        this.setState({emojiPackStatus: emojiPackStatus});
                        console.error('EmojiPackStatus: '+emojiPackId+' get status failed.');
                    }
                });
        }

        this.makeList = () => {
            const filteredData = this.state.data.filter(item => {
                if (this.state.searchTerm === "") return true;
                const searchTermLower = this.state.searchTerm.toLowerCase();
                return (
                    item.name?.toLowerCase().includes(searchTermLower) ||
                    item.characterName?.toLowerCase().includes(searchTermLower) ||
                    item.lineName?.toLowerCase().includes(searchTermLower) ||
                    item.comment?.toLowerCase().includes(searchTermLower)
                );
            });
            return filteredData.map((value, index) => {
                const warningLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.warnings ?? {})?.length;
                const errorLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.errors ?? {})?.length;
                // Adjust index to original index if needed for certain operations, but for rendering, sequential index is fine.
                // For functions like handleEmojiPackManageDialogOpen, we might need to find original index if filteredData is used directly
                // However, the current implementation of handleEmojiPackManageDialogOpen uses the index from the original data array if it's not modified.
                // Let's assume for now that the index passed to dialog openers refers to the position in the *original* data array.
                // This means we might need to adjust how `index` is used if `handleEmojiPackManageDialogOpen` expects an index from the original `this.state.data`.
                // For now, we'll use the filtered index. If issues arise, we'll revise.
                // A safer way would be to pass `value.emojiPackId` or the `value` object itself to handlers.
                // The current `handleEmojiPackManageDialogOpen(true, index)` expects index from this.state.data.
                // So, we should find the original index or pass the item directly.
                // Let's find the original index:
                const originalIndex = this.state.data.findIndex(originalItem => originalItem.emojiPackId === value.emojiPackId);

                return (
                    <TableRow key={value.emojiPackId}> {/* Added key for stability */}
                        <TableCell style={{minWidth: '120px'}}>
                            {
                                this.state.emojiPackStatus?.[value?.emojiPackId]?.isStatusLoaded ?
                                    (
                                        this.state.emojiPackStatus?.[value?.emojiPackId]?.checkSuccess ?
                                            (
                                                (errorLength > 0 ) ?
                                                    <DangerousIcon style={{color: 'red'}} /> :
                                                    (
                                                        (warningLength > 0) ?
                                                            <WarningIcon style={{color: '#ffa700'}} /> : <CheckCircleIcon style={{color: 'green'}} />
                                                    )
                                            )
                                            : <WarningIcon style={{color: 'gray'}} />
                                    )
                                : <CircularProgress />
                            }
                        </TableCell>
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
                                <Button variant={'contained'} color="primary" onClick={() => this.handleEmojiPackManageDialogOpen(true, originalIndex)}>
                                    <ChatBubbleIcon />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button disabled={(this.state.emojiPackStatus?.[value?.emojiPackId]?.isStatusLoaded ?? false) ? (errorLength > 0) : false} variant={'contained'} color="primary" onClick={() => {
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

                    response.data.body.map((value, index) => {
                        this.checkEmojiPack(value?.emojiPackId);
                    });
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
                <TableContainer id={'tableRoot'} component={Paper}
                                style={{position: 'relative', width: '80vw', margin: 'auto', marginTop: '60px'}}>
                    <TextField
                        label="絵文字パック名を検索"
                        variant="outlined"
                        style={{ margin: "20px", width: "calc(100% - 40px)" }}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />
                    <Table id={'tableBody'} style={{width: '100%', minHeight: '120px'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
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
                    {this.state.isLoaded ? null : <div id={'circularRoot'} style={{
                        position: 'absolute',
                        width: this.overlayWidth,
                        height: '100%',
                        textAlign: 'center',
                        backgroundColor: 'rgb(127 127 127 / 51%)',
                        'bottom': '0'
                    }}><CircularProgress style={{position: 'absolute', top: '38%', transform: 'translate(0, -50%)'}}/>
                    </div>}
                </TableContainer>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <NewEmojiPackDialog handleOpen={this.handleNewEmojiPackDialogOpen}
                                        open={this.state.isNewEmojiPackDialogOpen}
                                        handleChange={this.newEmojiPackChangeValue}
                                        newEmojiPack={this.state.newEmojiPack} execRegister={this.execRegister}
                                        adminConcrntUrl={this.props?.adminConcrntUrl}
                    />
                </div>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <EmojiPackShowDialog open={this.state.isEmojiPackDialogOpen}
                                         handleChange={this.emojiPackChangeValue} emojiPack={this.state.editEmojiPack}
                                         emojis={this.state.emojis}
                                         handleOpen={(open) => this.handleEmojiPackManageDialogOpen(open, null)}
                                         concurrentRedirectUrl={this.props?.concurrentRedirectUrl}
                                         emojiPackStatus={this.state.emojiPackStatus}/>
                </div>
            </>
        );
    }
}

export default EmojiRepo;

