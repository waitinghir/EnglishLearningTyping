// 多益等級的英文句子資料庫
const sentences = [
    "The meeting has been postponed until next Monday.",
    "Please submit your report by the end of this week.",
    "The company is planning to expand its operations overseas.",
    "We need to review the budget before making any decisions.",
    "The new software update will improve system performance.",
    "All employees must attend the safety training session.",
    "The conference room is available for your presentation.",
    "Please contact the IT department for technical support.",
    "The quarterly sales report shows significant growth.",
    "We appreciate your prompt response to our inquiry."
];

// 語音合成設定
const synth = window.speechSynthesis;
let currentSentence = '';
let utterance = null;

// 使用配置文件中的設定
const GOOGLE_TTS_API_KEY = CONFIG.GOOGLE_TTS_API_KEY;
const GOOGLE_TTS_URL = CONFIG.GOOGLE_TTS_URL;
console.log('>>> GOOGLE_TTS_API_KEY = ' + GOOGLE_TTS_API_KEY);
console.log('>>> GOOGLE_TTS_URL = ' + GOOGLE_TTS_URL);
// DOM 元素
const playBtn = document.getElementById('playBtn');
const newSentenceBtn = document.getElementById('newSentenceBtn');
const userInput = document.getElementById('userInput');
const checkBtn = document.getElementById('checkBtn');
const feedback = document.getElementById('feedback');
const correction = document.getElementById('correction');

// 初始化
function init() {
    generateNewSentence();
    setupEventListeners();
}

// 設定事件監聽器
function setupEventListeners() {
    playBtn.addEventListener('click', playSentence);
    newSentenceBtn.addEventListener('click', generateNewSentence);
    checkBtn.addEventListener('click', checkAnswer);
}

// 產生新句子
function generateNewSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    // 清除所有顯示內容
    userInput.value = '';
    feedback.textContent = '';
    correction.textContent = '';
    feedback.className = '';
    
    // 清除所有原句顯示
    const originalSentenceDivs = document.querySelectorAll('.original-sentence');
    originalSentenceDivs.forEach(div => div.remove());
    
    // 清除建議修正
    correction.style.display = 'none';
}

// 播放句子
async function playSentence() {
    try {
        // 首先嘗試使用 Google TTS
        await playWithGoogleTTS();
    } catch (error) {
        console.log('Google TTS 失敗，使用備用方案');
        playWithWebSpeech();
    }
}

// 使用 Google TTS 播放
async function playWithGoogleTTS() {
    const request = {
        input: { text: currentSentence },
        voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-D',
            ssmlGender: 'MALE'
        },
        audioConfig: { audioEncoding: 'MP3' }
    };

    const response = await fetch(GOOGLE_TTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GOOGLE_TTS_API_KEY}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Google TTS API 請求失敗');
    }

    const data = await response.json();
    const audioContent = data.audioContent;
    
    // 播放音頻
    const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
    await audio.play();
}

// 使用 Web Speech API 作為備用方案
function playWithWebSpeech() {
    if (utterance) {
        synth.cancel();
    }
    
    utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
    const voices = synth.getVoices();
    const preferredVoices = ['Google US English', 'Microsoft David Desktop', 'Alex'];
 

    for (const voiceName of preferredVoices) {
        const voice = voices.find(v => v.name.includes(voiceName));
        if (voice) {
            utterance.voice = voice;
            break;
        }
    }
    
    synth.speak(utterance);
}

// 檢查答案
function checkAnswer() {
    const userAnswer = userInput.value.trim();
    const isCorrect = userAnswer.toLowerCase() === currentSentence.toLowerCase();
    
    // 顯示 correction 元素
    correction.style.display = 'block';
    
    if (isCorrect) {
        feedback.textContent = '恭喜！答案正確！';
        feedback.className = 'correct';
        correction.textContent = '';
    } else {
        feedback.textContent = '答案不正確，請再試一次。';
        feedback.className = 'incorrect';
        showCorrection(userAnswer);
    }
    
    // 顯示英文原句
    const originalSentenceDiv = document.createElement('div');
    originalSentenceDiv.className = 'original-sentence';
    originalSentenceDiv.textContent = `原句：${currentSentence}`;
    feedback.parentNode.insertBefore(originalSentenceDiv, feedback.nextSibling);
}

// 顯示修正建議
function showCorrection(userAnswer) {
    const correctWords = currentSentence.toLowerCase().split(' ');
    const userWords = userAnswer.toLowerCase().split(' ');
    let correctionText = '建議修正：\n';
    
    for (let i = 0; i < Math.max(correctWords.length, userWords.length); i++) {
        if (correctWords[i] !== userWords[i]) {
            correctionText += `位置 ${i + 1}: 應該是 "${correctWords[i]}"\n`;
        }
    }
    
    correction.textContent = correctionText;
}

// 初始化應用程式
init(); 