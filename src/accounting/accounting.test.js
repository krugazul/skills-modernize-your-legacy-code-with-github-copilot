const fs = require('fs');
const path = require('path');
const {
  loadAccounts,
  saveAccounts,
  creditAccount,
  debitAccount,
  DATA_FILE
} = require('./accounting');

describe('Accounting Application', () => {
  let account;

  beforeEach(() => {
    account = { balance: 1000.00, id: '001', name: 'Student' };
    // Reset the data file before each test
    fs.writeFileSync(DATA_FILE, JSON.stringify(account, null, 2));
  });

  test('TC01: View account balance', () => {
    const loaded = loadAccounts();
    expect(loaded.balance).toBe(1000.00);
  });

  test('TC02: Credit account with valid amount', () => {
    const result = creditAccount(account, 500);
    expect(result.success).toBe(true);
    expect(account.balance).toBe(1500.00);
  });

  test('TC03: Debit account with valid amount', () => {
    const result = debitAccount(account, 200);
    expect(result.success).toBe(true);
    expect(account.balance).toBe(800.00);
  });

  test('TC04: Debit account with insufficient funds', () => {
    const result = debitAccount(account, 2000);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds.');
    expect(account.balance).toBe(1000.00);
  });

  test('TC05: Credit account with invalid amount', () => {
    const result = creditAccount(account, -100);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid amount.');
    expect(account.balance).toBe(1000.00);
  });

  test('TC06: Debit account with invalid amount', () => {
    const result = debitAccount(account, -100);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid amount.');
    expect(account.balance).toBe(1000.00);
  });

  test('TC08: Data integrity after operations', () => {
    creditAccount(account, 100);
    debitAccount(account, 50);
    saveAccounts(account);
    const loaded = loadAccounts();
    expect(loaded.balance).toBe(1050.00);
  });
});
