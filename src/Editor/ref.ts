import React from 'react';

import { type ModelActions } from './model';
import { type Coords } from '../model';

export interface EditorDialogs {
    openCreateDialog: (coords?: Coords) => void;
    openSnippetDialog: () => void;
}

// @ts-ignore
export const EditorDialogsContext = React.createContext<EditorDialogs>({});

export interface RillEditorRef {
    ref: React.RefObject<HTMLDivElement>;
    actions: ModelActions;
    dialogs: EditorDialogs;
}
