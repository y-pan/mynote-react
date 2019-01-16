import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {NoteList} from "./components/NoteList";
import {NoteCreationForm} from "./components/NoteCreationForm";
import {BasicComponent, HasId, Item, Note, PromiseData} from "./interfaces";
import {NoteDetails} from "./components/NoteDetails";
import {Navbar} from "./components/Navbar";
import {ItemCreationForm} from "./components/ItemCreationForm";

interface AppProps {

}
interface AppState {
    errorMessage: string;
}

class App extends Component<AppProps, AppState> {
    private navRef: Navbar | undefined;
    private noteListRef: NoteList | undefined;
    private noteCreateFormRef: NoteCreationForm | undefined;
    private itemCreateFormRef: ItemCreationForm | undefined;
    private noteDetailsRef: NoteDetails | undefined;
    private componentList: BasicComponent[] = [];

    private refHandler(ref: BasicComponent): void {
        this.componentList.push(ref);
    }

    private readonly NOTE_LIST: string = "app-note-list";
    private readonly NOTE_DETAILS: string = "app-note-details";
    private readonly NOTE_CREATE: string = "app-note-create";
    private readonly ITEM_CREATE: string = "app-item-create";

    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: ""
        };

        this.refHandler = this.refHandler.bind(this);
        this.navTo = this.navTo.bind(this);
        this.showError = this.showError.bind(this);
    }

    render() {
        return (
            <div className="App">
                <Navbar
                    navs={[
                        {compId: this.NOTE_LIST, caption: "Note List", handler: (id: string) => this.navTo(id)},
                        {compId: this.NOTE_CREATE, caption: "Create Note", handler: (id: string) => this.navTo(id)},
                        {compId: this.NOTE_DETAILS, caption: "Note Details", disabled: true, handler: (id: string) => this.navTo(id)},
                        {compId: this.ITEM_CREATE, caption: "Create Item", disabled: true, handler: (id: string) => this.navTo(id)},

                    ]}
                    ref={(ref: Navbar) => this.navRef = ref}
                />
                <NoteList
                    compId={this.NOTE_LIST}
                    visible={true}
                    openNoteDetails={(note: Note) => {
                        this.noteDetailsRef && this.noteDetailsRef.update(note)
                            .then(() =>this.navTo(this.NOTE_DETAILS))
                            .catch(this.showError);
                    }}
                    ref = {(ref: NoteList) => { this.noteListRef = ref; this.refHandler(ref)}}
                />
                <NoteCreationForm
                    compId={this.NOTE_CREATE}
                    visible={false}
                    onCreatedCallback={(note: Note) => {
                        let updateListProm = this.noteListRef? this.noteListRef.updateOnCreated(note) : Promise.reject({error: "update list failed"});
                        let updateDetailProm = this.noteDetailsRef? this.noteDetailsRef.update(note) : Promise.reject({error: "update note detail failed"})
                        Promise.all(
                            [
                                updateListProm, updateDetailProm
                            ]
                        ).then(() => this.navTo(this.NOTE_DETAILS))
                        .catch(this.showError);
                    }}
                    ref={(ref: NoteCreationForm) => {this.noteCreateFormRef = ref; this.refHandler(ref);}}
                />

                <ItemCreationForm
                    compId={this.ITEM_CREATE}
                    visible={false}
                    onCreatedCallback={(item: Item) => {
                        this.noteDetailsRef && this.noteDetailsRef.updateOnItemAdded(item, false)
                            .then(() => this.navTo(this.NOTE_DETAILS))
                            .catch(this.showError);
                    }}
                    ref={(ref: ItemCreationForm) => {this.itemCreateFormRef = ref; this.refHandler(ref);}}
                />

                <NoteDetails
                    compId={this.NOTE_DETAILS}
                    visible={false}
                    openCreateItem={(note: Note) => {
                        this.itemCreateFormRef && this.itemCreateFormRef.update(note)
                            .then(() => this.navTo(this.ITEM_CREATE))
                            .catch(this.showError);
                    }}
                    ref={(ref: NoteDetails) => {this.noteDetailsRef = ref; this.refHandler(ref)}}
                />
                <div style={{color: "red"}}>{this.state.errorMessage}</div>
            </div>
        );
    }

    showError(promiseData: PromiseData<HasId>): void {
        this.setState({errorMessage: promiseData.error || ""});
    }

    navTo(compId: string): void {
        this.componentList.forEach((comp: BasicComponent) => {
            comp.setVisible(comp.getId() === compId);
        });
        this.navRef && this.navRef.setSelected(compId);
    }



}

export default App;
