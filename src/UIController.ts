import { Pinger } from './Pinger';
import * as vscode from 'vscode';

export class UIController {
    constructor(private readonly pinger: Pinger) { }

    /**
     * processPingCommand process the ping command. Shows
     */
    public async processPingCommand() {
        const host = await vscode.window.showInputBox({ placeHolder: 'Specify the host' });
        const probeResult = await this.pinger.ping(host);

        if (probeResult.alive) {
            const message = `Host ${host} with ip ${probeResult.numeric_host} is alive! Ping: ${probeResult.time}`;
            vscode.window.showInformationMessage(message);
        } else {
            const message = `Host ${host} with ip ${probeResult.numeric_host} is down!`;
            vscode.window.showErrorMessage(message);
        }

    }
}
