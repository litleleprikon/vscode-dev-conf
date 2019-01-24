import * as path from 'path';
import { ObservableStorage } from './ObservableStorage';
import { promise as ping } from 'ping';
import {
    TreeItemCollapsibleState,
    Event,
    EventEmitter,
    ProviderResult,
    TreeDataProvider,
    TreeItem
} from 'vscode';

type PingTreeItem = ProbeTreeItem | ProbePingTreeItem;

export class PingTreeProvider implements TreeDataProvider<PingTreeItem> {
    private _onDidChangeTreeData: EventEmitter<PingTreeItem> = new EventEmitter<PingTreeItem>();
    // tslint:disable-next-line:member-access
    public readonly onDidChangeTreeData: Event<PingTreeItem> = this._onDidChangeTreeData.event;

    constructor(private readonly storage: ObservableStorage<ping.PingResponse>) {
        this.storage.AddObserver(() => { this.refresh(); });
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public getTreeItem(element: PingTreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    public getChildren(element?: PingTreeItem): ProviderResult<PingTreeItem[]> {
        const elements: PingTreeItem[] = [];
        if (!element) {
            let i = 0;
            for (const probe of this.storage) {
                elements.push(new ProbeTreeItem(i, probe.host, probe.alive));
                i++;
            }
        } else if (element instanceof ProbeTreeItem) {
            const probeResult = this.storage.get(element.index);
            elements.push(new ProbePingTreeItem(element.index, probeResult.time));
        }
        return elements;
    }
}

interface IIconPath {
    light: string;
    dark: string;
}

function getIconPaths(icon: string): IIconPath {
    return {
        light: path.join(__filename, `../../resources/light/${icon}.svg`),
        dark: path.join(__filename, `../../resources/dark/${icon}.svg`)
    };
}

export class ProbeTreeItem extends TreeItem {
    public label: string;

    constructor(
        public readonly index: number,
        public readonly host: string,
        public readonly success: boolean
    ) {
        super(`probe-${index}`, TreeItemCollapsibleState.Collapsed);

        this.label = host;
        const icon = success ? 'success' : 'error';
        this.iconPath = getIconPaths(icon);
    }
}

export class ProbePingTreeItem extends TreeItem {
    public label: string;

    constructor(
        index: number,
        public readonly ping: number
    ) {
        super(`probe-${index}/ping`, TreeItemCollapsibleState.None);
        this.label = `${ping} ms`;
    }

    public iconPath = getIconPaths('time');
}

// Add your TreeElement here
