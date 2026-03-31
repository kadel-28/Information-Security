/**
 * Caesar Cipher Algorithm
 * Shifts each character by a fixed number of positions in the alphabet
 */

class CaesarCipher {
  /**
   * Encrypt text using Caesar cipher with a given shift key
   * @param {string} text - Plain text to encrypt
   * @param {number} shift - Number of positions to shift (key)
   * @returns {string} - Encrypted text
   */
  static encrypt(text, shift) {
    let result = '';
    shift = shift % 26; // Normalize shift to 0-25

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Handle uppercase letters
      if (char >= 'A' && char <= 'Z') {
        const charPos = char.charCodeAt(0) - 'A'.charCodeAt(0);
        const newPos = ((charPos + shift) % 26 + 26) % 26; // Handle negative modulo
        result += String.fromCharCode(newPos + 'A'.charCodeAt(0));
      }
      // Handle lowercase letters
      else if (char >= 'a' && char <= 'z') {
        const charPos = char.charCodeAt(0) - 'a'.charCodeAt(0);
        const newPos = ((charPos + shift) % 26 + 26) % 26; // Handle negative modulo
        result += String.fromCharCode(newPos + 'a'.charCodeAt(0));
      }
      // Keep non-alphabetic characters as is
      else {
        result += char;
      }
    }

