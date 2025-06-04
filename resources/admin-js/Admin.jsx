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

        // 列幅の定義（ヘッダーとボディで同期）
        this.columnWidths = [
            120, // ステータス
            120, // アイコン
            250, // 絵文字パック名（拡大）
            120, // バージョン
            130, // インストール
            100, // 編集
            100  // 削除
        ];

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

        // 動的な高さ計算
        this.calculateListHeight = () => {
            const windowHeight = window.innerHeight;
            const appBarHeight = 64; // AppBarの高さ
            const searchFieldHeight = 80; // TextFieldとマージンの高さ
            const tableHeaderHeight = 56; // TableHeadの高さ
            const bottomMargin = 100; // 下部のボタンエリアとマージン
            const debugInfoHeight = 30; // デバッグ情報の高さ（開発時のみ）

            const availableHeight = windowHeight - appBarHeight - searchFieldHeight - bottomMargin - debugInfoHeight;
            return Math.max(300, availableHeight); // 最小300px
        };

        // 定数定義
        this.DEFAULT_CONTAINER_WIDTH = 800;
        this.TOTAL_COLUMN_WIDTH = this.columnWidths.reduce((sum, width) => sum + width, 0);

        // コンテナ幅を取得（キャッシュ対応）
        this.getContainerWidth = () => {
            const element = document.querySelector('#tableRoot');
            return element?.clientWidth || this.DEFAULT_CONTAINER_WIDTH;
        };

        // 動的な幅計算（PC・スマホ対応）
        this.calculateListWidth = () => {
            const containerWidth = this.getContainerWidth();
            // 横幅が十分な場合は横スクロールを除去、不足時のみ横スクロール
            return Math.max(this.TOTAL_COLUMN_WIDTH, containerWidth);
        };

        // 各列の動的幅計算
        this.calculateColumnWidth = (index) => {
            const containerWidth = this.getContainerWidth();

            if (containerWidth > this.TOTAL_COLUMN_WIDTH) {
                // 横幅が十分な場合は比例配分
                return (this.columnWidths[index] / this.TOTAL_COLUMN_WIDTH) * containerWidth;
            } else {
                // 横幅が不足な場合は固定幅
                return this.columnWidths[index];
            }
        };

        // 横スクロールの必要性を判定
        this.shouldShowHorizontalScroll = () => {
            const containerWidth = this.getContainerWidth();
            return containerWidth <= this.TOTAL_COLUMN_WIDTH;
        };

        // 仮想化行コンポーネント
        this.VirtualRow = ({ index, style }) => {
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

            const value = filteredData[index];
            if (!value) return null;

            // 元のデータ配列でのindexを取得
            const originalIndex = this.state.data.findIndex(item => item.emojiPackId === value.emojiPackId);

            const warningLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.warnings ?? {})?.length;
            const errorLength = Object.keys(this.state.emojiPackStatus?.[value?.emojiPackId]?.body?.errors ?? {})?.length;

            return (
                <div style={{
                    ...style,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                    width: '100%',
                    minWidth: this.calculateListWidth()
                }}>
                    {/* ステータス列 */}
                    <div style={{
                        width: this.calculateColumnWidth(0),
                        minWidth: this.columnWidths[0],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
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
                    </div>

                    {/* アイコン列 */}
                    <div style={{
                        width: this.calculateColumnWidth(1),
                        minWidth: this.columnWidths[1],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <img style={{width: '50px'}} src={value?.iconUrl} alt="emoji pack icon" />
                    </div>

                    {/* 絵文字パック名列 */}
                    <div style={{
                        width: this.calculateColumnWidth(2),
                        minWidth: this.columnWidths[2],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {value?.name}
                    </div>

                    {/* バージョン列 */}
                    <div style={{
                        width: this.calculateColumnWidth(3),
                        minWidth: this.columnWidths[3],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {value?.version}
                    </div>

                    {/* インストール列 */}
                    <div style={{
                        width: this.calculateColumnWidth(4),
                        minWidth: this.columnWidths[4],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Button
                            disabled={(this.state.emojiPackStatus?.[value?.emojiPackId]?.isStatusLoaded ?? false) ? (errorLength > 0) : false}
                            variant={'contained'}
                            color="primary"
                            onClick={() => {
                                window.open(this.props?.concurrentRedirectUrl+value?.sourceUrl, '_blank');
                            }}
                        >
                            <DownloadIcon />
                        </Button>
                    </div>

                    {/* 編集列 */}
                    <div style={{
                        width: this.calculateColumnWidth(5),
                        minWidth: '122px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {value.canEdit ? (
                            <Button variant={'contained'} color="primary" onClick={() => this.handleEmojiPackManageDialogOpen(true, originalIndex)}>
                                編集
                            </Button>
                        ) : (
                            <Button variant={'contained'} disabled>
                                編集不可
                            </Button>
                        )}
                    </div>

                    {/* 削除列 */}
                    <div style={{
                        width: this.calculateColumnWidth(6),
                        minWidth: this.columnWidths[6],
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {value.canEdit ? (
                            <Button variant={'contained'} color="primary" onClick={() => this.deleteEmojiPack(value.emojiPackId, value.name)} style={{backgroundColor: '#df0000'}}>
                                <DeleteForeverIcon />
                            </Button>
                        ) : (
                            <Button variant={'contained'} disabled>
                                <DeleteForeverIcon />
                            </Button>
                        )}
                    </div>
                </div>
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
                    alert('絵文字パックが正常に登録されました。');
                })
                .catch((error) => {
                    let responseData = error.response?.data;
                    if(responseData?.message === 'already_registered') {
                        alert('この絵文字パックは既に登録されています。');
                    } else if(responseData?.message === 'permission_denied') {
                        alert('この絵文字パックを編集する権限がありません。');
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
                })
                .catch((error) => {
                    let responseData = error.response?.data;
                    alert("絵文字パック一覧の取得に失敗しました。\n" + responseData?.message);
                    this.setState({isLoaded: true});
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
                        alert('更新が完了しました。');
                    })
                    .catch((error) => {
                        let responseData = error.response?.data;
                        if (responseData?.message === 'permission_denied') {
                            alert('この絵文字パックを編集する権限がありません。');
                        } else {
                            alert("更新に失敗しました。時間をおいてお試しください。\n" + responseData?.message);
                        }
                    })
                    .finally(() => {
                        this.getEmojiPackList();
                        this.setState({isLoaded: true});
                    });
            }
        }

        this.deleteEmojiPack = ((id, name) => {
            if (window.confirm('絵文字パック "' + name + '" を削除しますか？')) {
                this.setState({isLoaded: false});
                axios.delete(`/api/admin/emoji/${id}`)
                    .then(() => {
                        this.getEmojiPackList();
                    })
                    .catch((error) => {
                        let responseData = error.response?.data;
                        if (responseData?.message === 'permission_denied') {
                            alert('この絵文字パックを削除する権限がありません。');
                        } else {
                            alert("削除に失敗しました。時間をおいてお試しください。\n" + responseData?.message);
                        }
                    })
                    .finally(() => {
                        this.setState({isLoaded: true});
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

        // ウィンドウリサイズイベントリスナーを追加
        this.handleResize = () => {
            this.forceUpdate(); // 高さを再計算するために再レンダリング
        };
        window.addEventListener('resize', this.handleResize);

        // setTimeout(() => { // テスト用
        //     this.getEmojiPackList();
        // }, 8000);
        // setInterval(() => {
        //     this.getEmojiPackList();
        // }, 8000);
    }

    componentWillUnmount() {
        // イベントリスナーをクリーンアップ
        if (this.handleResize) {
            window.removeEventListener('resize', this.handleResize);
        }
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
                <TableContainer id={'tableRoot'} component={Paper} style={{position: 'relative', width: '80vw', margin: 'auto', marginTop: '60px'}}>
                    <TextField
                        label="絵文字パック名を検索"
                        variant="outlined"
                        style={{ margin: "20px", width: "calc(100% - 40px)" }}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />

                    {/* 仮想化ボディ */}
                    {this.state.isLoaded && filteredData.length > 0 && (
                        <FixedSizeList
                            height={this.calculateListHeight()}
                            itemCount={filteredData.length}
                            itemSize={72}
                            width="100%"
                            style={{
                                border: '1px solid rgba(224, 224, 224, 1)',
                                overflowX: this.shouldShowHorizontalScroll() ? 'auto' : 'hidden',
                                overflowY: 'auto'
                            }}
                        >
                            {this.VirtualRow}
                        </FixedSizeList>
                    )}

                    {/* データが0件の場合の表示 */}
                    {this.state.isLoaded && filteredData.length === 0 && (
                        <div style={{
                            height: this.calculateListHeight(),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(224, 224, 224, 1)',
                            backgroundColor: '#fafafa'
                        }}>
                            {this.state.searchTerm ? '検索条件に一致するデータがありません' : 'データがありません'}
                        </div>
                    )}

                    {/* デバッグ情報（一時的） */}
                    {/*{process.env.NODE_ENV === 'development' && (*/}
                    {/*    <div style={{padding: '10px', fontSize: '12px', color: '#666'}}>*/}
                    {/*        Debug: データ件数={this.state.data.length}, フィルター後={filteredData.length}, 読み込み状態={this.state.isLoaded ? '完了' : '読み込み中'}*/}
                    {/*    </div>*/}
                    {/*)}*/}
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

