import { createContext, useEffect, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({children})=>{
    const [step, setStep] = useState(0);

    const handleStep = (curentStep)=>{
        setStep(curentStep);
    }



    return(
        <PaymentContext.Provider value={{step,handleStep}}> 
            {children}
        </PaymentContext.Provider>
    )

}


export default PaymentContext