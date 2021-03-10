"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var tslib_1 = require("tslib");
var random_seed_1 = tslib_1.__importDefault(require("random-seed"));
var shuffle_array_1 = tslib_1.__importDefault(require("shuffle-array"));
var yargs = tslib_1.__importStar(require("yargs"));
var mathjs_1 = require("mathjs");
var test = function (originalArray, iter, rnd, selectivity) {
    var shuffledArr = shuffle_array_1.default(originalArray, {
        rng: function () { return rnd.random(); },
        copy: true,
    });
    iter.forEach(function () {
        var p = rnd.range(shuffledArr.length);
        var q = rnd.range(shuffledArr.length);
        if (p === q) {
            return;
        }
        if (selectivity !== null) {
            // 選択的別姓制度導入
            var ps = rnd.random();
            if (ps < selectivity) {
                return;
            }
            shuffledArr[p] = shuffledArr[q];
        }
        else {
            shuffledArr[p] = shuffledArr[q];
        }
    });
    return shuffledArr;
};
var isEmpty = function (x) { return x === undefined || x === null ? true : false; };
var concatArray = function (a, b) { return tslib_1.__spreadArray(tslib_1.__spreadArray([], a), b); };
var concatObject = function (a, b) { return (tslib_1.__assign(tslib_1.__assign({}, a), b)); };
var main = function (inputs, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var iter, times, selectivity, keys, rnd, arr, timesArray, numOfPeople, histogram, iteration, histogramPerKey, sortedHistogramPerKeys;
    return tslib_1.__generator(this, function (_a) {
        iter = isEmpty(options === null || options === void 0 ? void 0 : options.iter) ? 1000 : Number(options === null || options === void 0 ? void 0 : options.iter);
        times = isEmpty(options === null || options === void 0 ? void 0 : options.testTimes) ? 1000 : Number(options === null || options === void 0 ? void 0 : options.testTimes);
        selectivity = (options === null || options === void 0 ? void 0 : options.selectivity) || 0;
        keys = inputs.map(function (input) { return input[0]; });
        rnd = random_seed_1.default.create(isEmpty(options === null || options === void 0 ? void 0 : options.seed) ? undefined : String(options === null || options === void 0 ? void 0 : options.seed));
        arr = inputs.map(function (input) { return Array.from({ length: input[1] }).fill(input[0]).map(String); }).reduce(concatArray);
        timesArray = Array.from({ length: times });
        numOfPeople = inputs.map(function (input) { return input[1]; }).reduce(function (a, b) { return a + b; });
        histogram = Array.from({ length: numOfPeople + 1 }).fill(0).map(function (_, i) { return ({
            amount: i,
            counter: 0,
        }); });
        iteration = Array.from({ length: iter });
        histogramPerKey = keys.map(function (key) {
            var _a;
            return (_a = {},
                _a[key] = {
                    histogram: histogram.map(function (x) { return (tslib_1.__assign({}, x)); }),
                },
                _a);
        }).reduce(concatObject);
        timesArray.forEach(function () {
            var result = test(arr, iteration, rnd, (options === null || options === void 0 ? void 0 : options.selectivity) || null);
            // 名字ごとの個数を表示
            var countPerKey = keys.map(function (key) {
                var _a;
                return (_a = {},
                    _a[key] = result.filter(function (r) { return r === key; }).length,
                    _a);
            }).reduce(concatObject);
            keys.forEach(function (key) {
                var count = countPerKey[key];
                histogramPerKey[key].histogram[count].counter++;
            });
        }, []);
        console.info("\n\u30C6\u30B9\u30C8\u5B9F\u884C\u56DE\u6570: " + times + "\n\u4EA4\u914D\u56DE\u6570: " + iter + "\n\u5168\u4EBA\u6570: " + numOfPeople + "\n\u5225\u59D3\u3092\u9078\u629E\u3059\u308B\u78BA\u7387: " + selectivity * 100 + "%\n-----------------------\n\u5143\u306E\u4EBA\u6570");
        inputs.forEach(function (input) {
            console.info("\t" + input[0] + "\t:\t" + input[1] + "\u4EBA");
        });
        console.info("-----------------------");
        console.info("\t" + keys.join('\t'));
        sortedHistogramPerKeys = keys.map(function (key) {
            var _a;
            return (_a = {},
                _a[key] = histogramPerKey[key].histogram.slice().sort(function (a, b) { return a.counter > b.counter ? -1 : 1; }),
                _a);
        }).reduce(concatObject);
        Array.from({ length: numOfPeople }).fill(0).forEach(function (_, rank) {
            if (keys.map(function (key) { return sortedHistogramPerKeys[key]; }).map(function (hpk) { return hpk[rank].counter; }).reduce(function (a, b) { return a + b; }) === 0) {
                return;
            }
            console.info("\u7B2C" + (rank + 1) + "\u4F4D\t" + keys.map(function (key) { return sortedHistogramPerKeys[key][rank].amount + "\u4EBA(" + mathjs_1.round(sortedHistogramPerKeys[key][rank].counter / iter * 100, 3) + "%)"; }).join('\t'));
        });
        return [2 /*return*/];
    });
}); };
exports.main = main;
var argv = yargs.option('seed', {
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
exports.main(argv.keys.map(function (key) { return key.split(','); }).map(function (_a) {
    var name = _a[0], num = _a[1];
    return [String(name), Number(num)];
}), {
    seed: argv.seed,
    selectivity: argv.selectivity,
    iter: argv.iteration,
    testTimes: argv.times,
});
