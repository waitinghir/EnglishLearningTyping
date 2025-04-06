# 英文聽打練習

這是一個幫助學習英語聽力和打字的網頁應用。

## 設定步驟

1. 複製配置文件模板：
   ```bash
   cp js/config.example.js js/config.js
   ```

2. 編輯 `js/config.js`，填入你的 Google TTS API Key：
   ```javascript
   const CONFIG = {
       GOOGLE_TTS_API_KEY: '你的 API Key',
       GOOGLE_TTS_URL: 'https://texttospeech.googleapis.com/v1/text:synthesize'
   };
   ```

3. 使用本地伺服器運行專案：
   ```bash
   python3 -m http.server 8000
   ```

4. 在瀏覽器中訪問：`http://localhost:8000`

## 注意事項

- 不要將包含實際 API Key 的 `config.js` 提交到 Git 倉庫
- 如果需要更新配置模板，請編輯 `config.example.js` 