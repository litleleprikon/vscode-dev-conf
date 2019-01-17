declare module 'remap-istanbul' {
    const ri: RemapIstanbul;
    import * as istanbul from 'istanbul';
    export = ri;

    interface RemapIstanbul {
        /**
         * The basic API for utilising remap-istanbul
         * @param sources The sources that could be consumed and remapped.
         *                For muliple sources to be combined together, provide
         *                an array of strings.
         * @param reports An object where each key is the report type required and the value
         *                is the destination for the report.
         * @param reportOptions? An object containing the report options.
         * @return A promise that will resolve when all the reports are written.
         */
        (sources: string | string[], reports: { [name: string]: string }, reportOptions: Object): Promise<any>;

        /**
         *Takes sources of coverage information and adds them to a collector which then can be subsequently
         * remapped.
         * @param sources The source(s) of the JSON coverage information
         * @param options A hash of options
         */
        loadCoverage(sources: string | string[], options?: LoadCoverageOptions): Object

        /**
         * Remaps coverage data based on the source maps it discovers in the
         * covered files and returns a coverage Collector that contains the remapped
         * data.
         * @param coverage The coverage (or array of coverages) that need to be remapped
         * @param options A configuration object
         * @return The remapped collector
         */
        remap(coverage: Object | Object[], options?: RemapOptions): istanbul.Collector

        writeReport(
            collector: istanbul.Collector,
            reportType: 'clover' | 'cobertura' | 'html' | 'json-summary' | 'json' | "lcovonly" | 'teamcity' | 'text-lcov' | 'text-summary' | 'text',
            reportOptions: ReportOptions,
            dest: string,
            sources: istanbul.Store): Promise<any>
    }

    /**
     * Configuration object for {@link remap}
     */
    interface RemapOptions {

        /**
         * A string containing to utilise as the base path
         * for determining the location of the source file
         * @default undefined
         */
        basePath?: string

        /**
         * A string or Regular Expression that filters out
         * any coverage where the file path matches
         * @default ((file) => false)
         */
        exclude?: string | RegExp | ((file: string) => boolean)

        /**
         * A boolean that defines to use absolute paths
         * @default false
         */
        useAbsolutePaths?: boolean

        /**
         * A function that takes the remapped file name and
         * and returns a string that should be the name in
         * the final coverage
         * @default ((fileName) => fileName)
         */
        mapFileName?: (file: string) => string

        /**
         * A function that can read a file synchronously
         */
        readFile?: (file: string) => string | Buffer

        /**
         * A function that can read and parse a JSON file synchronously
         */
        readJSON?: (filePath: string) => any

        /**
         * A function that logs warning messages
         * @default console.warn
         */
        warn?: (message?: any, ...optionalParams: any[]) => void;

        /**
         * An Istanbul store where inline sources will be added
         * @default undefined
         */
        sources?: istanbul.Store
    }

    /**
     * Set of options for {@link loadCoverage}
     */
    interface LoadCoverageOptions {

        /**
         * A function that can read and parse a JSON file
         * @default JSON.parse
         */
        readJSON?: (filePath: string) => any

        /**
         * A function that logs warning messages
         * @default console.warn
         */
        warn?: (message?: any, ...optionalParams: any[]) => void;
    }

    interface ReportOptions { }
}

