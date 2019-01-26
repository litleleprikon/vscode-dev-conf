import { Disposable, TextDocumentContentProvider, EventEmitter, window, Uri } from 'vscode';
import { ObservableStorage } from './ObservableStorage';
import { promise as ping } from 'ping';

export default class PingContentProvider implements TextDocumentContentProvider, Disposable {

    public static scheme = 'ping';

    private _onDidChange = new EventEmitter<Uri>();
    private _editorDecoration = window.createTextEditorDecorationType({ textDecoration: 'underline' });

    constructor(private readonly storage: ObservableStorage<ping.PingResponse>) { }

    public dispose() {
        this._editorDecoration.dispose();
        this._onDidChange.dispose();
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    public provideTextDocumentContent(uri: Uri): string | Thenable<string> {

        const { index } = PingContentProvider.parseURI(uri);
        const probeResult = this.storage.get(index);

        return Object.keys(probeResult).map(key => `${key}: ${probeResult[key]}`).join('\n');
    }

    public static parseURI(uri: Uri): {
        host: string,
        index: number
    } {
        const queryString: string = uri.query;
        const tmp = {};
        queryString.split('&').map((item) => {
            const [key, value] = item.split('=').map(decodeURIComponent);
            tmp[key] = value;
            if (key === 'index') {
                tmp[key] = parseInt(value, 10);
            }
        });
        if (tmp['host'] === undefined || !(typeof tmp['host'] === 'string')
            || tmp['index'] === undefined || !(Number.isInteger(tmp['index']))) {
            throw new Error('URI, you passed is invalid');
        }
        return { host: tmp['host'], index: tmp['index'] };
    }

    public static createURI(index: number, host: string): Uri {
        const path = `~/${host}.ping-result`;
        const params = { index, host };
        const queryString = Object.keys(params).map((key) => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        }).join('&');
        return Uri.file(path).with({
            scheme: this.scheme,
            query: queryString
        });
    }
}
