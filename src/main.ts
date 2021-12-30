import { parse } from "csv-parse/sync";
import fs from "fs";
import LM from "ml-levenberg-marquardt";
import path from "path";
import process from "process";

process.argv[2] = "points.csv";
const file = path.join(process.cwd(), process.argv[2]);
if (!fs.existsSync(file)) {
    throw console.error("FILE DOES NOT EXIST");
    process.exit(-1);
}

const contents = fs.readFileSync(file).toString();
const csv: string[][] = parse(contents);

const fitFunction = ([a, b]: number[]) => {
    return (x: number) => (Math.pow(10, (-1 * x) / a) - 1) / b;
};

const data: {
    x: number[];
    y: number[];
} = {
    x: [],
    y: [],
};

csv.forEach((row) => {
    data.x.push(Number.parseFloat(row[0]));
    data.y.push(Number.parseFloat(row[1]));
});

console.log(
    LM(data, fitFunction, {
        initialValues: [70.68410362344989, 0.09836693462869943],
        maxIterations: 1e4,
        minValues: [0, 0],
    })
);
