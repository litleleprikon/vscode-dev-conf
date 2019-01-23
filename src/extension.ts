import * as vscode from 'vscode';
import { promise as ping } from 'ping';

export function activate(context: vscode.ExtensionContext) {
    const commandId = 'ping.ping';

    // registerCommand tells VSCode to use this callback for certain command
    // and creates disposable.
    const registeredCommand = vscode.commands.registerCommand(commandId, async () => {
        // This handler running any time command is called.
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

    // Creating status bar item and adding it to status bar.
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = commandId;
    // $(network) will be substituted with font-awesome icon
    statusBarItem.text = '$(network) Ping';

    statusBarItem.show();
    // Telling VSCode to use this disposables to release resources
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(registeredCommand);
}

export async function showInputBox(): Promise<string> {
    return vscode.window.showInputBox({ placeHolder: 'Specify the host' });
}

export function deactivate() { }
