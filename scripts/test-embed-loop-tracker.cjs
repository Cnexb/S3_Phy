/**
 * Embed-loop fix must not change UniPlus tracker wiring.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const index = read('index.html');
assert.match(index, /uni-education-elearning\.pages\.dev\/tracker\/uni-tracker\.js\?v=2/);

const quizApp = read('quizzes/optics-ch3/js/quizApp.js');
assert.match(quizApp, /quizId:\s*QUIZ_META\.quizId/);
assert.doesNotMatch(quizApp, /embedPageUrl/);

const quizData = read('quizzes/optics-ch3/js/quizData.js');
assert.match(quizData, /quizId:\s*"phy-jpwm06"/);

const iframeFactory = read('src/tools/createLabIframe.js');
assert.match(iframeFactory, /s3phy:lang/);
assert.doesNotMatch(iframeFactory, /uni-tracker|uniplus:quizAnswer|quizId/);

const embed = read('src/tools/embedPageUrl.js');
assert.doesNotMatch(embed, /uni-tracker|uniplus:quizAnswer|quizId|postMessage/);

const main = read('src/main.js');
assert.match(main, /function isHubEntryPath/);
assert.doesNotMatch(main, /uni-tracker|quizId/);

const opticsQuiz = read('src/worksheets/opticsCh3Quiz.js');
assert.match(opticsQuiz, /embedPageUrl\(`optics-ch3-quiz\/quiz\.html/);
assert.match(opticsQuiz, /s3phy:lang/);

console.log('ok  embed loop fix leaves tracker / quizId wiring untouched');
