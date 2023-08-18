var inputTxtEle = document.getElementById("input-text");
var checkEmotionButtonEle = document.getElementById("sentiment-btn");
var resetBtnEle = document.getElementById("reset-btn");
var checkEmotionResultEle = document.getElementById("sentiment-result");
var checkEmotionKeywordEle = document.getElementById("sentiment-keywords");
var checkEmotionEmojiEle = document.getElementById("sentiment-emoji");

resetBtnEle.addEventListener("click", function() {
    inputTxtEle.value = "";
    checkEmotionResultEle.style.display = "none";
});

checkEmotionButtonEle.addEventListener("click", function() {
    var inputText = inputTxtEle.value;
    if (!inputText) {
        alert("Please enter text.");
        return;
    }
    var inputURIEncodeText = "text=" + encodeURIComponent(inputText);
    getKeywords(inputURIEncodeText);
});

function getKeywords(text) {
    var allKeywords = [];

    var xhr = getXHRRequest('keywords');
    xhr.addEventListener('readystatechange', function () {
	    if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText); 

            if (response.result_code === "200") {
                allKeywords = getAllKeyWordsArr(response.keywords);
            }
            else {
                alert("Keywords: something went wrong");
            }

            getSentiments(text, allKeywords);
	    }
    });
    xhr.send(text);
}

function getSentiments(text, keywords) {
    let checkedEmotion = "";
    let emotionScores = {};
    var xhr = getXHRRequest('sentiments');
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            var response = JSON.parse(this.responseText); 

            if (response.result_code === "200") {
                emotionScores = response.emotion_scores;
                checkedEmotion = getTextEmotion(response.emotion_scores);
            }
            else {
                alert("Sentiments: something went wrong");
            }
            renderChart(emotionScores);
            showResult(checkedEmotion, keywords);
        }
    });
    xhr.send(text);
}

function showResult(emotion = "", keywords = []) {
    emotion = (emotion === "anger") ? "angry" : emotion;
    checkEmotionResultEle.style.display = "block";
    checkEmotionKeywordEle.innerHTML = arrToString(keywords);
    checkEmotionEmojiEle.innerHTML = `
        <h2>${emotion}</h2>
        <img src="images/${emotion}.gif" alt="gif ${emotion}..." title="${emotion}">
    `;
}

function getXHRRequest(type) {
    const xhr = new XMLHttpRequest();
    
    xhr.open(APIEnvironment[type].reqType, APIEnvironment[type].reqURL);
    xhr.setRequestHeader('content-type', APIEnvironment[type].headerContentType);
    xhr.setRequestHeader('X-RapidAPI-Key', APIEnvironment.rapidAPIKey);
    xhr.setRequestHeader('X-RapidAPI-Host', APIEnvironment[type].headerHost);
    return xhr;
}

function getAllKeyWordsArr(keywords) {
    const words = [];
    for (var i=0; i< keywords.length; ++i){
        words.push(keywords[i].word);
    }
    return words;
}

function getTextEmotion(moodScores) {
    let emotion = "";
    let arr = Object.values(moodScores);
    let maxScore = Math.max(...arr);

    for (var key in moodScores) {
        if (moodScores[key] === maxScore) {
            emotion = key;
        }
    }
    return emotion;
}

function arrToString(arr) {
    let str = "";
    
    arr.forEach((w) => {
        str += w + ", ";
    });
    str = str.slice(0, str.length - 2);
    return str;
}
