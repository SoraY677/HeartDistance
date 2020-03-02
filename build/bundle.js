/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**  音声認識部\n * 　参考:[https://qiita.com/hmmrjn/items/4b77a86030ed0071f548]\n */\n//GooclechromeとFirefoxに対応\nvar SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;\nvar recognition = new SpeechRecognition(); //言語指定：日本語\n\nrecognition.lang = \"ja-JP\"; //認識途中のデータ取得\n\nrecognition.interimResults = true; //認識し続ける\n\nrecognition.continuous = true;\nvar finalTranscript = \"\";\n\nrecognition.onresult = function (event) {\n  var interimTranscript = \"\";\n\n  for (var eventi = event.resultIndex; eventi < event.results.length; eventi++) {\n    var transcript = \"<p class=\\\"talk-section\\\">\" + event.results[eventi][0].transcript + \"</p>\";\n\n    if (event.results[eventi].isFinal) {\n      finalTranscript += transcript;\n    } else {\n      interimTranscript = transcript;\n    }\n  }\n\n  document.getElementById(\"rec_text\").innerHTML = finalTranscript + interimTranscript;\n}; //=====================================\n//以下、DOM系統\n//=====================================\n//cssの\".active\"を付与する場合\n\n\nvar activeClass = \"active\";\n/**\n * RECボタンの設定\n */\n\nvar recBt = document.getElementById(\"rec_bt\");\nrecBt.addEventListener(\"click\", function () {\n  //押されていなかった場合(デフォルト)\n  if (!recBt.classList.contains(activeClass)) {\n    //録音開始\n    recBt.classList.add(activeClass);\n    recognition.start();\n  } //押されていた場合\n  else {\n      //録音停止\n      recBt.classList.remove(activeClass);\n      recognition.stop();\n    }\n}); //=====================================\n//以下、APIへのリクエスト\n//=====================================\n\n/**\n * \n */\n\nconsole.log(\"vCAkJ2JjRGQPZfGD800OjFNYfzRJPTGX\"); // let options = {\n// \turl: 'https://www.sejuku.net/blog/sample',\n// \tmethod: 'POST',\n// \tform: {\"name\":\"太郎\"}\n// }\n\n//# sourceURL=webpack:///./script.js?");

/***/ }),

/***/ 0:
/*!*************************!*\
  !*** multi ./script.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./script.js */\"./script.js\");\n\n\n//# sourceURL=webpack:///multi_./script.js?");

/***/ })

/******/ });