'use strict';

const fs = require('fs');
let rawdata_invoices = fs.readFileSync('invoices.json');
let rawdata_plays = fs.readFileSync('plays.json');
let invoices = JSON.parse(rawdata_invoices);
let plays = JSON.parse(rawdata_plays);

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumnCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                        minimumFactionDigits: 2}).format;
    
    for (let perf of invoice.performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience - 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${paly.type}`);
        }
        volumnCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === play.type) volumnCredits += Math.floor(perf.audience / 5);

        result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`
        totalAmount += thisAmount;
    }
    result += `총액: ${format(totalAmount/100)}\n`;
    result += `적립 포인트: ${volumnCredits}점\n`;
    return result;
}

let result = statement(invoices[0], plays);
console.log(result);
