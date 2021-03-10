import generator from 'random-seed';
import shuffle from 'shuffle-array';
import * as yargs from 'yargs';
import {round} from 'mathjs';

export type InputType = [string, number]
export interface Option {
    selectivity?: number;
    seed?: string | number;
    testTimes?: number;
    iter?: number;
}

const test = (originalArray: string[], iter: Array<any>, rnd: generator.RandomSeed, selectivity: number | null) => {
  const shuffledArr = shuffle(originalArray, {
    rng: () => rnd.random(),
    copy: true,
  });
  iter.forEach(() => {
    const p = rnd.range(shuffledArr.length);
    const q = rnd.range(shuffledArr.length);
    if (p === q) {
      return;
    }
    if (selectivity !== null) {
      // 選択的別姓制度導入
      const ps = rnd.random();
      if (ps < selectivity) {
        return;
      }
      shuffledArr[p] = shuffledArr[q];
    } else {
      shuffledArr[p] = shuffledArr[q];
    }
  });
  return shuffledArr;
};

const isEmpty = (x: any) => x === undefined || x === null ? true : false;
const concatArray = (a: any[], b: any[]) => [...a, ...b];
const concatObject = (a: {[key: string]: any}, b: {[key: string]: any}) => ({...a, ...b});

export const main = async (inputs: InputType[], options?: Option) => {
  const iter = isEmpty(options?.iter) ? 1000 : Number(options?.iter);
  const times = isEmpty(options?.testTimes) ? 1000 : Number(options?.testTimes);
  const selectivity = options?.selectivity || 0;
  const keys = inputs.map((input) => input[0]);
  const rnd = generator.create(isEmpty(options?.seed) ? undefined : String(options?.seed));
  const arr = inputs.map((input) => Array.from({length: input[1]}).fill(input[0]).map(String)).reduce(concatArray);
  const timesArray = Array.from({length: times});
  const numOfPeople = inputs.map((input) => input[1]).reduce((a, b) => a + b);
  const histogram = Array.from({length: numOfPeople + 1}).fill(0).map((_, i) => ({
    amount: i,
    counter: 0,
  }));

  const iteration = Array.from({length: iter});
  const histogramPerKey = keys.map((key) => ({
    [key]: {
      histogram: histogram.map((x) => ({...x})),
    },
  })).reduce(concatObject);
  timesArray.forEach(() => {
    const result = test(arr, iteration, rnd, options?.selectivity || null);
    // 名字ごとの個数を表示
    const countPerKey = keys.map((key) => ({
      [key]: result.filter((r) => r === key).length,
    })).reduce(concatObject);
    keys.forEach((key) => {
      const count = countPerKey[key];
      histogramPerKey[key].histogram[count].counter++;
    });
  }, []);
  console.info(`
テスト実行回数: ${times}
交配回数: ${iter}
全人数: ${numOfPeople}
別姓を選択する確率: ${selectivity * 100}%
-----------------------
元の人数`);
  inputs.forEach((input) => {
    console.info(`\t${input[0]}\t:\t${input[1]}人`);
  });
  console.info(`-----------------------`);
  console.info(`\t` + keys.join('\t'));
  const sortedHistogramPerKeys = keys.map((key) => ({
    [key]: histogramPerKey[key].histogram.slice().sort((a, b) => a.counter > b.counter ? -1 : 1),
  })).reduce(concatObject);
  Array.from({length: numOfPeople}).fill(0).forEach((_, rank) => {
    if (keys.map((key) => sortedHistogramPerKeys[key]).map((hpk) => hpk[rank].counter).reduce((a, b) => a + b) === 0) {
      return;
    }
    console.info(`第${rank+1}位\t` + keys.map((key) => `${sortedHistogramPerKeys[key][rank].amount}人(${round(
        sortedHistogramPerKeys[key][rank].counter / iter * 100
        , 3)}%)`).join('\t'));
  });
};

const argv = yargs.option('seed', {
  alias: 's',
  description: 'シード値',
  default: undefined,
}).option('selectivity', {
  alias: 'p',
  type: 'number',
  description: '選択的別姓が行われる確率. 少数点で指定',
  default: undefined,
}).option('iteration', {
  alias: 'i',
  type: 'number',
  description: '実験を行う回数',
  default: 1000,
}).option('times', {
  alias: 't',
  type: 'number',
  description: '交配実験を行う回数',
  default: 1000,
}).option('keys', {
  alias: 'k',
  description: '名字と個数. `tanaka,90` のようにカンマ区切りで指定する',
  type: 'array',
  string: true,
  demandOption: true,
}).help().argv;

main(argv.keys.map((key) => key.split(',')).map(([name, num]) => [String(name), Number(num)]), {
  seed: argv.seed,
  selectivity: argv.selectivity,
  iter: argv.iteration,
  testTimes: argv.times,
});