    return result;
  }

  /**
   * Decrypt text using Caesar cipher (reverse encryption)
   * @param {string} text - Encrypted text
   * @param {number} shift - Number of positions to shift (key)
   * @returns {string} - Decrypted text
   */
  static decrypt(text, shift) {
    // Decryption is just encryption with negative shift
    return this.encrypt(text, -shift);
  }

  /**
   * Brute force attack on Caesar cipher
   * Tries all 26 possible keys and returns results for each
   * @param {string} ciphertext - Encrypted text
   * @returns {Array} - Array of objects with key and decrypted text
   */
  static bruteForce(ciphertext) {
    const results = [];

    for (let key = 0; key < 26; key++) {
      const decryptedText = this.decrypt(ciphertext, key);
      results.push({
        key: key,
        decryptedText: decryptedText,
        isCorrect: false // Will be updated by user selection or algorithm
      });
    }

    return results;
  }

  /**
   * English letter frequency (%) based on large corpus analysis
   * Used for chi-squared frequency analysis
   */
  static get ENGLISH_FREQ() {
    return {
      'a': 8.167, 'b': 1.492, 'c': 2.782, 'd': 4.253, 'e': 12.702,
      'f': 2.228, 'g': 2.015, 'h': 6.094, 'i': 6.966, 'j': 0.153,
      'k': 0.772, 'l': 4.025, 'm': 2.406, 'n': 6.749, 'o': 7.507,
      'p': 1.929, 'q': 0.095, 'r': 5.987, 's': 6.327, 't': 9.056,
      'u': 2.758, 'v': 0.978, 'w': 2.360, 'x': 0.150, 'y': 1.974,
      'z': 0.074
    };
  }

  /**
   * Calculate Chi-Squared statistic for frequency analysis
   * Lower score = more likely to be English
   * This is the standard cryptanalysis method
   * @param {string} text - Text to analyze
   * @returns {number} - Chi-squared score (lower is better)
   */
  static calculateChiSquaredScore(text) {
    // Count letter frequencies
    const letterCount = {};
    let totalLetters = 0;

    text.toLowerCase().split('').forEach(char => {
      if (char >= 'a' && char <= 'z') {
        letterCount[char] = (letterCount[char] || 0) + 1;
        totalLetters++;
      }
    });

    // Handle empty text
    if (totalLetters === 0) return 999999;

    // Calculate chi-squared
    let chiSquared = 0;
    const englishFreq = this.ENGLISH_FREQ;

    for (let char = 'a'; char <= 'z'; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      const observed = (letterCount[char] || 0);
      const expected = (englishFreq[char] / 100) * totalLetters;
      
      if (expected > 0) {
        chiSquared += Math.pow(observed - expected, 2) / expected;
      }
    }

    return chiSquared;
  }

  /**
   * Check if text contains common English words (weighted scoring)
   * @param {string} text - Text to analyze
   * @returns {number} - Word score (higher is better)
   */
  static calculateWordScore(text) {
    // Most common English words (weighted by frequency)
    const wordWeights = {
      'the': 10, 'be': 8, 'to': 8, 'of': 7, 'and': 8, 'a': 6, 'in': 7, 'that': 7,
      'have': 6, 'i': 6, 'it': 6, 'for': 7, 'not': 6, 'on': 6, 'with': 6, 'he': 6,
      'as': 5, 'you': 6, 'do': 5, 'at': 5, 'this': 6, 'but': 6, 'his': 5, 'by': 5,
      'from': 6, 'they': 6, 'we': 5, 'say': 4, 'her': 5, 'she': 5, 'or': 5, 'an': 5,
      'will': 6, 'my': 5, 'one': 5, 'all': 5, 'would': 5, 'there': 6, 'their': 6,
      'what': 5, 'so': 5, 'up': 4, 'out': 5, 'if': 5, 'about': 5, 'who': 5,
      'get': 5, 'which': 5, 'go': 4, 'me': 4, 'when': 5, 'make': 5, 'can': 5,
      'like': 5, 'time': 5, 'no': 4, 'just': 5, 'him': 4, 'good': 5, 'know': 5
    };

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let wordScore = 0;
    let wordCount = words.length;

    words.forEach(word => {
      if (wordWeights[word]) {
        wordScore += wordWeights[word];
      }
    });

    // Normalize by word count
    if (wordCount > 0) {
      return wordScore / wordCount;
    }
    return 0;
  }

  /**
   * Calculate English likelihood score using multiple methods
   * Combines Chi-Squared frequency analysis + word detection
   * Lower chi-squared + higher word score = more likely English
   * @param {string} text - Text to analyze
   * @returns {number} - Composite score (higher is better)
   */
  static calculateEnglishScore(text) {
    // Chi-squared frequency analysis (lower is better, so we invert it)
    // Lower chi-squared = more likely English
    const chiSquaredScore = this.calculateChiSquaredScore(text);
    
    // Word detection bonus (higher is better)
    const wordScore = this.calculateWordScore(text);

    // Normalize chi-squared to 0-100 scale (inverted)
    // Typical English text has chi-squared around 300-500
    // Random gibberish has chi-squared around 1000-2000
    const normalizedChiSquared = Math.max(0, 100 - (chiSquaredScore / 20));

    // Combine scores: 70% frequency analysis, 30% word detection
    // This gives heavy weight to statistical frequency patterns
    const compositeScore = (normalizedChiSquared * 0.7) + (wordScore * 10 * 0.3);

    return Math.round(compositeScore * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Brute force with automatic key detection
   * @param {string} ciphertext - Encrypted text
   * @returns {object} - Contains all results and most likely decryption
   */
  static bruteForceWithDetection(ciphertext) {
    const allResults = this.bruteForce(ciphertext);
    let bestResult = allResults[0];
    let bestScore = this.calculateEnglishScore(allResults[0].decryptedText);

    for (let i = 1; i < allResults.length; i++) {
      const score = this.calculateEnglishScore(allResults[i].decryptedText);
      if (score > bestScore) {
        bestScore = score;
        bestResult = allResults[i];
      }
      allResults[i].englishScore = score;
    }

    allResults.forEach(result => {
      if (!result.englishScore) {
        result.englishScore = this.calculateEnglishScore(result.decryptedText);
      }
    });

    bestResult.isCorrect = true;

    return {
      allResults: allResults,
      mostLikelyKey: bestResult.key,
      mostLikelyDecryption: bestResult.decryptedText,
      mostLikelyScore: bestScore
    };
  }
}

module.exports = CaesarCipher;
