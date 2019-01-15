import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {NoteList} from "./components/NoteList";
import {NoteCreationForm} from "./components/NoteCreationForm";
import {BasicComponent, booleanCallback, Note, StringMap} from "./interfaces";
import {NoteDetails} from "./components/NoteDetails";
import {Navbar} from "./components/Navbar";

class App extends Component {
    private navRef: Navbar | undefined;
    private noteListRef: NoteList | undefined;
    private noteFormRef: NoteCreationForm | undefined;
    private noteDetailsRef: NoteDetails | undefined;

    // private componentMap: StringMap<BasicComponent> = {};
    private componentList: BasicComponent[] = [];

    private refHandler(ref: BasicComponent): void {
        this.componentList.push(ref);
    }

    private readonly NOTE_LIST: string = "app-note-list";
    private readonly NOTE_DETAILS: string = "app-note-details";
    private readonly NOTE_CREATE: string = "app-note-create";

    constructor(props: any) {
        super(props);

        this.refHandler = this.refHandler.bind(this);
        this.navTo = this.navTo.bind(this);
        this.openNote = this.openNote.bind(this);
    }

    render() {
        return (
            <div className="App">
                <Navbar
                    navs={[
                        {id: this.NOTE_LIST, caption: "Note List", handler: (id: string) => this.navTo(id)},
                        {id: this.NOTE_CREATE, caption: "Create Note", handler: (id: string) => this.navTo(id)},
                        {id: this.NOTE_DETAILS, caption: "Note Details", disabled: true, handler: (id: string) => this.navTo(id)},
                    ]}
                    ref={(ref: Navbar) => this.navRef = ref}
                />
                <NoteList
                    id={this.NOTE_LIST}
                    visible={true}
                    openNote={this.openNote}
                    ref = {(ref: NoteList) => { this.noteListRef = ref; this.refHandler(ref)}}
                />
                <NoteCreationForm
                    id={this.NOTE_CREATE}
                    visible={false}
                    onCreatedCallback={(note: Note) => {
                        this.noteListRef && this.noteListRef.refresh(note);
                    }}
                    ref={(ref: NoteCreationForm) => {this.noteFormRef = ref; this.refHandler(ref)}}
                />
                <NoteDetails
                    id={this.NOTE_DETAILS}
                    visible={false}
                    onCreatedCallback={() => {}}
                    ref={(ref: NoteDetails) => {this.noteDetailsRef = ref; this.refHandler(ref)}}
                />
            </div>
        );
    }

    navTo(compId: string): void {
        this.componentList.forEach((comp: BasicComponent) => {
            console.log("nav to: ", compId, comp.getId());
            comp.setVisible(comp.getId() === compId);
        });
        this.navRef && this.navRef.navTo(compId);
    }

    openNote(note: Note, callback: booleanCallback): void {
        console.log("open note: ", note)
        this.navTo(this.NOTE_DETAILS);

        this.noteDetailsRef && this.noteDetailsRef.show(note, (detailVisible: boolean | undefined) => {
            // this.noteFormRef && this.noteFormRef.setVisible(!detailVisible);
            // callback(detailVisible);

        });
    }
}

export default App;
