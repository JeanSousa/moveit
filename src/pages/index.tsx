import Head from 'next/head';
import { GetServerSideProps } from 'next'

import { CompletedChallenges } from '../components/CompletedChallenges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from '../components/ExperienceBar'
import { Profile } from '../components/Profile'
import { ChallengeBox } from '../components/ChallengeBox';


import styles from '../styles/pages/Home.module.css';
import { CountDownProvider } from '../contexts/CountdownContext';
import { ChallangesProvider } from '../contexts/ChallengesContext';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  return (
    <ChallangesProvider 
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
      >
      <div className={styles.container}>
        {/* nesse head importado posso colocar qualquer tag que o head html suporta */}
        <Head>
        <title>Início | move.it</title>
        </Head>
        
        <ExperienceBar/>

      {/* coloquei o countdown provider aqui pois ele so aparece na tela inicial */}
      <CountDownProvider>
        <section>
          <div>
            <Profile/>
            <CompletedChallenges/>
            <Countdown/>
          </div>
          <div>
            <ChallengeBox/>
          </div>
        </section>
      </CountDownProvider>
    </div>
   </ChallangesProvider>
  )
}

//dados que vierem dessa chamada são colocados na minha visualização antes
//de ser montada pelo next, porque a leitura dessa funcao é feita primeiramente pelo node
//tudo executado nesta função esta sendo executado pelo servidor node e não pelo browser
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //chamada api
  //aqui pego todos os cookies
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}