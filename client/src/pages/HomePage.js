import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const algorithms = [
    {
      id: 1,
      name: 'Caesar Cipher',
      description: 'A simple substitution cipher that shifts each character by a fixed number of positions',
      difficulty: 'Easy',
      year: '100 BC',
      creator: 'Julius Caesar',
      path: '/caesar-cipher'
    }
    // More algorithms can be added here in the future
  ];

  return (
    <div className="home-page">
      <div className="header">
        <h1>🔐 Algorithm Visualizer</h1>
        <p>Learn and Understand Cryptography Algorithms</p>
      </div>

      <div className="algorithms-container">
        <h2>Available Algorithms</h2>
        <div className="algorithms-grid">
          {algorithms.map((algo) => (
            <div key={algo.id} className="algorithm-card">
              <div className="card-header">
                <h3>{algo.name}</h3>
                <span className="difficulty">{algo.difficulty}</span>
              </div>
              <p className="description">{algo.description}</p>
              <div className="info">
                <div className="info-item">
                  <span className="label">Creator:</span>
                  <span className="value">{algo.creator}</span>
                </div>
                <div className="info-item">
                  <span className="label">Year:</span>
                  <span className="value">{algo.year}</span>
                </div>
              </div>
              <button
                className="explore-btn"
                onClick={() => navigate(algo.path)}
              >
                Explore Algorithm →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="coming-soon">
        <h3>🚀 More Algorithms Coming Soon</h3>
        <p>RSA, AES, DES, Vigenère Cipher, and more...</p>
      </div>
    </div>
  );
}

export default HomePage;
