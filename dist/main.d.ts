/**
 * InputType[0] ... 名字 (`string` 型)\
 * InputType[1] ... 人数 (`number` 型)
 */
export declare type InputType = [string, number];
export interface Option {
    /** 別姓を選択する確率, 0~1の小数点で指定 */
    selectivity?: number;
    /** 乱数のシード値 */
    seed?: string | number;
    /** 検証実験を繰り返す回数 */
    testTimes?: number;
    /** 交配を行う回数 */
    iter?: number;
}
/**
 * 検証を行う関数
 */
declare const main: (inputs: InputType[], options?: Option | undefined) => Promise<void>;
export default main;
