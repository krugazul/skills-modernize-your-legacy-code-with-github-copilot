// Node.js Accounting Application
// Preserves COBOL business logic, data integrity, and menu options

const readline = require('readline');
const fs = require('fs');
const DATA_FILE = 'accounts.json';

function loadAccounts() {
    if (!fs.existsSync(DATA_FILE)) {
        return { balance: 1000.00, id: '001', name: 'Student' };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveAccounts(account) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(account, null, 2));
}

function showMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
}

function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let account = loadAccounts();

    function prompt() {
        showMenu();
        rl.question('Enter your choice (1-4): ', (choice) => {
            switch (choice.trim()) {
                case '1':
                    console.log(`Current balance: ${account.balance.toFixed(2)}`);
                    prompt();
                    break;
                case '2':
                    rl.question('Enter amount to credit: ', (amt) => {
                        let amount = parseFloat(amt);
                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid amount.');
                        } else {
                            account.balance += amount;
                            saveAccounts(account);
                            console.log('Account credited.');
                        }
                        prompt();
                    });
                    break;
                case '3':
                    rl.question('Enter amount to debit: ', (amt) => {
                        let amount = parseFloat(amt);
                        if (isNaN(amount) || amount <= 0) {
                            console.log('Invalid amount.');
                        } else if (amount > account.balance) {
                            console.log('Insufficient funds.');
                        } else {
                            account.balance -= amount;
                            saveAccounts(account);
                            console.log('Account debited.');
                        }
                        prompt();
                    });
                    break;
                case '4':
                    console.log('Exiting the program. Goodbye!');
                    rl.close();
                    break;
                default:
                    console.log('Invalid choice.');
                    prompt();
            }
        });
    }
    prompt();
}

main();
