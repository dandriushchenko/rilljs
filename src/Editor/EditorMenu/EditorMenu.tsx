import { useContext } from 'react';

import { ContextMenu, Menu, MenuItem, Divider } from '../Components';
import { type ModelActions, ModelActionsContext } from '../model';
import { type Theme, ThemeContext } from '../theme';
import { type EditorDialogs, EditorDialogsContext } from '../ref';
import { type ViewPrefs, ViewPrefsContext } from '../prefs';

export interface EditorMenuProps {
    target: HTMLElement | undefined | null;
}

export function EditorMenu(props: EditorMenuProps) {
    const {
        target
    } = props;


    const editorDialogs = useContext<EditorDialogs>(EditorDialogsContext);
    const theme = useContext<Theme>(ThemeContext).classes;
    const actions = useContext<ModelActions>(ModelActionsContext);
    const prefs = useContext<ViewPrefs>(ViewPrefsContext);
    const selectedNodes = actions.getSelectedNodes();
    const selected = selectedNodes.length;

    function onDelete() {
        actions.deleteNodes(selectedNodes.map(n => n.node.nodeID));
    }

    function onCreateNew() {
        editorDialogs.openCreateDialog();
    }

    return (
        <ContextMenu
            target={target}
            usePortal={prefs.usePortal.contextMenu}
        >
            <Menu
                className={theme.panel}
                style={{
                    padding: 0,
                    minWidth: 150
                }}
            >
                <MenuItem
                    icon="add"
                    text="Create Node"
                    onClick={onCreateNew}
                />
                {
                    selected > 0 &&
                    <>
                        <Divider />
                        <MenuItem
                            icon="cross"
                            onClick={onDelete}
                            text={`Delete ${selected > 1 ? `Selected (${selected})` : ''}`}
                        />
                    </>
                }
            </Menu>
        </ContextMenu>    
    );
}
