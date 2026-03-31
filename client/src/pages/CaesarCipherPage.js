import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CaesarCipherPage.css';

function CaesarCipherPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Encryption state
  const [plaintext, setPlaintext] = useState('');
  const [encryptionShift, setEncryptionShift] = useState('3');
  const [encryptedResult, setEncryptedResult] = useState('');

  // Decryption with known key state
  const [ciphertext, setCiphertext] = useState('');
  const [decryptionShift, setDecryptionShift] = useState('3');
  const [decryptedResult, setDecryptedResult] = useState('');

  // Brute force state
  const [bruteforceCiphertext, setBruteforceCiphertext] = useState('');
  const [bruteforceResults, setBruteforceResults] = useState(null);
  const [bruteforceLoading, setBruteforceLoading] = useState(false);

  // Error state
  const [encryptError, setEncryptError] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [bruteforceError, setBruteforceError] = useState('');

  /**
   * Validate that text contains only alphabetic characters and spaces
   */
  const validateAlphabeticOnly = (text) => {
    const alphaOnlyPattern = /^[a-zA-Z\s]*$/;
    if (!alphaOnlyPattern.test(text)) {
      return {
        valid: false,
        error: 'Only alphabetic characters (A-Z) and spaces are allowed. Numbers and symbols are not permitted.'
      };
    }
    return { valid: true };
  };

  // Fetch algorithm info
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/caesar/info');
        setAlgorithmInfo(response.data);
      } catch (error) {
        console.error('Error fetching algorithm info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  // Encryption handler
  const handleEncrypt = async () => {
    setEncryptError('');
    
    if (!plaintext.trim()) {
      setEncryptError('Please enter text to encrypt');
      return;
    }

    // Validate input
    const validation = validateAlphabeticOnly(plaintext);
    if (!validation.valid) {
      setEncryptError(validation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/caesar/encrypt', {
        plaintext: plaintext,
        shift: parseInt(encryptionShift)
      });
      setEncryptedResult(response.data.encryptedText);
    } catch (error) {
      setEncryptError(error.response?.data?.error || 'Error encrypting: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Decryption handler
  const handleDecrypt = async () => {
    setDecryptError('');
    
    if (!ciphertext.trim()) {
      setDecryptError('Please enter text to decrypt');
      return;
    }

    // Validate input
    const validation = validateAlphabeticOnly(ciphertext);
    if (!validation.valid) {
      setDecryptError(validation.error);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/caesar/decrypt', {
        ciphertext: ciphertext,
        shift: parseInt(decryptionShift)
      });
      setDecryptedResult(response.data.decryptedText);
    } catch (error) {
      setDecryptError(error.response?.data?.error || 'Error decrypting: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Brute force handler
  const handleBruteForce = async () => {
    setBruteforceError('');
    
    if (!bruteforceCiphertext.trim()) {
      setBruteforceError('Please enter ciphertext');
      return;
    }

    // Validate input
    const validation = validateAlphabeticOnly(bruteforceCiphertext);
    if (!validation.valid) {
      setBruteforceError(validation.error);
      return;
    }

    try {
      setBruteforceLoading(true);
      const response = await axios.post('/api/caesar/bruteforce', {
        ciphertext: bruteforceCiphertext
      });
      setBruteforceResults(response.data);
    } catch (error) {
      setBruteforceError(error.response?.data?.error || 'Error in brute force: ' + error.message);
    } finally {
      setBruteforceLoading(false);
    }
  };

  return (
    <div className="caesar-page">
      {/* Header */}
      <div className="caesar-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="header-content">
          <h1>🔐 Caesar Cipher Algorithm</h1>
          <p>Learn and visualize the Caesar Cipher encryption and decryption</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          📚 Information
        </button>
        <button
          className={`tab-btn ${activeTab === 'encrypt' ? 'active' : ''}`}
          onClick={() => setActiveTab('encrypt')}
        >
          🔒 Encrypt
        </button>
        <button
          className={`tab-btn ${activeTab === 'decrypt' ? 'active' : ''}`}
          onClick={() => setActiveTab('decrypt')}
        >
          🔓 Decrypt
        </button>
        <button
          className={`tab-btn ${activeTab === 'bruteforce' ? 'active' : ''}`}
          onClick={() => setActiveTab('bruteforce')}
        >
          💥 Brute Force
        </button>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Information Tab */}
        {activeTab === 'info' && algorithmInfo && (
          <div className="tab-content info-tab">
            <div className="section">
              <h2>What is Caesar Cipher?</h2>
              <p>{algorithmInfo.notes.description}</p>
            </div>

            <div className="section">
              <h2>How It Works</h2>
              <ol className="steps">
                {algorithmInfo.notes.howestWorks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="section">
              <h2>Encryption Process</h2>
              <p>{algorithmInfo.notes.encryption}</p>
              <div className="example">
                <h4>Example (Shift = 3):</h4>
                <code>
                  A → D, B → E, C → F, ..., X → A, Y → B, Z → C<br />
                  Plain: "HELLO"<br />
                  Cipher: "KHOOR"
                </code>
              </div>
            </div>

            <div className="section">
              <h2>Decryption Process</h2>
              <p>{algorithmInfo.notes.decryption}</p>
              <p>Simply reverse the shift by shifting backward by the same amount.</p>
            </div>

            <div className="section">
              <h2>Brute Force Approach</h2>
              <p>{algorithmInfo.notes.bruteForceApproach}</p>
              <p>
                Since there are only 25 possible keys, we can try all of them and check which one produces readable English.
                The algorithm checks for:
              </p>
              <ul>
                <li>Common English words</li>
                <li>Vowel/consonant distribution</li>
                <li>Letter frequency analysis</li>
              </ul>
            </div>

            <div className="section">
              <h2>Limitations & Security</h2>
              <ul>
                {algorithmInfo.notes.limitations.map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Encryption Tab */}
        {activeTab === 'encrypt' && (
          <div className="tab-content encrypt-tab">
            <h2>Encrypt Text</h2>
            <div className="input-section">
              <div className="form-group">
                <label>Plain Text:</label>
                <textarea
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  placeholder="Enter text to encrypt... (alphabetic characters only)"
                  rows="4"
                />
              </div>

              {encryptError && (
                <div className="error-message">
                  ⚠️ {encryptError}
                </div>
              )}

              <div className="form-group">
                <label>Shift Value (Key): {encryptionShift}</label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={encryptionShift}
                  onChange={(e) => setEncryptionShift(e.target.value)}
                  className="slider"
                />
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={encryptionShift}
                  onChange={(e) => setEncryptionShift(e.target.value)}
                />
              </div>

              <button
                className="action-btn"
                onClick={handleEncrypt}
                disabled={loading}
              >
                {loading ? 'Encrypting...' : '🔒 Encrypt'}
              </button>
            </div>

            {encryptedResult && (
              <div className="result-section">
                <h3>Encrypted Result:</h3>
                <div className="result-box">
                  {encryptedResult}
                </div>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(encryptedResult);
                    alert('Copied to clipboard!');
                  }}
                >
                  📋 Copy Result
                </button>
              </div>
            )}
          </div>
        )}

        {/* Decryption Tab */}
        {activeTab === 'decrypt' && (
          <div className="tab-content decrypt-tab">
            <h2>Decrypt Text (Known Key)</h2>
            <div className="input-section">
              <div className="form-group">
                <label>Cipher Text:</label>
                <textarea
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  placeholder="Enter text to decrypt... (alphabetic characters only)"
                  rows="4"
                />
              </div>

              {decryptError && (
                <div className="error-message">
                  ⚠️ {decryptError}
                </div>
              )}

              <div className="form-group">
                <label>Shift Value (Key): {decryptionShift}</label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={decryptionShift}
                  onChange={(e) => setDecryptionShift(e.target.value)}
                  className="slider"
                />
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={decryptionShift}
                  onChange={(e) => setDecryptionShift(e.target.value)}
                />
              </div>

              <button
                className="action-btn"
                onClick={handleDecrypt}
                disabled={loading}
              >
                {loading ? 'Decrypting...' : '🔓 Decrypt'}
              </button>
            </div>

            {decryptedResult && (
              <div className="result-section">
                <h3>Decrypted Result:</h3>
                <div className="result-box">
                  {decryptedResult}
                </div>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(decryptedResult);
                    alert('Copied to clipboard!');
                  }}
                >
                  📋 Copy Result
                </button>
              </div>
            )}
          </div>
        )}

        {/* Brute Force Tab */}
        {activeTab === 'bruteforce' && (
          <div className="tab-content bruteforce-tab">
            <h2>Brute Force Attack</h2>
            <p className="info-text">
              Try all possible keys (0-25) to decrypt the text. The algorithm will display all 26 possible decryptions
              with their English likelihood scores based on letter frequency analysis.
            </p>

            <div className="input-section">
              <div className="form-group">
                <label>Cipher Text:</label>
                <textarea
                  value={bruteforceCiphertext}
                  onChange={(e) => setBruteforceCiphertext(e.target.value)}
                  placeholder="Enter encrypted text... (alphabetic characters only)"
                  rows="4"
                />
              </div>

              {bruteforceError && (
                <div className="error-message">
                  ⚠️ {bruteforceError}
                </div>
              )}

              <button
                className="action-btn bruteforce"
                onClick={handleBruteForce}
                disabled={bruteforceLoading}
              >
                {bruteforceLoading ? 'Attacking...' : '💥 Start Brute Force Attack'}
              </button>
            </div>

            {bruteforceResults && (
              <div className="results-section">
                <div className="all-results">
                  <h3>📊 All 26 Possible Decryptions</h3>
                  <div className="decryption-grid">
                    {bruteforceResults.allPossibleDecryptions.map((result, idx) => (
                      <div
                        key={idx}
                        className="decryption-card"
                      >
                        <div className="card-content">
                          <div className="key-display">
                            <span className="key-label">Key:</span>
                            <span className="key-value">{result.key}</span>
                          </div>
                          <div className="decryption-display">
                            <p className="decrypted-text">{result.decryptedText}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CaesarCipherPage;
