import * as vscode from 'vscode';
import { promise as ping } from 'ping';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('ping.ping', async () => {
        const host = await vscode.window.showInputBox({ placeHolder: 'Specify the host' });
        const probeResult = await ping.probe(host);
        if (probeResult.alive) {
            const message = `Host ${host} with ip ${probeResult.numeric_host} is alive! Ping: ${probeResult.time}`;
            vscode.window.showInformationMessage(message);
        } else {
            const message = `Host ${host} with ip ${probeResult.numeric_host} is down!`;
            vscode.window.showErrorMessage(message);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
