/**  音声認識部
 * 　参考:[https://qiita.com/hmmrjn/items/4b77a86030ed0071f548]
 */
//GooclechromeとFirefoxに対応
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const recognition = new SpeechRecognition();

//言語指定：日本語
recognition.lang = "ja-JP";
//認識途中のデータ取得
recognition.interimResults = true;
//認識し続ける
recognition.continuous = true;

let finalTranscript = "";
recognition.onresult = event => {
	let interimTranscript = "";
	for (
		let eventi = event.resultIndex;
		eventi < event.results.length;
		eventi++
	) {
		let transcript = "<p class=\"talk-section\">" + event.results[eventi][0].transcript + "</p>";
		if (event.results[eventi].isFinal) {
			finalTranscript += transcript;
		} else {
			interimTranscript = transcript;
		}
	}
	document.getElementById("rec_text").innerHTML =
		finalTranscript + interimTranscript;
};

//=====================================
//以下、DOM系統
//=====================================
//cssの".active"を付与する場合
const activeClass = "active";

/**
 * RECボタンの設定
 */
let recBt = document.getElementById("rec_bt");

recBt.addEventListener("click", function() {
	//押されていなかった場合(デフォルト)
	if (!recBt.classList.contains(activeClass)) {
		//録音開始
		recBt.classList.add(activeClass);
		recognition.start();
	}
	//押されていた場合
	else {
		//録音停止
		recBt.classList.remove(activeClass);
		recognition.stop();
	}
});

//=====================================
//以下、APIへのリクエスト
//=====================================

/**
 * 
 */