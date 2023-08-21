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
import NewParticipantDialog from "./components/NewParticipantDialog";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CommentShow from "../admin-js/components/CommentShow";

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isParticipantDialogOpen: false,
            isNewParticipantDialogOpen: false,
            isCommentShowDialogOpen: [],
            isLoaded: false,
            editParticipant: {
                participantKind: null,
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
            newParticipant: {
                participantKind: null,
                name: '',
                characterName: '',
                lineName: '',
                twitterId: '',
                comment: '',
                entryFee: null,
                joinType: null,
                remarks: null,
            }
        }

        this.overlayWidth = '100%';

        this.title = this.props.siteTitle;

        const yenFormatter = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            currencyDisplay: 'name',
        });

        this.handleNewParticipantDialogOpen = (open) => {
            this.setState({isNewParticipantDialogOpen: open});
        }

        this.handleParticipantManageDialogOpen = (open, index) => {
            console.log('open: ', open);
            if(open === true) {
                let editParticipant = this.state.data[index];
                console.log('editParticipant:', editParticipant);
                this.setState({editParticipant: editParticipant});
            } else {
                let editParticipant = {
                    participantKind: null,
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
                this.setState({editParticipant: editParticipant});
            }
            this.setState({isParticipantDialogOpen: open});
        }

        this.handleCommentShowDialogOpen = (open, index) => {
                let isCommentShowDialogOpen = this.state.isCommentShowDialogOpen;
                isCommentShowDialogOpen[index] = open;
                this.setState({isCommentShowDialogOpen: isCommentShowDialogOpen});
        }

        this.newParticipantChangeValue = (e) => {
            let newParticipant = this.state.newParticipant;
            newParticipant[e.target.name] = e.target.value;
            this.setState({newParticipant: newParticipant});
        }

        this.participantChangeValue = (e) => {
            let participant = this.state.editParticipant;
            console.log(participant);
            participant[e.target.name] = e.target.value;
            console.log("parent participant:", participant);
            this.setState({editParticipant: participant});
        }

        this.setParticipant = (participant, index) => {
            let temp = this.state.data;
            temp[index] = participant;
            console.log("temp participant:", temp);
            this.setState({data: temp});
        }

        this.execRegister = () => {
            axios.post(`/api/admin/participant/add`, this.state.newParticipant)
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
                        <TableCell style={{minWidth: '120px'}}>
                            {value?.lineName}
                        </TableCell>
                        <TableCell>
                            <a href={"https://twitter.com/"+value?.twitterId} target="_blank">{value?.twitterId}</a>
                        </TableCell>
                        <TableCell>
                            {value?.characterName}
                        </TableCell>
                        <TableCell style={{minWidth: '120px'}}>
                            {value?.joinType}
                        </TableCell>
                        <TableCell>
                            <CommentShow handleOpen={(comment) => {this.handleCommentShowDialogOpen(comment, index)}} open={this.state.isCommentShowDialogOpen[index]} participant={value} />
                        </TableCell>
                        <TableCell style={{minWidth: '200px'}}>
                            {value?.remarks}
                        </TableCell>
                        <TableCell style={{minWidth: '85px'}}>
                            {yenFormatter.format(value?.entryFee)}
                        </TableCell>
                        <TableCell>
                            {
                                value.isPayed ?
                                    <p style={{color: 'green', fontSize: '20px', margin: 0}}>✓</p>
                                    : <Button variant="contained" color={'primary'} onClick={() => {
                                        this.setPayed(value.id);
                                    }}>未</Button>

                            }
                        </TableCell>
                        <TableCell>
                            <div style={{textAlign: 'center', margin: '20px'}}>
                                <Button variant={'contained'} color="primary" onClick={() => this.handleParticipantManageDialogOpen(true, index)}>
                                    編集
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div style={{textAlign: 'center', margin: '20px'}}>
                                <Button variant={'contained'} color="primary" onClick={() => this.deleteUser(value.id, value.name)} style={{backgroundColor: '#df0000'}}>
                                    <DeleteForeverIcon />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            });
        }

        this.getParticipantList = () => {
            axios.get(`/api/admin/participant`)
                .then((response) => {
                    this.setState({data: response.data.body});
                    this.setState({isLoaded: true});
                });
        }

        this.execUpdate = (id) => {
            if (window.confirm('更新してもよろしいですか？')) {
                this.setState({isLoaded: false});
                axios.post(`/api/admin/participant/${id}`, this.state.editParticipant)
                    .then(() => {
                        this.getParticipantList();
                    });
            }
        }

        this.setPayed = (id) => {
            if (window.confirm('支払済みにしますか？')) {
                this.setState({isLoaded: false});
                axios.post(`/api/admin/participant/set-payed/${id}`)
                    .then(() => {
                        this.getParticipantList();
                    });
            }
        }

        this.deleteUser = ((id, name) => {
            if (window.confirm(name + 'さんのデータを削除しますか？')) {
                this.setState({isLoaded: false});
                axios.delete(`/api/admin/participant/${id}`)
                    .then(() => {
                        this.getParticipantList();
                    });
            }
        });
    }

    componentDidMount() {
        // setTimeout(() => { // テスト用
        //     this.getParticipantList();
        // }, 8000);
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
                            {this.props.siteTitle}
                        </Typography>
                    </AppBar>
                </div>
                <TableContainer id={'tableRoot'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto', marginTop: '60px'}}>
                    <Table id={'tableBody'} style={{width: '100%', minHeight: '120px'}}>
                        <TableHead>
                            <TableRow >
                                <TableCell>参加者名</TableCell>
                                <TableCell>LINE名</TableCell>
                                <TableCell>Twitter ID</TableCell>
                                <TableCell>キャラクター名</TableCell>
                                <TableCell>参加種別</TableCell>
                                <TableCell>ひとこと</TableCell>
                                <TableCell>備考</TableCell>
                                <TableCell>参加費</TableCell>
                                <TableCell>支払状況</TableCell>
                                <TableCell>登録情報編集</TableCell>
                                <TableCell>削除</TableCell>
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
                    <NewParticipantDialog handleOpen={this.handleNewParticipantDialogOpen} open={this.state.isNewParticipantDialogOpen} handleChange={this.newParticipantChangeValue} newParticipant={this.state.newParticipant} execRegister={this.execRegister}/>
                </div>
                <div style={{textAlign: 'center', margin: '20px'}}>
                    <ParticipantManageDialog open={this.state.isParticipantDialogOpen} handleChange={this.participantChangeValue} participant={this.state.editParticipant} execUpdate={this.execUpdate} handleOpen={(open) => this.handleParticipantManageDialogOpen(open, null)} />
                </div>
            </>
        );
    }
}

export default Admin;

