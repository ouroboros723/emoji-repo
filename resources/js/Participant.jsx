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
import ParticipantManageDialog from "./components/ParticipantManageDialog";
import TwitterLogin from "./components/TwitterLogin";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import TwitterLogout from "./components/TwitterLogout";
import CommentShow from "./components/CommentShow";

class Participant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isParticipantDialogOpen: false,
            isTwitterLoginDialogOpen: false,
            isTwitterLogoutDialogOpen: false,
            isCommentShowDialogOpen: [],
            isMyCommentShowDialogOpen: false,
            isLoaded: false,
            editParticipant: {
                participantKind: null,
                name: '',
                characterName: '',
                lineName: '',
                twitterId: '',
                isPayed: null,
                comment: '',
                joinType: '',
            },
            newParticipant: {
                participantKind: null,
                name: '',
                characterName: '',
                lineName: '',
                twitterId: '',
                comment: '',
                joinType: '',
            },
            myParticipant: {
                participantKind: null,
                name: '',
                characterName: '',
                lineName: '',
                twitterId: '',
                comment: '',
                joinType: '',
            },
        }

        this.overlayWidth = '100%';

        this.handleTwitterLoginDialogOpen = (open) => {
            this.setState({isTwitterLoginDialogOpen: open});
        }

        this.handleTwitterLogoutDialogOpen = (open) => {
            this.setState({isTwitterLogoutDialogOpen: open});
        }

        this.handleCommentShowDialogOpen = (open, index = null) => {
            if(index !== null) {
                let isCommentShowDialogOpen = this.state.isCommentShowDialogOpen;
                isCommentShowDialogOpen[index] = open;
                this.setState({isCommentShowDialogOpen: isCommentShowDialogOpen});
            } else {
                this.setState({isMyCommentShowDialogOpen: open});
            }


        }

        this.handleParticipantManageDialogOpen = (open) => {
            // console.log('open: ', open);
            if(open === true) {
                let myParticipant = this.state.myParticipant;
                // console.log('myParticipant:', myParticipant);
                this.setState({editParticipant: myParticipant});
            }
            this.setState({isParticipantDialogOpen: open});
        }

        this.newParticipantChangeValue = (e) => {
            let newParticipant = this.state.newParticipant;
            newParticipant[e.target.name] = e.target.value;
            this.setState({newParticipant: newParticipant});
        }

        this.participantChangeValue = (e) => {
            let participant = this.state.editParticipant;
            // console.log(participant);
            participant[e.target.name] = e.target.value;
            // console.log("parent participant:", participant);
            this.setState({editParticipant: participant});
        }

        this.setParticipant = (participant, index) => {
            let temp = this.state.data;
            temp[index] = participant;
            // console.log("temp participant:", temp);
            this.setState({data: temp});
        }

        this.execRegister = () => {
            axios.post(`/api/${token}/participant/add`, this.state.newParticipant)
                .then(()=> {
                    this.getParticipantList();
                    const newParticipant =  {
                        participantKind: null,
                        name: '',
                        characterName: '',
                        lineName: '',
                        twitterId: '',
                    }
                    this.setState({newParticipant: newParticipant});
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
                            {value?.name}
                        </TableCell>
                        <TableCell style={{minWidth: '200px'}}>
                            {value?.joinType}
                        </TableCell>
                        <TableCell>
                            {value?.characterName}
                        </TableCell>
                        <TableCell style={{minWidth: '120px'}}>
                            {value?.lineName}
                        </TableCell>
                        <TableCell>
                            <a href={"https://twitter.com/"+value?.twitterId} target="_blank">{value?.twitterId}</a>
                        </TableCell>
                        <TableCell>
                            <CommentShow handleOpen={(comment) => {this.handleCommentShowDialogOpen(comment, index)}} open={this.state.isCommentShowDialogOpen[index]} participant={value} />
                        </TableCell>
                    </TableRow>
                );
            });
        }

        this.getParticipantList = () => {
            axios.get(`/api/${token}/participant`)
                .then((response) => {
                    this.setState({data: response.data.body});
                    this.setState({isLoaded: true});
                });
        }

        this.getMyParticipantData = () => {
            axios.get(`/api/${token}/participant/my-info`)
                .then((response) => {
                    // console.log(response);
                    this.setState({myParticipant: response.data.body});
                    this.setState({editParticipant: response.data.body});
                    this.setState({isLoaded: true});
                });
        }

        this.execUpdate = () => {
            if (window.confirm('更新してもよろしいですか？')) {
                this.setState({isLoaded: false});
                axios.post(`/api/${token}/participant/my-info`, this.state.editParticipant)
                    .then(() => {
                        this.getParticipantList();
                        this.getMyParticipantData();
                    });
            }
        }

        this.setPayed = (id) => {
            // if (window.confirm('支払済みにしますか？')) {
            //     this.setState({isLoaded: false});
            //     axios.post(`/api/${token}/participant/set-payed/${id}`)
            //         .then(() => {
            //             this.getParticipantList();
            //         });
            // }
        }

        this.deleteUser = ((id, name) => {
            // if (window.confirm(name + 'さんのデータを削除しますか？')) {
            //     this.setState({isLoaded: false});
            //     axios.delete(`/api/${token}/participant/${id}`)
            //         .then(() => {
            //             this.getParticipantList();
            //         });
            // }
        });
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);

        if(searchParams.get('status') === 'login-failed') {
            alert('一致するTwitterIDが見つかりませんでした');
        }
        if(searchParams.get('status') === 'logged-out') {
            alert('ログアウトしました');
        }

        setTimeout(() => { // テスト用
            this.getMyParticipantData();
        }, 8000);
        setInterval(() => {
            this.getParticipantList();
        }, 8000);
    }

    render() {
        this.overlayWidth = document.querySelector('#tableBody')?.scrollWidth ? document.querySelector('#tableBody')?.scrollWidth+'px' : '100%';
        return (
            <>
                <div style={{flexGrow: 1}}>
                    <AppBar position="fixed">
                        <Typography variant="h6" style={{padding: '10px'}}>
                            天竜浜名湖鉄道 参加者名簿
                        </Typography>
                    </AppBar>
                </div>
                <div>
                    <div style={{width: '80vw', margin: 'auto', marginTop: '60px'}}>
                        <Typography variant="h6" gutterBottom>
                            あなたの情報
                        </Typography>
                    </div>
                    <TableContainer id={'myInfoTable'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto'}}>
                        <Table id={'myInfoBody'} style={{width: '100%', minHeight: '120px'}}>
                            <TableHead>
                                <TableRow >
                                    <TableCell>参加者名</TableCell>
                                    <TableCell>参加種別</TableCell>
                                    <TableCell>キャラクター名</TableCell>
                                    <TableCell>LINE名</TableCell>
                                    <TableCell>Twitter ID</TableCell>
                                    <TableCell>ひとこと</TableCell>
                                    <TableCell>編集</TableCell>
                                </TableRow>
                            </TableHead>
                            {this.state.myParticipant?.twitterId ?
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{minWidth: '120px'}}>
                                            {this.state.myParticipant?.name}
                                        </TableCell>
                                        <TableCell style={{minWidth: '200px'}}>
                                            {this.state.myParticipant?.joinType}
                                        </TableCell>
                                        <TableCell>
                                            {this.state.myParticipant?.characterName}
                                        </TableCell>
                                        <TableCell style={{minWidth: '120px'}}>
                                            {this.state.myParticipant?.lineName}
                                        </TableCell>
                                        <TableCell>
                                            <a href={"https://twitter.com/"+this.state.myParticipant?.twitterId} target="_blank">{this.state.myParticipant?.twitterId}</a>
                                        </TableCell>
                                        <TableCell>
                                                <CommentShow handleOpen={this.handleCommentShowDialogOpen} open={this.state.isMyCommentShowDialogOpen} participant={this.state.myParticipant} />
                                        </TableCell>
                                        <TableCell>
                                            <Button  variant="contained" color='primary' onClick={()=>{
                                                this.setState({isParticipantDialogOpen: true});
                                            }}>編集</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody> :
                                <td colSpan="7">
                                    <div style={{textAlign: 'center', margin: '20px'}}>
                                        <TwitterLogin handleOpen={this.handleTwitterLoginDialogOpen} open={this.state.isTwitterLoginDialogOpen} />
                                    </div>
                                </td>
                            }
                        </Table>
                        {this.state.isLoaded ? null : <div id={'circularRoot'} style={{position: 'absolute', width: this.overlayWidth, height: '100%', textAlign: 'center', backgroundColor: 'rgb(127 127 127 / 51%)', 'bottom': '0'}}><CircularProgress style={{position: 'absolute', top: '38%', transform: 'translate(0, -50%)'}} />
                        </div>}
                    </TableContainer>
                    {this.state.myParticipant?.twitterId ?
                        <div style={{textAlign: 'center', margin: '20px'}}>
                            <TwitterLogout handleOpen={this.handleTwitterLogoutDialogOpen} open={this.state.isTwitterLogoutDialogOpen} />
                        </div> :
                        null
                    }

                    <div style={{width: '80vw', margin: 'auto', marginTop: '60px'}}>
                        <Typography variant="h6" gutterBottom>
                            メンバーの情報
                        </Typography>
                    </div>
                    <TableContainer id={'tableRoot'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto'}}>
                        <Table id={'tableBody'} style={{width: '100%', minHeight: '120px'}}>
                            <TableHead>
                                <TableRow >
                                    <TableCell>参加者名</TableCell>
                                    <TableCell>参加種別</TableCell>
                                    <TableCell>キャラクター名</TableCell>
                                    <TableCell>LINE名</TableCell>
                                    <TableCell>Twitter ID</TableCell>
                                    <TableCell>ひとこと</TableCell>
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
                        <ParticipantManageDialog open={this.state.isParticipantDialogOpen} handleChange={this.participantChangeValue} participant={this.state.editParticipant} execUpdate={this.execUpdate} handleOpen={(open) => this.handleParticipantManageDialogOpen(open, null)} />
                    </div>
                </div>
            </>
        );
    }
}

export default Participant;

