export enum STATUS {
    CANCELED="CANCELED",
    PENDING="PENDING",
    COMPLETED="COMPLETED"
}
export interface HasId {
    id?: number;
}
export interface HasCompId {
    compId: string;
}

export interface PromiseData<T extends HasId> {
    data?: T;
    error?: string;
}
export interface Note extends BasicEntity {
    items?: Item[];
}

export interface Item extends BasicEntity{
}

export interface BasicEntity extends HasId {
    name?: string;
    description?: string;
    updated?: string;
    created?: string;
    status?: STATUS;
}

export type booleanCallback = (value?: boolean) => void;

export interface BasicComponent {
    getId(): string;
    setVisible(visible: boolean, callback?: booleanCallback);
    getVisible(): boolean;
}

export interface HasNavigateBackProvider {
    navigateBack(currentCompId: string): void;
}

export interface StringMap<T> {
    [key: string]: T;
}