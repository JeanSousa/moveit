import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountDownProvider({ children }) {
    //passo o contexto que quero usar na funcao useContext do react
    const { startNewChallenge } = useContext(ChallengesContext);



    // o tempo inicial é em segundos
    const [time, setTime] = useState(0.1 * 60);

    //estado armazena se o countdown está ativo
    const [isActive, setIsActive] = useState(false);

    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    function startCountdown() {
        setIsActive(true);
      }
  
      //funcao vai parar o set time out que faz a contagem regressiva
      //pois para fazer a contagem regressiva necessita de is active ser true
      function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(0.1 * 60);
        setHasFinished(false);
      }
  
      //useeffect recebe dois parametros, sendo o primeiro 'o que quero executar'
      //segundo parametro é quando eu vou executar o primeiro parametro
      //exemplo = sempre que a variavel active mudar irá executar o primeiro parametro
      // vai ser executado quando o active mudar ou o time mudar
      useEffect(() => {  
      //se tiver ativo e o tempo maior que zero depois de um segundo voi executar a funcao
      //set time
         if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => { 
                setTime(time - 1);
            }, 1000)
         } else if (isActive && time === 0) {
             setHasFinished(true);
             setIsActive(false);
             startNewChallenge();
         }
  
      } , [isActive, time]);
    
    return (
        <CountdownContext.Provider value={{
          minutes,
          seconds,
          hasFinished,
          isActive,
          startCountdown,
          resetCountdown
        }}>
           {children}
        </CountdownContext.Provider>
    );
}
