declare module 'react-quill' {
    import React from 'react';
    export interface ReactQuillProps {
        value?: string;
        defaultValue?: string;
        readOnly?: boolean;
        theme?: string;
        modules?: any;
        formats?: string[];
        children?: React.ReactNode;
        className?: string;
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
    }
    export default class ReactQuill extends React.Component<ReactQuillProps> { }
}
