import { exec, execSync } from 'child_process';
import { get } from 'http';
import * as readline from 'readline';
import { appendFileSync, readFileSync, writeFileSync,unlink, existsSync } from 'fs';
import { join } from 'path';

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function syncAppendFile(filename: string, data: any) {
    if(existsSync(join(__dirname, filename)) === false){
        writeFileSync(join(__dirname, filename), '{"wallets":[');
    }
    else{
        //delete last element from file
        const contents = readFileSync(join(__dirname, filename), 'utf-8');
        const lastChar = contents[contents.length-1];
        if(lastChar === '}') {
            const newContents = contents.substring(0, contents.length-2);
            writeFileSync(join(__dirname, filename), newContents);
            appendFileSync(join(__dirname, filename), ",");  
        }
    }
    appendFileSync(join(__dirname, filename), data+"]}");  
    const contents = readFileSync(join(__dirname, filename), 'utf-8');
    return contents;
}

// wallet class for json file

class Wallet {
    public publicKey: string = '';
    public keypair: string = '';
    public balance: number = 0;
    public passphrase: string = '';
}

var currentPublicKey = '';

if(existsSync(join(__dirname, 'wallet.json')) === true){
    const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
    const wallets = JSON.parse(contents);
    currentPublicKey = wallets.wallets[0].publicKey;
    console.log('Current public key: ' + currentPublicKey);
}
else{
    console.log('No wallet found in the system');
}

