import counterReducer from './reducer';
import { createStore } from 'redux';
import React from 'react'
import ReactDOM from 'react-dom/client'

const store = createStore(counterReducer)

const App = () => {
   const ratings = store.getState();
  return(
    <>
        <div style={{display: 'flex', flexDirection: 'row' }}>
            <button onClick={() => store.dispatch({ type: 'GOOD' })}> good </button>
            <button onClick={() => store.dispatch({ type: 'OK' })}> ok </button>
            <button onClick={() => store.dispatch({ type: 'BAD' })}> bad </button>
            <button onClick={() => store.dispatch({ type: 'ZERO' })}> reset stats </button>
        </div>
        <p>good {ratings.good} </p>
        <p>ok {ratings.ok} </p>
        <p>bad {ratings.bad} </p>

    </>
    

  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)