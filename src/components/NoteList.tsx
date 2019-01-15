import React from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faLink} from '@fortawesome/free-solid-svg-icons'
import {deleteNote, getNote, getNotes} from "../api/api";
import {BasicComponent, booleanCallback, Note} from "../interfaces";

interface NoteListProps {
    id: string;
    openNote(note: Note, noteOpenedCallback: booleanCallback): void;
    visible: boolean;
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

    refresh(newNote: Note, hardRefresh?: boolean): void {
        // this.loadData();
        if (!newNote) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            notes.push(newNote);
            this.setState({notes: notes});
        }
    }

    refreshByAdd(newNote: Note, hardRefresh?: boolean): void {
        // this.loadData();
        if (!newNote) {
            return;
        }
        if (hardRefresh) {
            this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            notes.push(newNote)
            this.setState({notes: notes});
        }
    }

    refreshByDelete(deletedId: number | undefined, hardRefresh?: boolean): void {
        // this.loadData();
        if (!deletedId) {
            return;
        }
        if (hardRefresh) {
            return this.loadData();
        } else {
            let notes: Note[] = [...this.state.notes];
            let indexToDelete: number = -1;
            notes.forEach((note: Note, index: number) => {
                if (note.id === deletedId) {
                    indexToDelete = index;
                    return;
                }
            });
            if (indexToDelete !== -1) {
                notes.splice(indexToDelete, 1);
                this.setState({notes: notes});
            }
        }
    }

    private loadData(): void {
        getNotes()
            .then((notes: Note[]) => {
                this.setState({notes: notes})
            })
            .catch((err: any) => console.info(err));
    }

    private onOpenNoteDetails(noteId: number): void {
        getNote(noteId).then((note: Note) => {
            this.props.openNote(note, (otherVisible: boolean | undefined) => {
                this.setState({visible: !otherVisible});
            })
        })
    }

    render() {
        let table: JSX.Element = <ReactTable
            data={this.state.notes}
            columns={[
                {
                    Header: "Name",
                    id: "name",
                    accessor: d => d.name,
                    Cell: row => (
                        <div>
                            <span
                                style={{color: "red", cursor: "pointer", padding: 5}}
                                onClick={() => this.onOpenNoteDetails(row.original.id)}
                            >
                                {row.original.name}
                                <FontAwesomeIcon icon={faLink} />
                            </span>
                        </div>
                    )
                },
                {
                    Header: "Description",
                    id: "description",
                    accessor: d => d.description
                },
                {
                    Header: "Status",
                    id: "status",
                    accessor: d => d.status
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
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </div>
                    )
                }
            ]}
            defaultPageSize={5}
            className="-striped -highlight"
        />;

        return (
            <div id={"note-list"} style={{display: this.state.visible? "block" : "none"}}>
                {table}
            </div>
        );
    }

    private onDelete(note: Note): void {
        if (!note || !note.id) {
            alert("Invalid data");
            return;
        }
        if (confirm("Delete note: " + note.name + " ?")) {
            deleteNote(note.id as number).then(() => {
                this.refreshByDelete(note.id, false);
            });
        }
    }

    getId(): string {
        return this.props.id;
    }

    getVisible(): boolean {
        return this.state.visible || false;
    }

}