function getWallets() {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        return wallets;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function getBalanceFromJSON() {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === currentPublicKey){
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function getBalanceFromJSONByPublicKey(publicKey: string) {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === publicKey){
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function getBalanceFromNetworkByPublicKey(publicKey: string) {
    const solana = execSync('wsl --shell-type login solana balance ' + publicKey).toString();
    return solana;
}

function addBalanceToJSON(amount: number) {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === currentPublicKey){
                wallets.wallets[i].balance += amount;
                writeFileSync(join(__dirname, 'wallet.json'), JSON.stringify(wallets));
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function addBalanceToJSONByPublicKey(publicKey: string, amount: number) {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === publicKey){
                wallets.wallets[i].balance += amount;
                writeFileSync(join(__dirname, 'wallet.json'), JSON.stringify(wallets));
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function takeBalanceFromJSONByPublicKey(publicKey: string, amount: number) {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === publicKey){
                wallets.wallets[i].balance -= amount;
                writeFileSync(join(__dirname, 'wallet.json'), JSON.stringify(wallets));
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function takeBalanceFromJSON(amount: number) {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === currentPublicKey){
                wallets.wallets[i].balance -= amount;
                writeFileSync(join(__dirname, 'wallet.json'), JSON.stringify(wallets));
                return wallets.wallets[i].balance;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function getKeypairFromJSON() {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            if(wallets.wallets[i].publicKey === currentPublicKey){
                return wallets.wallets[i].keypair;
            }
        }
        return null;
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function updateBalances() {
    if(existsSync(join(__dirname, 'wallet.json')) === true){
        const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
        const wallets = JSON.parse(contents);
        for(let i = 0; i < wallets.wallets.length; i++){
            wallets.wallets[i].balance = parseFloat(getBalanceFromNetworkByPublicKey(wallets.wallets[i].publicKey).substring(0, getBalanceFromNetworkByPublicKey(wallets.wallets[i].publicKey).length-5));
        }
        writeFileSync(join(__dirname, 'wallet.json'), JSON.stringify(wallets));
    }
    else{
        console.log('No wallet found in the system');
        return null;
    }
}

function getUserInput() {
    updateBalances();
    rl.question('What do u wanna do? \nnew\nairdrop [X]\nbalance\ntransfer [otherPublicKey][Amount]\nchange [otherPublicKey]\nwallets\nstatistics\n', (answer) => {
        if(answer === 'new') {
            const solana = execSync('wsl --shell-type login solana-keygen new --no-passphrase --outfile willbedeleted.json').toString();
            const wallet = new Wallet();
            wallet.keypair = readFileSync(join(__dirname, 'willbedeleted.json'), 'utf-8');
            wallet.publicKey = solana.split('\n')[3].substring(8);
            wallet.passphrase = solana.split('\n')[6];
            unlink(join(__dirname, 'willbedeleted.json'), (err) => {
                if (err) {
                    console.error(err);
                }
            });
            currentPublicKey = wallet.publicKey;
            syncAppendFile('wallet.json', JSON.stringify(wallet));
            
        }
        else if(answer.substring(0, 7) === 'airdrop'){
            if(isNaN(parseFloat(answer.substring(8))) === false){
                const solana = execSync('wsl --shell-type login solana airdrop ' + answer.substring(8) +" "+ currentPublicKey).toString();
                addBalanceToJSON(parseFloat(answer.substring(8)));
                console.log(solana);
            }
            else{
                console.log('Invalid amount');
            }
        }
        else if(answer === 'balance') {
            const solana = getBalanceFromNetworkByPublicKey(currentPublicKey);
            console.log(solana);
            var balance = solana.substring(0, solana.length-5);
            console.log(balance);
        }
        else if(answer.substring(0, 8) === 'transfer') {
            const otherPublicKey = answer.substring(9, 9+44);
            if(isNaN(parseFloat(answer.substring(9+44+1))) === false){
                var balance = getBalanceFromNetworkByPublicKey(currentPublicKey);
                balance = balance.substring(0, balance.length-5);
                if(parseFloat(balance) >= parseFloat(answer.substring(9+44+1))){
                    var keypair = getKeypairFromJSON();
                    var writeKeypairJSON = writeFileSync(join(__dirname, 'willbedeleted.json'), keypair);
                    console.log(answer.substring(9+44+1))
                    const solana = execSync('wsl --shell-type login solana transfer --from ' + 'willbedeleted.json' + ' ' + otherPublicKey + ' ' + answer.substring(9+44+1) + ' --allow-unfunded-recipient --fee-payer ' + 'willbedeleted.json').toString();
                    unlink(join(__dirname, 'willbedeleted.json'), (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                    takeBalanceFromJSON(parseFloat(answer.substring(9+44+1)));
                    addBalanceToJSONByPublicKey(otherPublicKey, parseFloat(answer.substring(9+44+1)));
                }
                else{
                    console.log('Not enough balance');
                }
            }
            else{
                console.log('Invalid amount');
            }
        }
        else if(answer.substring(0, 6) === 'change') {
            let newPublicKey = answer.substring(7, 7+44);
            if(existsSync(join(__dirname, 'wallet.json')) === true){
                const contents = readFileSync(join(__dirname, 'wallet.json'), 'utf-8');
                const wallets = JSON.parse(contents);
                for(let i = 0; i < wallets.wallets.length; i++){
                    if(wallets.wallets[i].publicKey === newPublicKey){
                        currentPublicKey = newPublicKey;
                        console.log('Current public key: ' + currentPublicKey);
                        return;
                    }
                }
                console.log('Invalid public key');
            }
        }
        else if(answer === 'wallets') {
            const wallets = getWallets();
            console.log(wallets);
        }
        else if(answer === 'statistics'){
            console.log('-----------------');
            const solana = execSync('wsl --shell-type login solana supply').toString();
            console.log(solana);
            console.log('-----------------');
            const height = execSync('wsl --shell-type login solana block-height').toString();
            console.log('Height: '+height);
            console.log('-----------------');
            const production = execSync('wsl --shell-type login solana block-production').toString();
            console.log(production);
            console.log('-----------------');
            const blockTime = execSync('wsl --shell-type login solana block-time').toString();
            console.log(blockTime);
            console.log('-----------------');
        }
        else {
            console.log('Invalid command');
        }
        getUserInput();
    });
}

getUserInput();

