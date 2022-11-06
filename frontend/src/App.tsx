import React from 'react';
import { BrowserRouter,Route,Link, Routes } from "react-router-dom"
import logo from './logo.svg';
import './App.css';
import HomePage from './pages/index'
import NewProposalPage from './pages/newproposal'

function App() {
  return (
    <div className="App">
    	{/* <HomePage/> */}
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>} />
      			<Route path="/newproposal" element={<NewProposalPage/>} />
			</Routes>
		</BrowserRouter>
    </div>
  );
}

export default App;
