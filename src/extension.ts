import * as vscode from 'vscode';
import { promise as ping } from 'ping';
import { ObservableStorage } from './ObservableStorage';
import { Pinger } from './Pinger';
import { UIController } from './UIController';
import { PingTreeProvider } from './PingTreeProvider';

export function activate(context: vscode.ExtensionContext) {

    const commandId = 'ping.ping';

    // Initializing stuff
    const storage = new ObservableStorage<ping.PingResponse>();
    const pinger = new Pinger(storage);
    const uiController = new UIController(pinger);
    const treeProvider = new PingTreeProvider(storage);

    // registerCommand tells VSCode to use this callback for certain command
    // and creates disposable.
    const registeredCommand = vscode.commands.registerCommand(commandId, async () => {
        // This handler running any time command is called.
        await uiController.processPingCommand();
    });

    // registering TreeProvider with name pings.
    // We need to declare tree providers in package.json.
    // VSCode will search for providers with names declared in package.json.
    const registeredTree = vscode.window.registerTreeDataProvider('pings', treeProvider);

    // Creating status bar item and adding it to status bar.
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = commandId;
    // $(network) will be substituted with font-awesome icon
    statusBarItem.text = '$(network) Ping';

    statusBarItem.show();
    // Telling VSCode to use this disposables to release resources
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(registeredCommand);
    context.subscriptions.push(registeredTree);
}

export function deactivate() { }
