import React from 'react';
import emoji from 'react-easy-emoji'
import { getColor } from '../colors';

export const StockSymbols = (props) => {
    let stocks = props.stocks.map((stock, index) => {
        let color = getColor(index);
        return (
            <div className="col-12 col-md-4" key={index}>
                <div className="card">
                    <div className="card-body" style={{'borderLeft': `${color} solid 5px`}}>
                        <h5>{stock.name}</h5>
                        <button className="btn btn-danger" onClick={props.onClick} id={index}>Remove</button>
                    </div>
                </div>
            </div>
            );
    });
    let search =
                <form onSubmit={props.onSubmit}>
                    <div className="input-group search">
                        <input type="text" className="form-control" type="text" onChange={props.onChange} value={props.search} />
                        <span className="input-group-btn">
                            <button className="btn btn-dark" type="submit">{emoji(" 🔎 ")}</button>
                        </span>
                    </div>
                </form>;
    if(props.searchIsLoading) {
        search = <p>Loading...</p>;
    }
    
    return(
        <div className="row">
            <div className="col-12">
                {search}
            </div>
            {stocks}
        </div>
        );
};