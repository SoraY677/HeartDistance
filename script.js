//録音したテキストデータ
let recText = "";

/**  音声認識の設定
 * 　参考:[https://qiita.com/hmmrjn/items/4b77a86030ed0071f548]
 */
//GooclechromeとFirefoxに対応
const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "ja-JP"; //言語指定：日本語
recognition.interimResults = true; //認識途中のデータ取得
recognition.continuous = true; //認識し続ける

let talkResult = ""; //既に終わった会話のまとめ
let talkCount = 0;
recognition.onresult = event => {
	let currentTalk = "";
	recText = "";
	for (
		let eventi = event.resultIndex;
		eventi < event.results.length;
		eventi++
	) {
		//DOM用に会話をパース
		let talkParse = '<p class="talk-section ';
		talkParse += talkCount % 2 == 0 ? "left" : "right"; //偶数は左寄り、奇数は右寄りにする
		talkParse += '">';
		talkParse += event.results[eventi][0].transcript + "</p>"; //DOM向けにパースしたもの

		if (event.results[eventi].isFinal) {
			//会話が終了していたら会話を記録
			recText += event.results[eventi][0].transcript + "。";
			talkResult = talkParse + talkResult;
			talkCount++;
		} else {
			//途中なら会話の経過を変数に記録
			currentTalk = talkParse;
		}
	}
	//DOMに反映
	document.getElementById("rec_text").innerHTML = currentTalk + talkResult;
};

//=====================================
//以下、DOM系統
//=====================================
//cssの".active"を付与する場合
const activeClass = "active";

/**
 * RECボタンの設定
 */
const recBt = document.getElementById("rec_bt");
const recState = document.getElementById("rec_state_text");
recState.innerText = "録音準備完了";
recBt.addEventListener("click", function() {
	//押されていなかった場合(デフォルト)
	if (!recBt.classList.contains(activeClass)) {
		//録音開始
		recBt.classList.add(activeClass);
		recognition.start();
		recState.innerText = "録音中";
	}
	//押されていた場合
	else {
		//録音停止
		recBt.classList.remove(activeClass);
		recognition.stop();
		recState.innerText = "録音準備完了";
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

const diagnoseBt = document.getElementById("diagnose_bt");

/**
 * clientIdとClientSecretそれぞれのテキストボックスの入力を監視し、両方が入力されていればボタンを出現させる
 */
const clientId = document.getElementById("client_id");
const clientSecret = document.getElementById("client_secret");

const diagAtention = document.getElementById("diag_caution");
//ボタンにPOSTのイベントリスナーを付与
diagnoseBt.addEventListener("click", function() {
	if (clientId.value != "" && clientSecret.value != "" && recText != "") {
		requestAPIKey();
		diagAtention.classList.add("after-materialize")
	}
	else{
		diagAtention.classList.remove("after-materialize")
	}
});

//=====================================
//以下、COTOHA APIへのリクエスト処理
//=====================================
//APIKeyを取得するためのHTTPリクエスト
const apikeyXhr = new XMLHttpRequest();

function requestAPIKey() {
	apikeyXhr.open("POST", "https://api.ce-cotoha.com/v1/oauth/accesstokens");
	apikeyXhr.setRequestHeader("Content-Type", "application/json");
	let requestJson = {};
	requestJson.grantType = "client_credentials";
	requestJson.clientId = clientId.value;
	requestJson.clientSecret = clientSecret.value;
	apikeyXhr.send(JSON.stringify(requestJson));
}

apikeyXhr.onreadystatechange = function() {
	//レスポンス取得完了後
	if (this.readyState == 4) {
		const responseResult = JSON.parse(apikeyXhr.responseText || false);
		{
			//responseが正常ならば
			if (responseResult != false) {
				requestAnalisys(responseResult.access_token);
			}
		}
	}
};

//感情分析するためのHTTPリクエスト
const analisysXhr = new XMLHttpRequest();

function requestAnalisys(token) {
	analisysXhr.open(
		"POST",
		"https://api.ce-cotoha.com/api/dev/nlp/v1/sentiment"
	);
	analisysXhr.setRequestHeader(
		"Content-Type",
		"application/json;charset=UTF-8"
	);
	analisysXhr.setRequestHeader("Authorization", "Bearer " + token);
	let requestJson = {};
	requestJson.sentence = recText;
	analisysXhr.send(JSON.stringify(requestJson));
}

//レスポンスが返ってきたら
analisysXhr.onreadystatechange = function() {
	if (this.readyState == 4) {
		const responseResult = JSON.parse(analisysXhr.responseText || false);
		if (responseResult != false) {
			console.log(responseResult);
		}
	}
};

//ボタンを表示させる
const diagnoseDom = document.getElementById("diagnose_container");

/*=============================ここまで*/
