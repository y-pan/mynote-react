import React from 'react';

export interface DateCompProps {
    date: string;
}

export const DateComp = (props: DateCompProps) => {
    let date: Date = new Date(props.date);
    if (date instanceof Date) {
        return <span>{date.toLocaleDateString("us")}</span>;
    } else {
        return <span>{props.date}</span>
    }
};