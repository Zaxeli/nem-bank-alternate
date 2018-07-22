'use strict';
let nem = require("nem-sdk").default;
let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
//Returns promise.
//Gets total amount as outgoing
function getOutgoing(bank, customer){
    return nem.com.requests.account.transactions.outgoing(endpoint, bank).then(function(res){
        var outgoing = res.data.filter((item => {return item.transaction.recipient == customer}));
        var withdraws=0;
        for(var index = 0; index <outgoing.length; index++){
            withdraws += outgoing[index].transaction.amount;
        }
        return withdraws;
    },console.log);
}

//Returns promise
//Gets total amount incoming
function getIncoming(bank, customer){
    return nem.com.requests.account.transactions.incoming(endpoint, bank).then(function(res){
        var incoming = res.data.filter((item)=>{
            var publicKey = item.transaction.signer;
            var address = nem.model.address.toAddress(publicKey, nem.model.network.data.testnet.id);
    
            return address == customer;
        })
        var deposits = 0;
        for(var index = 0; index <incoming.length; index++){
            deposits += incoming[index].transaction.amount;
        }
        return deposits;
    },console.log);
}

//Returns promise
//calculate balance as (deposits - withdraws)
function calcBalance(bank, customer){

    var withdraws = 0;
    var deposits = 0;

    return getIncoming(bank, customer).then(function(res){
        deposits = res;
        console.log("deposit is :"+deposits);
        return getOutgoing(bank, customer).then(function(res){
            withdraws = res;
            return deposits-withdraws;
        },console.log);
    },console.log);
}

//Returns promise
//Check is there are any pending withdraws. res: true => no pending, res: false => pending
function checkNoPendingWithdraws(bank, customer){
    return nem.com.requests.account.transactions.unconfirmed(endpoint, bank).then(function(res){
        var unconfirmedWithdraws = res.data.filter((item)=>{
            return item.transaction.recipient == customer; //withdraw-er (one who is withdrawing)
        });
        return !unconfirmedWithdraws[0]; // true condition if there are no unconfirmed withdraws. To prevent rentry for withdraw.
    },console.log);
}


//Returns promise
// Sends the rewuested withdraw amount with following conditions:
// No pending withdraws
// Withdraw amount is less than balance
function withdraw(bank, customer, amount, common ,endpoint){
    
    //check if there are no pending withdraws in order to prevent re-entry
    return checkNoPendingWithdraws(bank, customer).then(function(res){ 
        if(res){

            //get balance to check if withdraw amount is less than balance
            return calcBalance(bank, customer).then(function(res){
                if(amount<res){

                    //transfer the amount
                    var transferTransaction = nem.model.objects.create("transferTransaction")(customer, amount, "Withdraw from account");
                    var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

                    return nem.model.transactions.send(common, transactionEntity, endpoint);
                }
                //withdraw is more than or equal to balance
                else{
                    return;
                }
            },console.log);
        }
        //there are pending withdraws
        else{
            return;
        }
    },console.log)
    
}

