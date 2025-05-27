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
import EmojiPackManageDialog from "./components/EmojiPackManageDialog";
import NewEmojiPackDialog from "./components/NewEmojiPackDialog";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CommentShow from "../admin-js/components/CommentShow";
import DownloadIcon from '@mui/icons-material/Download';
import DangerousIcon from "@mui/icons-material/Dangerous";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

class Admin extends Component {
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
                emojiPackId: null,
                iconUrl: '',
                name: '',
                version: '',
                description: '',
                credit: '',
                createdAt: '',
                updatedAt: '',
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
                    emojiPackId: null,
                    iconUrl: '',
                    name: '',
                    version: '',
                    description: '',
                    credit: '',
                    createdAt: '',
                    updatedAt: '',
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

        this.emojiPackChangeValue = (e) => {
            let emojiPack = this.state.editEmojiPack;
            ;
            emojiPack[e.target.name] = e.target.value;
            ;
            this.setState({editEmojiPack: emojiPack});
        }

        this.setEmojiPack = (emojiPack, index) => {
            let temp = this.state.data;
            temp[index] = emojiPack;
            ;
            this.setState({data: temp});
        }

        this.handleSearchChange = (event) => {
            this.setState({ searchTerm: event.target.value });
        };

        this.Row = ({ index, style }) => {
            const filteredData = this.state.data.filter(item => {
                if (this.state.searchTerm === "") return true;
                const searchTermLower = this.state.searchTerm.toLowerCase();
                return (
                    item.name?.toLowerCase().includes(searchTermLower) ||
                    item.characterName?.toLowerCase().includes(searchTermLower) || // Assuming these might exist based on EmojiRepo
                    item.lineName?.toLowerCase().includes(searchTermLower) || // Assuming these might exist
                    item.comment?.toLowerCase().includes(searchTermLower) // Assuming these might exist
                );
            });

            const value = filteredData[index];
            if (!value) return null;

            const warningLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.warnings ?? {})?.length;
            const errorLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.errors ?? {})?.length;
            const originalIndex = this.state.data.findIndex(originalItem => originalItem.emojiPackId === value.emojiPackId);

            return (
                <TableRow key={value.emojiPackId} style={style}>
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
                                : <CircularProgress size={24}/>
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
                        <Button disabled={(this.state.emojiPackStatus?.[value?.emojiPackId]?.isStatusLoaded ?? false) ? (errorLength > 0) : false} variant={'contained'} color="primary" onClick={() => {
                            window.open(this.props?.concurrentRedirectUrl+value?.sourceUrl, '_blank');
                        }}>
                            <DownloadIcon />
                        </Button>
                    </TableCell>
                    <TableCell>
                        <div style={{textAlign: 'center'}}>
                            <Button variant={'contained'} color="primary" onClick={() => this.handleEmojiPackManageDialogOpen(true, originalIndex)}>
                                編集
                            </Button>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div style={{textAlign: 'center'}}>
                            <Button variant={'contained'} color="primary" onClick={() => this.deleteEmojiPack(value.emojiPackId, value.name)} style={{backgroundColor: '#df0000'}}>
                                <DeleteForeverIcon />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            );
        };

        this.execRegister = () => {
            axios.post(`/api/admin/emoji/add`, this.state.newEmojiPack)
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

        this.getEmojiPackList = () => {
            axios.get(`/api/admin/emoji`)
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
                axios.get("/api/admin/emoji/"+emojiPackId)
                    .then((response) => {
                        this.setState({emojis: response.data.body?.emojis ?? []});
                    });
            }
        }

        this.execUpdate = (id) => {
            if (window.confirm('更新してもよろしいですか？')) {
                this.setState({isLoaded: false});
                axios.post(`/api/admin/emoji/${id}`, this.state.editEmojiPack)
                    .then(() => {

                    })
                    .catch((error) => {
                        let responseData = error.response.data;
                        alert("登録に失敗しました。時間をおいてお試しください。\n" + responseData?.message);
                    })
                    .finally(() => {
                        this.getEmojiPackList();
                    });
            }
        }

        this.deleteEmojiPack = ((id, name) => {
            if (window.confirm('絵文字パック "' + name + '" を削除しますか？')) {
                this.setState({isLoaded: false});
                axios.delete(`/api/admin/emoji/${id}`)
                    .then(() => {
                        this.getEmojiPackList();
                    });
            }
        });

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

        return (
            <>
                <div style={{flexGrow: 1}}>
                    <AppBar position="fixed">
                        <Typography variant="h6" style={{padding: '10px'}}>
                            {this.props.siteTitle}
                        </Typography>
                        <Typography variant="h6" style={{
                            padding: '10px',
                            position: 'absolute',
                            right: 0,
                            top: '-4px'
                        }}>
                        <a className="dropdown-item" href="/admin/logout" style={{color: '#fff'}}
                           onClick={() => {
                               event.preventDefault();
                               document.getElementById('logout-form').submit()
                           }}>
                            ログアウト
                        </a>
                        </Typography>
                    </AppBar>
                </div>
                <TableContainer id={'tableRoot'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto', marginTop: '60px', overflow: 'hidden'}}>
                    <TextField
                        label="絵文字パック名を検索"
                        variant="outlined"
                        style={{ margin: "20px", width: "calc(100% - 40px)" }}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />
                    <Table style={{width: '100%', tableLayout: 'fixed'}}>
                        <TableHead>
                            <TableRow >
                                <TableCell style={{width: '5%'}}></TableCell>
                                <TableCell style={{width: '10%'}}></TableCell>
                                <TableCell style={{width: '30%'}}>絵文字パック名</TableCell>
                                <TableCell style={{width: '10%'}}>バージョン</TableCell>
                                <TableCell style={{width: '15%'}}>インストール</TableCell>
                                <TableCell style={{width: '15%'}}>編集</TableCell>
                                <TableCell style={{width: '15%'}}>削除</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                    {this.state.isLoaded && (
                        <FixedSizeList
                            height={400}
                            itemCount={filteredData.length}
                            itemSize={75} // Adjust as needed
                            width={'100%'}
                        >
                            {this.Row}
                        </FixedSizeList>
                    )}
                    {!this.state.isLoaded && <div id={'circularRoot'} style={{
                        position: 'absolute',
                        width: '100%',
                        height: 'calc(100% - 150px)', // Adjust based on TextField and TableHead height
                        top: '150px', // Adjust based on TextField and TableHead height
                        textAlign: 'center',
                        backgroundColor: 'rgb(127 127 127 / 51%)',
                        zIndex: 2
                    }}><CircularProgress style={{position: 'absolute', top: '38%', transform: 'translate(-50%, -50%)', left: '50%'}} />
                    </div>}
                </TableContainer>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <NewEmojiPackDialog handleOpen={this.handleNewEmojiPackDialogOpen} open={this.state.isNewEmojiPackDialogOpen} handleChange={this.newEmojiPackChangeValue} newEmojiPack={this.state.newEmojiPack} execRegister={this.execRegister}/>
                </div>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <EmojiPackManageDialog open={this.state.isEmojiPackDialogOpen} handleChange={this.emojiPackChangeValue} emojiPack={this.state.editEmojiPack} emojis={this.state.emojis} execUpdate={this.execUpdate} handleOpen={(open) => this.handleEmojiPackManageDialogOpen(open, null)} concurrentRedirectUrl={this.props?.concurrentRedirectUrl} emojiPackStatus={this.state.emojiPackStatus} />
                </div>
            </>
        );
    }
}

export default Admin;

