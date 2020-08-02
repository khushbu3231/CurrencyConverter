import React, { Component } from 'react';
import axios from 'axios';
import CurrencyDisplay from './CurrencyDisplay';
import fx from "money";
import '../css/style.css';

export class CurrencyConverter extends Component {
    state = {
        //currenciesObject:{},
        currencies: [],
        rate: {},
        fromCurrency: "USD",
        toCurrency: "CAD",
        amount: "",
        exchangeRate: 1,
        result: "",
        displayToName: "",
        displayFromName: "",
        symbolFrom: "",
        sumbolTo: "",
        flag: true
    }

    componentDidMount() {
        this.fetchCurrency();
        this.fetchRates();
        this.calculateResult()
    }

    //Fetch the required data for currency array
    fetchCurrency() {
        axios({
            method: "GET",
            url: "https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json"
        }).then(res => {
            this.getCurrencyArray(res.data)
        })
    }

    //get the array of currency- currencies, symbol,name
    getCurrencyArray(currencyObject) {
        let currencyArry = []
        //   console.log(currencyObject)
        for (const currency in currencyObject) {
            //console.log(currency)
            currencyArry.push({
                currency: currency,
                symbol: currencyObject[currency].symbol,
                name: currencyObject[currency].name,
            });
        }
        this.setState({
            //currencies: res.data         
            currencies: [...currencyArry]
        })
    }


    //fetch the rates and other detail from api
    async fetchRates() {
        //console.log("fetch rate")
        await axios({
            method: "GET",
            url: "https://api.exchangeratesapi.io/latest?base=USD"
        }).then(res => {
            //Object.keys return the array of object literal keys
            const currentciesArray = Object.keys(res.data.rates);
            const displayFrom = this.state.currencies.filter(currency => currency.currency === res.data.base);
            const displayFromName = displayFrom[0].name;
            const displayTo = this.state.currencies.filter(currency => currency.currency === currentciesArray[0]);
            const displayToName = displayTo[0].name;
            const symbolFrom = displayFrom[0].symbol;
            const symbolTo = displayTo[0].symbol;
            const intialAmount = 1;
            this.setState({
                amount: intialAmount,
                rate: res.data.rates,
                fromCurrency: res.data.base,
                toCurrency: currentciesArray[0],
                displayFromName,
                displayToName,
                // displayFromName: displayFrom[0].name,
                // displayToName: displayTo[0].name,
                symbolFrom,
                symbolTo

            }, () => {
                this.setRates()
            })
        })
    }


    //set a base and rates to use money.js functions    
    setRates() {
        // This sets our rate table for money.js to reference.
        console.log("set rate called")
        fx.base = "USD";
        fx.rates = this.state.rate;
    }

    handleInput = e => {
        this.setState(
            {
                amount: e.target.value,
                result: null,
            }, this.calculateResult);
    }

    handleInputSelect = e => {
        const displayFrom = this.state.currencies.filter(currency => currency.currency === e.target.value);
        //  console.log(e.target.name)
        this.setState(
            {
                fromCurrency: e.target.value,
                displayFromName: displayFrom[0].name,
                symbolFrom: displayFrom[0].symbol,
                result: null
            }, this.calculateResult);
    };

    handleOutputSelect = e => {
        //  console.log(e.target.name)
        const displayTo = this.state.currencies.filter(currency => currency.currency === e.target.value);
        this.setState(
            {
                toCurrency: e.target.value,
                displayToName: displayTo[0].name,
                symbolTo: displayTo[0].symbol,
                result: null
            }, this.calculateResult);
    };

    //calculate receving amout from entered amount and exchange
    calculateResult = () => {
        const amount = this.state.amount;
        axios({
            method: "GET",
            url: `https://api.exchangeratesapi.io/latest?base=${this.state.fromCurrency}`
        }).then(res => {

            //using simple calculation 
            // const result = (res.data.rates[this.state.toCurrency] * amount).toFixed(4);

            //Using money.js to convert the currency
            const result = fx.convert(this.state.amount, { from: this.state.fromCurrency, to: this.state.toCurrency });

            this.setState({
                result: result.toFixed(2),
                exchangeRate: res.data.rates[this.state.toCurrency].toFixed(2)
            });
        }).catch(error => {
            console.log(error)

        });
    };

    render() {
        return (
            <div>
                <div className="container">
                    <h1>Currency Converter</h1>
                    {/* {this.state.currencies.map(currency=>console.log(currency.symbol))} */}
                    <div className="container-body">
                        <div className="displayRate">
                            <div className="text-muted">1 {this.state.displayFromName} equals </div>
                            <div className="displayRateImportant">
                                {this.state.exchangeRate}   {this.state.displayToName}
                            </div>
                        </div>
                        <div className="card-deck">
                            <div className="card">
                                <CurrencyDisplay
                                    currencies={this.state.currencies}
                                    rates={this.state.rate}
                                    intialSelectedCurrency={this.state.fromCurrency}
                                    onChangeAmount={this.handleInput}
                                    onSelectChange={this.handleInputSelect}
                                    amount={this.state.amount}
                                    symbol={this.state.symbolFrom}
                                />
                            </div>
                            <div className="card">
                                <CurrencyDisplay
                                    currencies={this.state.currencies} 
                                    rates={this.state.rate} 
                                    intialSelectedCurrency={this.state.toCurrency} 
                                    onChangeAmount={this.handleInput} 
                                    onSelectChange={this.handleOutputSelect}
                                    amount={this.state.result}
                                    symbol={this.state.symbolTo} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="display-result">
                        {this.state.amount} {this.state.fromCurrency} = {this.state.result} {this.state.toCurrency}
                    </div>
                </div>
            </div>
        )
    }
}

export default CurrencyConverter

