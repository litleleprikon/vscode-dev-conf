// Type definitions for ping 0.2.2
// Project: [~THE PROJECT NAME~]
// Definitions by: Emil Sharifullin <iam@litleleprikon.me> https://litleleprikon.me

declare module 'ping' {
    export interface PingConfig {
        numeric?: boolean; // Map IP address to hostname or not
        timeout?: number; // Time duration, in seconds, for ping command to exit
        min_reply?: number; // Exit after sending number of ECHO_REQUEST
        v6?: boolean; // Ping via ipv6 or not. Default is false
        sourceAddr?: string; // Source address for sending the ping
        extra?: string[]; // Optional options does not provided
    }

    export namespace promise {

        export function probe(host: string, config?: PingConfig): Promise<PingResponse>;

        export interface PingResponse {
            host: string;  // The input IP address or HOST
            numeric_host: string;  // Target IP address
            alive: boolean;  // True for existed host
            output: string;  // Raw stdout from system ping
            time: number;  // Time (float) in ms for first successful ping response
            times: number[];  // Array of Time (float) in ms for each ping response
            min: string;  // Minimum time for collection records
            max: string;  // Maximum time for collection records
            avg: string;  // Average time for collection records
            stddev: string;  // Standard deviation time for collected records
        }
    }
}
