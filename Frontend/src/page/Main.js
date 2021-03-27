import React, {useEffect, useState}  from 'react';
import Typical from 'react-typical'
import Footer from '../component/Footer';

import logo from '../logo.png'
import quotes from '../util/quotes.json'

function Main() {

    const [quote, setQuote] = useState({quote: "Life is good", by: "Rahat Hossain"})

    const TypingAnimation =  React.memo(()=>{
        return <Typical
        loop={Infinity}
        wrapper="p"
        steps={['Start coding.', 3000, 'Get some life.', 500, 'Get some problems.', 3000, 'Enhance your', 500, 'Enhance your solving skill.',  3000, 'Play with the *****', 200, 'Play with the ranklist.', 3000]}
       />
      },(props,prevProp)=> true ); 

    useEffect(() => {
        setQuote(quotes[ Math.floor( Math.random() * quotes.length ) + 1 ]);
        //console.log(quote)
    }, [])

  return (
    <div>
        <img src={logo} alt="Logo" className="mx-auto p-4 m-4"/>
        <div style={{height: '90vh'}}>
        <div className="flex flex-wrap container mx-auto">
            <span className="mx-auto text-3xl tracking-wide font-black">Your friendly online judge</span>
        </div>
        <div className="flex flex-wrap container mx-auto items-center justify-between">
            <div className="mx-auto text-lg p-8">
                <TypingAnimation/>
            </div>
        </div>
        <br/><br/>
        <div className="flex container mx-auto items-center">
            <span className="mx-auto text-lg tracking-tight text-gray-600 text-justify">{quote?.quote || "Work work work work work."}</span> <br/>
        </div>
        <div className="flex container mx-auto items-center">
            <span className="mx-auto text-lg tracking-tight text-gray-600">- {quote?.by || "Rihanna"}</span>
        </div>
        </div>
        <Footer style={{bottom: '0', height: '10vh'}}/>
    </div>
  );
}

export default Main;
