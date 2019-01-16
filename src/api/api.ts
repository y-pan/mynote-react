import {ajaxDelete, ajaxGet, ajaxPost, ajaxPostTyped, slashJoin} from "../utils/Utils";
import {Note} from "../interfaces";
import {getApiRoot} from "../config/config";

const root: string = getApiRoot("local");

export function deleteItem(id: number): Promise<any> {
    return ajaxDelete(slashJoin(root, "items", id));
}
export function deleteNote(id: number): Promise<any> {
    return ajaxDelete(slashJoin(root, "notes", id));
}
export function getNotes(): Promise<Note[]> {
    return ajaxGet(slashJoin(root, "notes"));
}
export function getNote(noteId: number): Promise<Note> {
    return ajaxGet(slashJoin(root, "notes", noteId));
}
export function createNote(name?: string, description?: string): Promise<Note> {
    return ajaxPostTyped<Note>(slashJoin(root, "notes"), {name: name || "", description: description || ""});
}
export function createItem(noteId: number, name?: string, description?: string): Promise<Note> {
    let url: string = slashJoin(root, "items", "for-note", noteId);
    return ajaxPostTyped<Note>(url, {name: name || "", description: description || ""});
}


