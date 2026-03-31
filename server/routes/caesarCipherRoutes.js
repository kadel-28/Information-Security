const express = require('express');
const router = express.Router();
const CaesarCipher = require('../algorithms/caesarCipher');

/**
 * Validate that text contains only alphabetic characters and spaces
 * @param {string} text - Text to validate
 * @returns {object} - { valid: boolean, error: string }
 */
function validateAlphabeticOnly(text) {
  // Allow only A-Z, a-z, and spaces
  const alphaOnlyPattern = /^[a-zA-Z\s]*$/;
  
  if (!alphaOnlyPattern.test(text)) {
    return {
      valid: false,
      error: 'Input must contain only alphabetic characters (A-Z) and spaces. Numbers and symbols are not allowed.'
    };
  }
  
  return { valid: true };
}

/**
 * POST /api/caesar/encrypt
 * Encrypt plaintext with Caesar cipher
 */
router.post('/encrypt', (req, res) => {
  try {
    const { plaintext, shift } = req.body;

    if (!plaintext || shift === undefined) {
      return res.status(400).json({
        error: 'plaintext and shift are required'
      });
    }

    // Validate input contains only alphabetic characters and spaces
    const validation = validateAlphabeticOnly(plaintext);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error
      });
    }

    const shiftNum = parseInt(shift);
    if (isNaN(shiftNum) || shiftNum < 0 || shiftNum > 25) {
      return res.status(400).json({
        error: 'shift must be a number between 0 and 25'
      });
    }

    const encrypted = CaesarCipher.encrypt(plaintext, shiftNum);

    res.json({
      originalText: plaintext,
      encryptedText: encrypted,
      shift: shiftNum,
      algorithm: 'Caesar Cipher'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/caesar/decrypt
 * Decrypt ciphertext with a known key
 */
router.post('/decrypt', (req, res) => {
  try {
    const { ciphertext, shift } = req.body;

    if (!ciphertext || shift === undefined) {
      return res.status(400).json({
        error: 'ciphertext and shift are required'
      });
    }

    // Validate input contains only alphabetic characters and spaces
    const validation = validateAlphabeticOnly(ciphertext);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error
      });
    }

    const shiftNum = parseInt(shift);
    if (isNaN(shiftNum) || shiftNum < 0 || shiftNum > 25) {
      return res.status(400).json({
        error: 'shift must be a number between 0 and 25'
      });
    }

    const decrypted = CaesarCipher.decrypt(ciphertext, shiftNum);

    res.json({
      encryptedText: ciphertext,
      decryptedText: decrypted,
      usedShift: shiftNum,
      algorithm: 'Caesar Cipher'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/caesar/bruteforce
 * Brute force attack - try all possible keys
 */
router.post('/bruteforce', (req, res) => {
  try {
    const { ciphertext } = req.body;

    if (!ciphertext) {
      return res.status(400).json({
        error: 'ciphertext is required'
      });
    }

    // Validate input contains only alphabetic characters and spaces
    const validation = validateAlphabeticOnly(ciphertext);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error
      });
    }

    const result = CaesarCipher.bruteForceWithDetection(ciphertext);

    res.json({
      encryptedText: ciphertext,
      allPossibleDecryptions: result.allResults,
      mostLikelyKey: result.mostLikelyKey,
      mostLikelyDecryption: result.mostLikelyDecryption,
      mostLikelyScore: result.mostLikelyScore,
      algorithm: 'Caesar Cipher - Brute Force Attack',
      explanation: 'All 26 possible keys tried. Results sorted by English word frequency and vowel distribution analysis.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/caesar/info
 * Get information about Caesar cipher algorithm
 */
router.get('/info', (req, res) => {
  res.json({
    name: 'Caesar Cipher',
    description: 'A simple substitution cipher that shifts each character by a fixed number of positions in the alphabet.',
    creator: 'Julius Caesar',
    keySpace: 25,
    notes: {
      description: 'The Caesar cipher is one of the simplest and most widely known encryption techniques. It shifts each letter in the plaintext by a certain number of places down or up the alphabet.',
      howestWorks: [
        'Pick a shift value (key) from 1 to 25',
        'For each letter in the plaintext, shift it forward by the key amount',
        'If a shift goes past Z, wrap around to A',
        'Non-alphabetic characters remain unchanged',
        'The recipient must know the key to decrypt'
      ],
      encryption: 'Each letter is replaced by another letter a fixed number of positions down the alphabet. For example, with a shift of 3: A→D, B→E, C→F, etc.',
      decryption: 'Reverse the process by shifting backward by the same amount.',
      limitations: [
        'Very weak encryption - only 25 possible keys',
        'Vulnerable to brute force attack',
        'Frequency analysis can break it easily',
        'No modern security applications'
      ],
      bruteForceApproach: 'Since there are only 25 possible keys (0-25), an attacker can try all of them and check which one produces readable English text. This is called brute force attack.'
    }
  });
});

module.exports = router;
