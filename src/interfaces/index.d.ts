export enum STATUS {
    CANCELED="CANCELED",
    PENDING="PENDING",
    COMPLETED="COMPLETED"
}

export interface Note extends BasicEntity {
    items?: Item[];
}

export interface Item extends BasicEntity{
}

export interface BasicEntity {
    id?: number;
    name: string;
    description?: string;
    updated?: Date;
    created?: Date;
    status?: STATUS;
}