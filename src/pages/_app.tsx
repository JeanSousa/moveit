//componente que não muda na aplicação ex side bar
//tudo que repete em todas as paginas
import '../styles/global.css';

import { ChallangesProvider } from '../contexts/ChallengesContext';
import { CountDownProvider } from '../contexts/CountdownContext';


function MyApp({ Component, pageProps }) {

  

  return ( 
    // A regra é colocar os providers mais globais externamente
    //ou seja se countdown depende de challenge, então challenge é o mais externo
        <Component {...pageProps} />
  );
}

export default MyApp

