import { ObservableStorage } from './ObservableStorage';
import { promise as ping } from 'ping';
export class Pinger {
    constructor(private readonly storage: ObservableStorage<ping.PingResponse>) { }

    /**
     * ping sends ping to certain host and adds result to observable storage.
     */
    public async ping(host: string): Promise<ping.PingResponse> {
        const probeResult = await ping.probe(host);
        this.storage.push(probeResult);
        return probeResult;
    }
}
