from flask import Flask, request, send_file, send_from_directory
from google.cloud import texttospeech
import io
import os

app = Flask(__name__, static_folder='.')

# 初始化 Google TTS 客戶端
client = texttospeech.TextToSpeechClient()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.json
        text = data['text']
        language_code = data['languageCode']
        voice_name = data['voiceName']
        speaking_rate = data['speakingRate']
        pitch = data['pitch']

        # 設定語音合成參數
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=voice_name
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=speaking_rate,
            pitch=pitch
        )

        # 執行語音合成
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        # 將音頻數據轉換為可發送的格式
        audio_content = response.audio_content
        return send_file(
            io.BytesIO(audio_content),
            mimetype='audio/mpeg',
            as_attachment=False
        )

    except Exception as e:
        print(">>> error = " + str(e))
        return str(e), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True) 