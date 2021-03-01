import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';

import { LevelUpModal } from '../components/LevelUpModal'


interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}



//uso typescript para entrar no component e ele sugerir level, currentexperience e etc
interface ChallengesContextData {
    level:number;
    currentExperience:number; 
    experienceToNextLevel: number;
    challengesCompleted:number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () =>void;
}


interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}


  

//passo valor inicial do meu contexto como tipo challengescontextdata
export const ChallengesContext = createContext({} as ChallengesContextData);


export function ChallangesProvider({ 
    children, 
    ...rest
}: ChallengesProviderProps) { 
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const [isLevelUpModalOpen, setIsLevelModalOpen] = useState(false)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
  
    //quando passamos um array vazio para use efect ele vai executar a função do
    //primeiro parametro uma unica vez quando o elemento for exibido em tela
    useEffect(() => {
      Notification.requestPermission();
    }, [])

    useEffect(() => {
     //se mudar level ou currentExperience ou challengescompleted vai salvar 
     //no cookie com a ajuda da biblioteca js-cookie
     Cookies.set('level', String(level));
     Cookies.set('currentExperience', String(currentExperience));
     Cookies.set('challengesCompleted', String(challengesCompleted));
       
    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelModalOpen(false);
    }
 

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted') {
            new Notification('Novo desafio', {
               body: `Valendo ${challenge.amount}xp!` 
            })
        }
    }
  
    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if(!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        //se a experiencia final for maior que o que eu tenho de experiencia para upar de
        //level eu jogo a diferença no level seguinte
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);

    }

    return (
         //todos os elementos que estão dentro do provider vao ter acesso ao dados do contexto
        //nesse caso do contexto importado ChallengesContext
        <ChallengesContext.Provider value={{
            level , 
            currentExperience, 
            experienceToNextLevel,
            challengesCompleted, 
            levelUp,
            startNewChallenge,
            activeChallenge,
            resetChallenge,
            completeChallenge,
            closeLevelUpModal
        }}>
            {children}
         { isLevelUpModalOpen && <LevelUpModal/>}
        </ChallengesContext.Provider>
    )
}



