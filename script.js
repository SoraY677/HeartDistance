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
 * 感情の分類と点数からDOMの表示を変更する
 * @param {String} category 感情の分類 positive/negatibe/neutralの三分類
 * @param {Float32Array} point 点数(小数点)
 */
function createDiagResult(category, point, phraseArray) {
	//各点数と感情の分類に適したアドバイス
	//感情の分類[Positive/Negative/Neutral]をキーとする
	//点数による分類は20点ごとの5段階(各[0,20,40,60,80]以上かどうか)
	let advice = {
		Positive: [
			"会話に多少盛り上がりが見えます。ですが、まだまだ距離は遠いようです。もっと自分に素直に発言してみるといいかもしれません",
			"会話に盛り上がりがしっかりと見れます！気になるあの子と距離は近いです。あと一歩！",
			"会話になかなかの盛り上がりが見えます。気になるあの子との距離がかなり近いです！",
			"かなり会話が盛り上がっており、かなり近い距離にあります！素晴らしい！",
			"会話の盛り上がりが素晴らしいです！心の距離はもはやとなり合わせといっても過言ではないでしょう！"
		],
		Neutral: [
			"会話にあまり盛り上がりが見えず、業務連絡のようになってしまっていますね...。",
			"会話に心がないように思えます。もっと相手が楽しくなるような話題を積極的に振ってみましょう！",
			"会話への感情移入があまりなく、とても残念です。相手に合わせて話題を振ってみましょう。",
			"もっと自分を開放していいように感じます。趣味などの話を恐れずにだして相手の警戒心を解くことを心がけましょう。",
			"会話の内容が普通すぎて、測定が不可能です...。"
		],
		Negative: [
			"ちょっと改善したほうがいいかもしれないです。会話においてマイナスとなる部分が少し見られます。",
			"このままだと嫌われかねないです！もっと相手の事を考えて発言してみましょう。",
			"もしかしたら相手に嫌われているかもしれません。距離を自分から少しとってみてはいかがでしょうか。",
			"むしろ嫌われに行ってるのではと疑っているほど会話からマイナスの感情が伺えました。",
			"率直に申し上げますと...気になるあの子はあきらめた方がいいかもしれません...。"
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

	// カテゴリー分けと点数から結果の画像と分類を決定
	let imgNum = null;
	let parseCategory = "";
	switch (category) {
		case "Positive":
			parseCategory = "いい感じ！";
			if (point >= 80) {
				imgNum = 1;
			} else if (point >= 60) {
				imgNum = 2;
			} else {
				imgNum = 3;
			}
			break;
		case "Neutral":
			parseCategory = "微妙かな";
			imgNum = 4;
			break;
		case "Negative":
			parseCategory = "うーん...";
			imgNum = 5;
			break;
	}

	/*アドバイスをDOMに反映*/
	//
	document.getElementById("result_img").src = "img/grade/" + imgNum + ".png";
	document.getElementById("result_category").innerText = parseCategory;
	document.getElementById("result_point").innerText =
		parseCategory + "度：" + Math.round(point * 100) + "点";
	document.getElementById("result_advice").innerText = advice[category][pi];
	document.getElementById("result_phrase").innerText =
		"抽出された感情にまつわる単語:" + phraseArray.join(" , ");
	//デフォルト文を消し、結果文を表示
	document.getElementById("result_default").classList.add("exit-erase");
	document.getElementById("result_response").classList.remove("exit-erase");
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
		diagAtention.classList.add("after-materialize");
	} else {
		diagAtention.classList.remove("after-materialize");
	}
});

document
	.getElementById("one_more_game_bt")
	.addEventListener("click", function() {
		location.reload();
		scrollTo(0, 0);
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
			createDiagResult(
				responseResult.result.sentiment,
				responseResult.result.score,
				responseResult.result.emotional_phrase
			);
		}
	}
};
