import { push } from 'connected-react-router';

export default async function initElectron(store) {
    // Настройки
    window.ipcRenderer.on('open:settings', event => {
        store.dispatch(push('/settings'));
    });
}
