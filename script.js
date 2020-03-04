//録音したテキストデータ
let recText = "";

/**  音声認識部
 * 　参考:[https://qiita.com/hmmrjn/items/4b77a86030ed0071f548]
 */
//GooclechromeとFirefoxに対応
const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
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
		const transcript =
			'<p class="talk-section">' + event.results[eventi][0].transcript + "</p>";

		if (event.results[eventi].isFinal) {
			//会話が終了していたら会話を記録
			recText += event.results[eventi][0].transcript + "。";
			finalTranscript += transcript;
		} else {
			//途中なら会話の経過を変数に記録
			interimTranscript = transcript;
		}
	}
	//DOMに反映
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

/**
 *
 * @param {String} category 感情の分類 positive/negatibe/neutralの三分類
 * @param {Float32Array} point 点数(小数点)
 */
function createDiagResult(category, point) {
	//各点数と感情の分類に適したアドバイス
	//感情の分類[Positive/Negative/Neutral]をキーとする
	//点数による分類は20点ごとの5段階(各[0,20,40,60,80]以上かどうか)
	let advise = {
		Positive: [
			"ダメダメ",
			"悪くはないけども...",
			"まぁまぁいい感じ",
			"いいじゃん！",
			"最高！！"
		],
		Neutral: [
			"もう少し踏み込んでみてもいいんじゃないかな？",
			"えぇ",
			"普通すぎぃ！",
			"会話に感情を感じ取れない",
			"つまらない会話ぁ！"
		],
		Negative: [
			"ちょっと改善したほうがいいかも...",
			"このままだと嫌われかねない!",
			"うーんダメです...",
			"むしろ嫌われに行ってないか...?",
			"これでもかってほど会話の相性が悪いよ！"
		]
	};

	let pi = 4; //5段階目から始まる(配列の関係により5-1である4)
	for (let pointi = 80.0; pointi > 0.0; pointi -= 20.0) {
		//解析結果のpointが分類に当てはまれば、点数による分類添え字(pi)を決定
		//ダメなら段階を一つ下げる
		if (point > pointi) {
			break;
		}
		pi--;
	}

	console.log(advise[category][pi]);
	const resultDom = document.getElementById("result_container");
}

//=====================================
//以下、server.jsへのpost処理
//=====================================
const xhr = new XMLHttpRequest();
const tokenText = document.getElementById("token_text");
/*
/============
後でコメントアウトから開放
/=============
//tokenのtextボックスを見張る
tokenText.addEventListener("change", function() {
	const diagnoseDom = document.getElementById("diagnose_container");
	//何も入力されていないときは
	if (tokenText.value == "") {
		//ボタンを消去
		diagnoseDom.removeChild(document.getElementById("diagnose_bt"));
	}
	//何かしら入力されたら
	else {
		//ボタンを表示させる
		const diagnodeBt = document.createElement("button");
		diagnodeBt.id = "diagnose_bt";
		diagnodeBt.innerHTML = "会話を診断する"
		diagnoseDom.appendChild(diagnodeBt);


		//ボタンにPOSTのイベントリスナーを付与
		diagnodeBt.addEventListener("click", function() {
			xhr.open("POST", "https://api.ce-cotoha.com/api/dev/nlp/v1/sentiment/");
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.setRequestHeader(
				"Authorization",
				"Bearer "+tokenText.value
			);
			xhr.send("sentence=人生の春を謳歌しています");
			console.log("会話結果を送信しました。");
		});
	}
});
*/

/*=============================
後で消す
*==============================
*/

//ボタンを表示させる
const diagnodeBt = document.createElement("button");
const diagnoseDom = document.getElementById("diagnose_container");
diagnodeBt.id = "diagnose_bt";
diagnodeBt.innerHTML = "会話を診断する";
diagnoseDom.appendChild(diagnodeBt);

//ボタンにPOSTのイベントリスナーを付与
diagnodeBt.addEventListener("click", function() {
	xhr.open("POST", "https://api.ce-cotoha.com/api/dev/nlp/v1/sentiment");
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.setRequestHeader("Authorization", "Bearer " + tokenText.value);
	let requestJson = {};
	requestJson.sentence = recText
	console.log(requestJson);
	xhr.send(JSON.stringify(requestJson));
});
/*=============================ここまで*/

//レスポンスが返ってきたら
xhr.onreadystatechange = function() {
	if (this.readyState == 4) {
		const responseResult = JSON.parse(xhr.responseText || "null");
		createDiagResult(responseResult.result.sentiment,responseResult.result.score)
		console.log(responseResult);
	}
};
