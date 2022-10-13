const path = require("path");
const fs = require("fs");

export interface IserverInfo {
    smtp: {
        host: string, port: number,
        auth: {user: string, pass: string}
    }
    imap: {
        host: string, port: number,
        auth: {user: string, pass: string}
    }
};

export let serverInfo: IserverInfo;

const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);


