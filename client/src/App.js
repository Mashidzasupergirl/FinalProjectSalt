import React, { useEffect, useState } from 'react';
import './App.css';
import FunnyWish from './Components/FunnyWish';
import Sound from './Components/Sound';
import Timer from './Components/Timer';
import Names from './Components/Names';
import Share from './Components/Share';
import Footer from './Components/Footer';
import { getQueryParameter } from './Helpers/url';
import MainContext from './Context';

function App() {

  const [mobName, setMobName] = useState('Binary cats')
  const [soundList, setSoundList] = useState([])
  const [initialCounter, setInitialCounter] = useState(300)

  const [counter, setCounter] = useState(initialCounter)
  const [playing, setPlaying] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [names, setNames] = useState([])

  const [selectedTime, setSelectedTime] = useState(initialCounter)
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [autonext, setAutonext] = useState(true)
  const [timeModified, setTimeModified] = useState(false)



  useEffect(() => {
    const queryMobName = getQueryParameter('mob')

    const fetchInitData = async () => {
      const apiResult = await (fetch(`/api/mobs/${queryMobName}`).then(data => data.json()))

      setMobName(apiResult.mob)
      setInitialCounter(apiResult.timeInitial)
      setCounter(apiResult.timeLeft)
      setNames(apiResult.names)
      setPlaying(apiResult.playing)
      setAutonext(apiResult.autonext)
      // TODO: memorize getters and setters to persist on localstorage
    }

    if (queryMobName !== null) fetchInitData()
  }, [])

  // TODO: think abouth localStorage (if mobName do not exist get/save from/on localStorage)
  // TODO: if mob not found, display a message like "mob not found, would you like to create a new one?"

  const context = {
    mobName, setMobName,
    soundList, setSoundList,
    initialCounter, setInitialCounter,
    names, setNames,
    counter, setCounter,
    playing, setPlaying,
    isChanging, setIsChanging,
    selectedTime, setSelectedTime,
    minutes, setMinutes,
    seconds, setSeconds,
    autonext, setAutonext,
    timeModified, setTimeModified,
  }

  return (
    <MainContext.Provider value={context}>
    <div className="App">
      <h3 className='hello'>{`${mobName} timer`}</h3>
        <Timer />
      <div className='names-and-wish-container'>
        <Names />
        <FunnyWish />
      </div>
      <div className='sound-and-share'>
        <Sound />
      <Share />
      </div>
      <Footer/>
    </div>
  </MainContext.Provider>
  );
}

export default App;
