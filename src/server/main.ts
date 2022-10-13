import path from "path";
import express, {Express, NextFunction, Request, Response} from "express";
import {serverInfo} from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
//import {IContact} from "./Contacts"

//using express
const app: Express = express();
app.use(express.json());

//static for client
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

//cors settings
app.use((inRequest: Request, inResponse: Response, inNext: NextFunction) => {
    inResponse.header("Acess-Control-Allow-Origin", "*");
    inResponse.header("Acess-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Acess-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type-Accept")
    inNext();
})

app.get("/mailboxes", async(inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        const mailboxes: IMAP.Imailbox[] = await imapWorker.listMailboxes();
        inResponse.json(mailboxes);
    } catch (error) {
        console.log(error);
    }
})

app.get("/messages/:mailbox/:id", async(inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox: inRequest.params.mailbox,                
                id: parseInt(inRequest.params.id, 10)
            })
            inResponse.send(messageBody);
        } catch (error) {
            console.log(error);
        }
})

app.delete("/messages/:mailbox/:id", async(inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        })
    } catch (error) {
        console.log(error);
    }
})

app.post("/messages", async(inResquest: Request, inResponse:Response) => {
   try {
        const smtpWorker: IMAP.Worker = new SMTP.Worker(serverInfo);
        await smtpWorker.sendMessage(inRequest.body);
        inResponse.send("Message was sucessfully send");
    } catch (error) {
        console.log(error);
    }
})

app.get("/contacts", async(inRequest: Request, inResponse: Response) => {
    try {
        const workerContacts: Contacts.Worker = new Contacts.Worker();
        const contacts: IContact[] = await workerContacts.listContacts();
        inResponse.json(contacts);
    } catch (error) {
        console.log(error);
    }
})







