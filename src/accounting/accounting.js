const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'accounts.json');

function loadAccounts() {
    if (!fs.existsSync(DATA_FILE)) {
        return { balance: 1000.00, id: '001', name: 'Student' };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveAccounts(account) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(account, null, 2));
}

function creditAccount(account, amount) {
    if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Invalid amount.' };
    }
    account.balance += amount;
    saveAccounts(account);
    return { success: true, message: 'Account credited.' };
}

function debitAccount(account, amount) {
    if (isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Invalid amount.' };
    }
    if (amount > account.balance) {
        return { success: false, message: 'Insufficient funds.' };
    }
    account.balance -= amount;
    saveAccounts(account);
    return { success: true, message: 'Account debited.' };
}

module.exports = {
    loadAccounts,
    saveAccounts,
    creditAccount,
    debitAccount,
    DATA_FILE
};
