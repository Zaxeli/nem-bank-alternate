**Note: This is not ready to be run as is, some minor changes need to be made first (marked in comments).**

<br/>Changes to make:
 1. Give the Password and Private Key for the account to be used as bank
 2. Give the address of account acting as bank.

**This is not to be used in production, the password and privatekey should not be made available like this.**

## Working:

* The index.html file is where the UI is located. 

* The user must enter the address to login as.

* Once the login button is pressed, the dashboard is made available with the balance of the address, refresh balance button and withdraw balance fields.

* The balance is calculated by first fetching all the transactions sent to bank and adding their amount to get total deposited value.

* Then all withdrawal transactions are fetched to get the total withdrawn value.

* The balance is then calculated as Deposits - Withdraws (These calculation also take into account the amount sent when sending mosaics).

* Refresh balance button simply redoes this calculation and updates.

* The withdraw text field takes input for how much to withdraw.

* The withdraw button first calculates the balance then check if the withdraw amount is less than balance and if so, then it sends a transaction from bank to account-holder for the requested amount.

* The balance is not automatically updates, refresh balance button needs to be used.

## Design:

* There is a single account that acts as a bank.

* All account-holders transact with this one account (bank).

* Withdraws and deposits are done with the bank.