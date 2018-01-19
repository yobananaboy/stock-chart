import React from 'react';
import emoji from 'react-easy-emoji';


export const Header = () => {
    return(
        <div className="row justify-content-center">
            <div className="col-12 col-md-11 col-lg-10 header">
                <h1>Watch the stock market</h1>
                <h1>{emoji("📈 💲 💷 🤑 " ) }</h1>
                <p>Search for stock symbols to compare stocks. Stocks update in realtime based on other users' searches.</p>
            </div>
        </div>
    );
};

