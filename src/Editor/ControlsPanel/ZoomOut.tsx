import React, { useContext } from 'react';
import { Button } from '../Components';
import { type ModelActions, ModelActionsContext } from '../model';

export const ZoomOut = React.memo(() => {
    const actions = useContext<ModelActions>(ModelActionsContext);

    function onClick() {
        actions.zoom(
            actions.getZoom() - 0.1
        );
    }
    return (
        <Button
            icon="zoom-out"
            onClick={onClick}
            title="Zoom Out"
        />
    );
});
