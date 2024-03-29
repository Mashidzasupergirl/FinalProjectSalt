import React from 'react';
import { useEffect, useState, useContext } from 'react';
import refreshButton from './Buttons/refresh-button-pink.png';
import MainContext from '../Context'

function FunnyWish() {

    const saveToLocalStorage = (obj, key = 'cat') => window.localStorage.setItem(key, JSON.stringify(obj));
    const getFromLocalStorage = (key = 'cat') => JSON.parse(window.localStorage.getItem(key));
    let savedCat = getFromLocalStorage() || []

    const { names } = useContext(MainContext)
    const [catData, setCatData] = React.useState(savedCat);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { isChanging, setIsChanging } = useContext(MainContext)

    const changeActiveName = () => {
        if (names.length > 0 && names.find(person => person.isActive)) {
            return names.find(person => person.isActive).name
        }
        else return "friend"
    }

    const handleFetch = () => {
        setIsLoading(true);
        fetch('/api/cat/')
            .then(result => result.json())
            .then(result => {
                setCatData(result)
                setIsLoading(false)
                saveToLocalStorage(result)
            })
            .catch(() => {
                setErrorMessage("Unable to fetch cat");
                setIsLoading(false);
            });
        // setCatData(mockData)
    };

    useEffect(() => {
        if (savedCat.length === 0) {
            handleFetch()
        }
        if (isChanging) {
            handleFetch()
            changeActiveName()
        }
    }, [isChanging])

    return (
        <div className='funnyWish'>
            <div className='wish-and-button'>
                <p className='luck'>Good luck, {changeActiveName()}!</p>
                <button className='funnyWish-button' onClick={handleFetch}>
                    <img src={refreshButton} alt='refresh' />
                </button>
            </div>
            <div className='funnyWish-image--container'>
                {<img src={'https://cataas.com/' + catData.url} alt="cat" width="300" className='image' />}
            </div>
        </div>
    )
}

export default FunnyWish

// const mockData = { "tags": [], "createdAt": "2021-07-14T19:46:09.620Z", "updatedAt": "2022-10-11T07:52:32.538Z", "validated": true, "owner": "null", "file": "60ef3f0151a2ca0011c7455f.jpeg", "mimetype": "image/jpeg", "size": 456082, "_id": "zAHIB49ed9TPrZhQ", "url": "/cat/zAHIB49ed9TPrZhQ" }