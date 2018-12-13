import { setUiSettingsValues } from '../modules/uiSettings/actions';

export default store => next => action => {
    const beforePathName = store.getState().router.location.pathname;

    const result = next(action);

    const afterPathName = store.getState().router.location.pathname;

    if (beforePathName !== afterPathName) {
        const match = afterPathName.match(/\/notes\/([\d\w]*)$/);
        if (match) {
            const noteId = match[1];
            store.dispatch(setUiSettingsValues({ lastUsedNote: noteId }));
        }
    }

    return result;
};
