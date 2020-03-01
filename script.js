/**  音声認識部
 * 　参考:[https://qiita.com/hmmrjn/items/4b77a86030ed0071f548]
 */
//GooclechromeとFirefoxに対応
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
  const recognition = new SpeechRecognition();

	//言語指定：日本語
	recognition.lang = 'ja-JP';
	//認識途中のデータ取得
	recognition.interimResults = true;
	//認識し続ける
	recognition.continuous = true;


	let finalTranscript = "";
  recognition.onresult = (event) => {
		let interimTranscript = "";
		for (let eventi = event.resultIndex; eventi < event.results.length; eventi++) {
			let transcript = event.results[eventi][0].transcript;
			if (event.results[eventi].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript = transcript;
      }
		}
		document.getElementById("rec_text").innerHTML = finalTranscript + interimTranscript;
  }

  recognition.start();
