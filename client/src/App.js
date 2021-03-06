import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

import './App.css'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Landing from './components/layout/Landing.jsx'
import Login from './components/auth/Login'
import Register from './components/auth/Register'


class App extends Component {
  render() {
    return (
      <Provider store={ store }>
      <Router>
        <div className="App">
          <Navbar/>
          <Route path="/" exact component={Landing} />
          <div className="container">
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </div>
          <Footer/>
        </div>
      </Router>
      </Provider>
    )
  }
}

export default App
