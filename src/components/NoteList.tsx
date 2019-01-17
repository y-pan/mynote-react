import React from 'react';
import ReactTable, {CellInfo} from "react-table";
import "react-table/react-table.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLink, faTrash, faList} from '@fortawesome/free-solid-svg-icons'
import {deleteNote, getNote, getNotes} from "../api/api";
import {BasicComponent, booleanCallback, HasCompId, Note, PromiseData} from "../interfaces";
import {DateComp} from "./DateComp";
import {deleteById} from "../utils/Utils";
import {DateTimeComp} from "./DateTimeComp";

interface NoteListProps extends HasCompId {
    visible: boolean;
    openNoteDetails(note: Note): void;
}

interface NoteListState {
    notes: Note[];
    visible?: boolean;
}

export class NoteList extends React.Component<NoteListProps, NoteListState> implements BasicComponent {

    constructor(props: NoteListProps) {
        super(props);
        this.state = {
            notes: [],
            visible: this.props.visible
        };

        this.loadData = this.loadData.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onOpenNoteDetails = this.onOpenNoteDetails.bind(this);
        this.setVisible = this.setVisible.bind(this);
    }

    setVisible(visible: boolean, callback: booleanCallback): void {
        this.setState({visible: visible}, () => {
            callback && callback(this.state.visible);
        });
    }

    componentWillMount(): void {
        this.loadData();
    }

    updateOnCreated(newNote: Note, reload?: boolean): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!newNote) {
                return reject({error: "Bad data."});
            }

            if (reload) {
                return this.loadData();
            } else {
                let notes: Note[] = [...this.state.notes];
                notes.push(newNote);
                this.setState({notes: notes}, () => {
                    resolve({data: newNote});
                });
            }
        });

    }

    updateOnDeleted(deletedId: number | undefined, reload?: boolean): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            if (!deletedId) {
                return reject({error: "Id is required."});
            }

            if (reload) {
                return this.loadData();
            } else {
                let notes: Note[] = deleteById(this.state.notes, deletedId) as Note[];
                this.setState({notes: notes}, () => {
                    return resolve({data: undefined});
                });
            }
        });
    }

    render() {
        let table: JSX.Element = <ReactTable
            data={this.state.notes}
            columns={[
                {
                    Header: () => <span><FontAwesomeIcon icon={faList} style={{marginRight: 5}}/> Name</span>,
                    id: "name",
                    accessor: d => d.name,
                    Cell: row => (
                        <div>
                            <span
                                style={{cursor: "pointer", fontWeight: "bold", marginLeft: 10}}
                                onClick={() => this.onOpenNoteDetails(row.original.id)}
                            >
                                {row.original.name}
                            </span>
                        </div>
                    )
                },
                {
                    Header: "Description",
                    id: "description",
                    accessor: d => d.description
                },
                // {
                //     Header: "Status",
                //     id: "status",
                //     accessor: d => d.status,
                // },
                // {
                //     Header: "Created",
                //     id: "created",
                //     // accessor: d => d.created,
                //     Cell: (row: CellInfo) => {
                //         return <DateComp date={row.original.created}/>;
                //     }
                // },
                {
                    Header: "Updated",
                    id: "updated",
                    // accessor: d => d.updated
                    Cell: (row: CellInfo) => {
                        return <DateTimeComp date={row.original.updated}/>;
                    }
                },
                {
                    Header: "Action",
                    id: "action",
                    Cell: row => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onDelete(row.original)}
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
            <div id={"note-list"} style={{display: this.state.visible ? "block" : "none"}}>
                {table}
            </div>
        );
    }

    getId(): string {
        return this.props.compId;
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

    private loadData(): Promise<PromiseData<Note>> {
        return new Promise((resolve, reject) => {
            return getNotes().then((notes: Note[]) => {
                this.setState({notes: notes}, () => {
                    return resolve();
                })
            });
        });
    }

    private onOpenNoteDetails(noteId: number): void {
        getNote(noteId).then((note: Note) => {
            this.props.openNoteDetails(note)
        })
    }

    private onDelete(note: Note): void {
        if (!note || !note.id) {
            alert("Invalid data");
            return;
        }
        if (confirm("Delete note: " + note.name + " ?")) {
            deleteNote(note.id as number).then(() => {
                this.updateOnDeleted(note.id, false);
            });
        }
    }

}