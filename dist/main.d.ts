export declare type InputType = [string, number];
export interface Option {
    selectivity?: number;
    seed?: string | number;
    testTimes?: number;
    iter?: number;
}
export declare const main: (inputs: InputType[], options?: Option | undefined) => Promise<void>;
