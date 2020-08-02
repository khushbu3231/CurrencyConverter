import React from 'react';
import '../css/style.css';

const CurrencyDisplay = (props) => {
    //console.log(props)
    const { currencies, intialSelectedCurrency, onChangeAmount, onSelectChange, amount, currencyName, symbol } = props
    return (
        <div >
            <select className=" card-header dropdown dropDownStyle" name={currencyName} value={intialSelectedCurrency} onChange={onSelectChange}>
                {
                    currencies.map((value, index) => {
                        return (
                            <option key={index} value={value.currency}>{value.currency}-{value.name} </option>
                        )
                    })
                }
            </select>
            <div className="card-body input-group mb-3 input-style">
                <div className="input-group-prepend">
                    <span className="input-group-text">{symbol}</span>
                </div>
                <input type="number" className="form-control " step="0.01" min="0" max="10" onChange={onChangeAmount} value={amount}  />
            </div>
        </div>
    )
}
export default CurrencyDisplay

