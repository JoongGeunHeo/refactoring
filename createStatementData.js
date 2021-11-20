export default function createStatementData(invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalVolumnCredits(result);
    result.totalVolumnCredits = totalVolumnCredits(result);
    return result;  

    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumnCredits = calculator.volumnCredits;
        return result;
    }

    function playFor(aPerfomance) {
        return plays[aPerfomance.playID];
    }

    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0);
    }

    function totalVolumnCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumnCredits, 0);
    }  
    
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error('알 수 없는 장르: ${aPlay.type}');
    }
}

class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.aPerformance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumnCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        result = 40000;
        if (this.perfomance.audience > 30) {
            result += 1000 * (this.perfomance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        result = 30000;
        if (this.perfomance.audience > 20) {
            result += 10000 + 500 * (this.perfomance.audience - 20);
        }
        result += 300 * this.perfomance.audience;
        return result;
    }

    get volumnCredits() {
        return super.volumnCredits + Math.floor(this.performance.audience / 5);
    }
}