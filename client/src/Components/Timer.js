import React, { useState, useRef, useEffect, useContext } from 'react'
import playButton from './Buttons/play-button-black.png'
import stopButton from './Buttons/stop-button-black.png'
import pauseButton from './Buttons/pause-button-black.png'
import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import MainContext from '../Context'


const Timer = () => {
  //setting initial counter time and transition time
  const transitionTime = 5
  //ref ensures there's only one interval set - you need to assign the interval id to ref to keep track of it
  const Ref = useRef(null);
  //defining states

  const { playing, setPlaying } = useContext(MainContext)
  const { counter, setCounter } = useContext(MainContext)
  const { isChanging, setIsChanging } = useContext(MainContext)

  //time we edited
  const { selectedTime, setSelectedTime } = useContext(MainContext)
  const { minutes, setMinutes } = useContext(MainContext)
  const { seconds, setSeconds } = useContext(MainContext)
  const { autonext, setAutonext } = useContext(MainContext)
  const { timeModified, setTimeModified } = useContext(MainContext)
  //getting names from the context to change them
  const { names, setNames } = useContext(MainContext)

  //  checking [counter] every time it changes. handling transition.
  useEffect(() => {
    if (counter === -1) {
      if (isChanging) {
        setCounter(selectedTime)
        setIsChanging(false)
        if (!autonext) {
          pauseTimer()
        }

        document.getElementById('player').pause()
      }
      else {
        setCounter(transitionTime)
        setIsChanging(true)
        document.getElementById('player').play()
        // We have finished timer, time to change person and beep etc
        //this is changing to the next selected name in the context
        const activeIndex = names.findIndex(object => {
          return object.isActive;
        });

        setNames(current => current.map((obj, ind) => {
          if (ind === activeIndex) {
            return { ...obj, isActive: false };
          }
          if (ind === activeIndex + 1 || (activeIndex == names.length - 1 && ind == 0)) {
            return { ...obj, isActive: true };
          }
          return { ...obj };
        }))
        //changing cat picture
        document.getElementsByClassName("funnyWish-button")[0].click()
      }
    }
    //
    //this is formatting the timer by calculating mins and secs from counter
    let mins = Math.floor(counter / 60)
    let secs = counter % 60
    if (mins <= 9) { mins = '0' + Number(mins) }
    if (secs <= 9) { secs = '0' + Number(secs) }
    setMinutes(mins)
    setSeconds(secs)
  }, [counter]);
  //getting whatever they typed and setting it as new time, setTimeModified- when we hit play we want to know if we interacted with the time so we set a new time
  const editTimerMinutes = (newMinutes) => {
    setMinutes(newMinutes)
    setTimeModified(true)
    // setCounter(60 * minutes + seconds)
  }
  const editTimerSeconds = (newSeconds) => {
    setSeconds(newSeconds)
    setTimeModified(true)
    // setCounter(60 * minutes + seconds)
  }

  //enforcing the rules of input - whenever we click away from input box it will format it, reducing numbers over 59 to 59. enforcing rules of time
  const adjustTime = () => {
    if (seconds > 59) {
      setSeconds(59)
    }
  }

  const toggleAuto = () => {
    setAutonext(current => !current)
    if (minutes > 59) {
      setMinutes(59)
    }
  }

  // just making the timer
  const timer = () => {
    //disable input while playing -
    if (playing) {
      return <> <input className='inputTimer' type="text" value={minutes} disabled
      /> : <input className='inputTimer' type="text" value={seconds} disabled /> </>
    }
    //this is able to be modified since it's not playing -  onBlur is when we aren't clicked inside input anymore. we call function to adjust time - max 59. onChange- every time it's modified we are editing the state
    return <> <input className='inputTimer' type="text" value={minutes} onBlur={e => adjustTime()} onChange={e => editTimerMinutes(e.target.value)}
    /> : <input className='inputTimer' type="text" value={seconds} onBlur={e => adjustTime()} onChange={e => editTimerSeconds(e.target.value)} /> </>
  }

  const startTimer = () => {
    //we see where the current mins and secs are and calculate new counter value.
    if (timeModified) {
      //calculating number of seconds
      const newTime = 60 * Number(minutes) + Number(seconds)
      //setting counter
      setCounter(newTime)
      //when we start the clock again we will see new time, we also need this for the circle
      setSelectedTime(newTime)
      //then it's no longer modified - we only want true after we edited it otherwise when we press pause and play again it would reset the newTime
      setTimeModified(false)
    }

    //clearing the interval - ref holds the id of the interval. if we didnt have this it would speed up every time we clicked start
    if (Ref.current) clearInterval(Ref.current);
    // calling a function that reduces out counter by one every second. setting minimum of -1 (we had zero before but didn't work)
    const id = setInterval(() => {
      setCounter(count => Math.max(-1, count - 1))
    }, 1000)
    // this is useful for pausing, clearing and starting timer. it will allow us to call clear interval function
    Ref.current = id;
    setPlaying(true)
  }

  useEffect(() => {
    if (playing) {
      startTimer()
      console.log('useEffect')
    }
  }, [playing])

  const pauseTimer = () => {
    // this is how we clear the interval - stop the ticking.
    if (Ref.current) clearInterval(Ref.current)
    setPlaying(false)
  }

  const stopTimer = () => {
    pauseTimer()
    setCounter(selectedTime)
  }
  //my button alternates between stop and start based on state.
  // for now all we do with playing is set the button
  let button;
  if (playing) {
    button = <button className='buttons-for-start-and-stop' onClick={pauseTimer}>
      <img src={pauseButton} alt='pause' />
    </button>;

  } else {
    button = <button className='buttons-for-start-and-stop' onClick={startTimer}>
      <img src={playButton} alt='play' />
    </button>;
  }

  //set the new initial counter with the number that has been selected, setting new counter and not letting it change while timer is running
  //these are the functions being called when I click on arrows
  const increaseCounterMinutes = () => {
    if (!playing) {
      setCounter(count => count + 60)
      setSelectedTime(counter)
      setTimeModified(true)
    }
  }

  const decreaseCounterMinutes = () => {
    if (!playing) {
      if (counter >= 60) {
        setCounter(count => count - 60)
      }
      setSelectedTime(counter)
      setTimeModified(true)
    }
  }

  const decreaseCounterSeconds = () => {
    if (!playing) {
      if (counter >= 1) {
        setCounter(count => count - 1)
      }
      setSelectedTime(counter)
      setTimeModified(true)
    }
  }

  const increaseCounterSeconds = () => {
    if (!playing) {
      setCounter(count => count + 1)
      setSelectedTime(counter)
      setTimeModified(true)
    }
  }

  return (
    <>
      <div className='left-side-of-clock'>
        <button className='button-autochange universal-button' onClick={toggleAuto}>AutoChange: {autonext ? "✅" : "❌"}</button>
      </div>
      <div className='right-side-of-clock'>
        <div className='clock-central-part'>
          <div className="clock">
            <div className='buttons__up__down'>
              <BiCaretUp className='minutesUpButton' onClick={increaseCounterMinutes} />
              <BiCaretUp className='secondsUpButton' onClick={increaseCounterSeconds} />
            </div>
            <div className='min-and-sec'>{isChanging ? <div className='timetochange'> Next🚀</div> : timer()}</div>
            <div className='buttons__up__down'>
              <BiCaretDown className='minutesDownButton' onClick={decreaseCounterMinutes} />
              <BiCaretDown className='secondsDownButton' onClick={decreaseCounterSeconds} />
            </div>
          </div>
          <div className='buttons-for-timer'>
            <div> <button className='buttons-for-start-and-stop' onClick={stopTimer}><img src={stopButton} alt='stop' /></button>
              {button}</div>
          </div>
        </div>
      </div>

    </>


  )

}

export default Timer