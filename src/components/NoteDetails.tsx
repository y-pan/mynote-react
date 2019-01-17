import React from 'react';
import {BasicComponent, booleanCallback, HasCompId, Item, Note, PromiseData} from "../interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import ReactTable, {CellInfo} from "react-table";
import {deleteItem, deleteNote, getNote} from "../api/api";
import {deleteById} from "../utils/Utils";

interface NoteDetailsProps extends HasCompId {
    note?: Note;
    visible: boolean;

    openCreateItem(note: Note): void;
}

interface NoteDetailsState {
    visible: boolean;
    note?: Note;
}

export class NoteDetails extends React.Component<NoteDetailsProps, NoteDetailsState> implements BasicComponent {

    constructor(props: NoteDetailsProps) {
        super(props);
        this.state = {
            visible: this.props.visible,
            note: this.props.note
        };

        this.update = this.update.bind(this);
        this.updateOnItemAdded = this.updateOnItemAdded.bind(this);
        this.renderNoteInfo = this.renderNoteInfo.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
    }

    render() {
        if (!this.state.note || this.state.note.id === undefined) {
            return <span></span>;
        }

        let table: JSX.Element = <ReactTable
            data={(this.state.note && this.state.note.items) || []}
            columns={[
                {
                    Header: "Name",
                    id: "name",
                    accessor: (d: Item) => d.name,
                    Cell: (row: CellInfo) => (
                        <div>
                            <span
                                style={{cursor: "pointer", fontWeight: "bold"}}
                            >
                                {row.original.name}
                            </span>
                        </div>
                    )
                },
                {
                    Header: "Description",
                    id: "description",
                    accessor: (d: Item) => d.description
                },
                // {
                //     Header: "Status",
                //     id: "status",
                //     accessor: (d: Item) => d.status
                // },
                {
                    Header: "Action",
                    id: "action",
                    Cell: (row: CellInfo) => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onDeleteItem(row.original)}
                            >
                                <FontAwesomeIcon icon={faTrash}/>
                            </span>
                        </div>
                    )
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
        />;

        return (
            <div id={"note-detail"} style={{display: this.state.visible ? "block" : "none"}}>
                {this.renderNoteInfo(this.state.note)}
                {table}
            </div>
        );
    }

    updateOnItemAdded(item: Item, hardRefresh?: boolean): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!item || !this.state.note || !this.state.note.id) {
                return reject({error: "Incorrect state occurred."});
            }

            if (hardRefresh) {
                return this.loadData();
            } else {
                let note: Note = this.state.note;
                if (!note.items) {
                    note.items = [];
                }
                note.items.push(item);
                this.setState({note: note}, () => {
                    return resolve({data: note});
                });
            }
        });
    }

    updateOnItemDeleted(deletedId: number | undefined, reload?: boolean): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!deletedId || !this.state.note) {
                return reject({error: "Bad data"});
            }
            if (reload) {
                return this.loadData();
            } else {
                let note: Note = {...this.state.note};
                let latestItems: Item[] = deleteById(note.items, deletedId) as Item[];
                note.items = latestItems;
                this.setState({note: note}, () => {
                    return resolve({data: note});
                });
            }
        });
    }

    update(note: Note | undefined): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!note) {
                return reject("Bad data.");
            }
            return this.setState({note: note}, () => {
                return resolve({data: note});
            });
        });
    }

    getId(): string {
        return this.props.compId;
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

    setVisible(visible: boolean, callback: booleanCallback) {
        this.setState({visible: visible}, () => {
            callback && callback(this.state.visible);
        });
    }

    private renderNoteInfo(note?: Note): JSX.Element {

        let info: JSX.Element = (
            <div className="row">
                <div className="col-sm-4">
                    <input type="text" readOnly className="form-control" id="info-name"
                           value={note && note.name || ""}/>
                </div>
                <div className="col-sm-6">
                        <textarea readOnly className="form-control" id="info-description"
                                  value={note && note.description || ""} rows={1}/>
                </div>
                <div className="col-sm-2">
                    <input
                        style={{fontSize: "1em"}}
                        className={"form-control btn btn-success"}
                        type={"button"}
                        value={"Add"}
                        onClick={() => this.state.note && this.props.openCreateItem(this.state.note)}
                    />
                </div>
            </div>
        );

        return info;
    }

    private onDeleteItem(item: Item, reload?: boolean): void {
        if (!item || !item.id) {
            console.error("Invalid item");
            return;
        }

        if (confirm("Delete item: " + item.name + " ?")) {
            deleteItem(item.id as number).then((itemIdDeleted: number) => {
                this.updateOnItemDeleted(itemIdDeleted, false);
            });
        }
    }

    private loadData(): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!this.state.note || this.state.note.id === undefined) {
                return reject({error: "Bad data state"});
            }
            return getNote(this.state.note.id).then((note: Note) => {
                this.setState({note: note}, () => {
                    return resolve({data: note});
                })
            })
        });

    }
}
    
