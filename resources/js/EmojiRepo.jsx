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
import { FixedSizeList } from 'react-window';
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

        this.Row = ({ index, style }) => {
            const filteredData = this.getFilteredData(); // Use getFilteredData here
            const value = filteredData[index];
            // If value is undefined (e.g., list is empty or index is out of bounds), render nothing or a placeholder
            if (!value) {
                return null; 
            }
            const originalIndex = this.state.data.findIndex(originalItem => originalItem.emojiPackId === value.emojiPackId);
            const warningLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.warnings ?? {})?.length;
            const errorLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.errors ?? {})?.length;

            return (
                <TableRow key={value.emojiPackId} style={style} component="div">
                    <TableCell style={{minWidth: '120px'}} component="div">
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
                            : <CircularProgress size={24} /> // Adjusted size for better fit
                        }
                    </TableCell>
                    <TableCell style={{minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} component="div">
                        <img style={{width: '50px', height: '50px', objectFit: 'contain'}} src={value?.iconUrl} /> {/* Added height and objectFit */}
                    </TableCell>
                    <TableCell style={{minWidth: '120px', display: 'flex', alignItems: 'center'}} component="div"> {/* Removed justifyContent */}
                        {value?.name}
                    </TableCell>
                    <TableCell style={{display: 'flex', alignItems: 'center'}} component="div"> {/* Removed justifyContent */}
                        {value?.version}
                    </TableCell>
                    <TableCell style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} component="div">
                        <div style={{textAlign: 'center', margin: '0px'}}>
                            <Button variant={'contained'} color="primary" onClick={() => this.handleEmojiPackManageDialogOpen(true, originalIndex)}>
                                <ChatBubbleIcon />
                            </Button>
                        </div>
                    </TableCell>
                    <TableCell style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} component="div">
                        <Button disabled={(this.state.emojiPackStatus?.[value?.emojiPackId]?.isStatusLoaded ?? false) ? (errorLength > 0) : false} variant={'contained'} color="primary" onClick={() => {
                            window.open(this.props?.concurrentRedirectUrl+value?.sourceUrl, '_blank');
                        }}>
                            <DownloadIcon />
                        </Button>
                    </TableCell>
                </TableRow>
            );
        };

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

        // this.makeList can be removed or modified if Row component handles all rendering logic.
        // For now, let's keep it to get filteredData, but it won't render directly.
        this.getFilteredData = () => {
            return this.state.data.filter(item => {
                if (this.state.searchTerm === "") return true;
                const searchTermLower = this.state.searchTerm.toLowerCase();
                return (
                    item.name?.toLowerCase().includes(searchTermLower) ||
                    item.characterName?.toLowerCase().includes(searchTermLower) ||
                    item.lineName?.toLowerCase().includes(searchTermLower) ||
                    item.comment?.toLowerCase().includes(searchTermLower)
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
        const filteredData = this.getFilteredData();
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
                    {/* Outer container for the table, including FixedSizeList area */}
                    <TableContainer component={Paper} style={{ width: '100%', margin: 'auto' }}>
                        <Table id={'tableBody'} style={{width: '100%'}} component="div">
                            <TableHead component="div">
                                <TableRow component="div" style={{display: 'flex', width: '100%'}}>
                                    <TableCell component="div" style={{minWidth: '120px', flex: '0 0 120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>状態</TableCell> {/* Status */}
                                    <TableCell component="div" style={{minWidth: '120px', flex: '0 0 120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>アイコン</TableCell> {/* Icon */}
                                    <TableCell component="div" style={{minWidth: '120px', flex: 1, display: 'flex', alignItems: 'center'}}>絵文字パック名</TableCell> {/* Name */}
                                    <TableCell component="div" style={{flex: '0 0 100px', display: 'flex', alignItems: 'center'}}>バージョン</TableCell> {/* Version */}
                                    <TableCell component="div" style={{flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>詳細</TableCell> {/* Details */}
                                    <TableCell component="div" style={{flex: '0 0 100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>インストール</TableCell> {/* Install */}
                                </TableRow>
                            </TableHead>
                            {/* TableBody now effectively replaced by FixedSizeList */}
                            {/* The height for FixedSizeList needs to be explicitly set. */}
                            {/* Let's use a container for FixedSizeList to control its height */}
                            <div style={{ height: 'calc(100vh - 280px)', width: '100%'}}> {/* Adjusted height calculation */}
                                {this.state.isLoaded && filteredData.length > 0 ? (
                                    <FixedSizeList
                                        height={Math.max(0, window.innerHeight - 280)} // Ensure height is not negative
                                        itemCount={filteredData.length}
                                        itemSize={70} // Estimated row height
                                        width={'100%'}
                                        overscanCount={5} // Optional: render a few more items to reduce blank areas during scroll
                                    >
                                        {this.Row}
                                    </FixedSizeList>
                                ) : (
                                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}> {/* Centered message */}
                                        <Typography>
                                            {this.state.isLoaded ? '該当する絵文字パックはありません。' : ''}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </Table>
                    </TableContainer>
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

