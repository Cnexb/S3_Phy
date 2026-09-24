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
assert.doesNotMatch(opticsQuiz, /uni-tracker|uniplus:quizAnswer|quizId/);

const quiz2App = read('quizzes/jpwm06-2/js/quizApp.js');
assert.match(quiz2App, /quizId:\s*QUIZ_META\.quizId/);
assert.match(quiz2App, /type:\s*"uniplus:quizAnswer"/);
assert.match(quiz2App, /questionId:\s*String\(q\.id\)/);
assert.match(quiz2App, /section:\s*q\.section/);
assert.match(quiz2App, /reportPhyAttempt/);
assert.doesNotMatch(quiz2App, /embedPageUrl/);

const quiz2Data = read('quizzes/jpwm06-2/js/quizData.js');
assert.match(quiz2Data, /quizId:\s*"phy-jpwm06-2"/);

const quiz1Ids = [...quizData.matchAll(/id:\s*"(jpwm06-[^"]+)"/g)].map((m) => m[1]);
const quiz2Ids = [...quiz2Data.matchAll(/id:\s*"(jpwm06-[^"]+)"/g)].map((m) => m[1]);
assert.ok(quiz1Ids.length >= 4, 'JPWM06 quiz 1 needs question ids');
assert.ok(quiz2Ids.length >= 4, 'JPWM06 quiz 2 needs question ids');
assert.equal(new Set(quiz1Ids).size, quiz1Ids.length, 'JPWM06 quiz 1 question ids must be unique');
assert.equal(new Set(quiz2Ids).size, quiz2Ids.length, 'JPWM06 quiz 2 question ids must be unique');
for (const id of quiz2Ids) {
  assert.ok(!quiz1Ids.includes(id), `question id ${id} collides with quiz 1`);
}
assert.equal([...quiz2Data.matchAll(/section:\s*"JPWM06\./g)].length, quiz2Ids.length, 'every quiz 2 item needs a JPWM06 subtopic section');

const opticsQuiz2 = read('src/worksheets/opticsCh3Quiz2.js');
assert.match(opticsQuiz2, /embedPageUrl\(`jpwm06-quiz-2\/quiz\.html/);
assert.match(opticsQuiz2, /s3phy:lang/);
assert.doesNotMatch(opticsQuiz2, /uni-tracker|uniplus:quizAnswer|quizId/);

const opticsHub = read('src/strands/opticsHub.js');
assert.match(opticsHub, /createOpticsCh3Quiz2/);
assert.match(opticsHub, /jpwm06-2/);

const jphg01Quiz3App = read('quizzes/jphg01-3/js/quizApp.js');
assert.match(jphg01Quiz3App, /quizId:\s*QUIZ_META\.quizId/);
assert.match(jphg01Quiz3App, /type:\s*"uniplus:quizAnswer"/);
assert.match(jphg01Quiz3App, /questionId:\s*String\(q\.id\)/);
assert.match(jphg01Quiz3App, /section:\s*q\.section/);
assert.match(jphg01Quiz3App, /reportPhyAttempt/);
assert.match(jphg01Quiz3App, /window\.parent\.postMessage\(payload, "\*"\)/);
assert.doesNotMatch(jphg01Quiz3App, /embedPageUrl/);

const jphg01Quiz3Data = read('quizzes/jphg01-3/js/quizData.js');
assert.match(jphg01Quiz3Data, /quizId:\s*"phy-jphg01-3"/);
assert.match(jphg01Quiz3Data, /subject:\s*"PHY"/);

const jphg01Quiz1Data = read('quizzes/heat-ch1/js/quizData.js');
const jphg01Quiz2Data = read('quizzes/jphg01-2/js/quizData.js');
const jphg01Quiz1Ids = [...jphg01Quiz1Data.matchAll(/id:\s*"(jphg01-[^"]+)"/g)].map((m) => m[1]);
const jphg01Quiz2Ids = [...jphg01Quiz2Data.matchAll(/id:\s*"(jphg01-[^"]+)"/g)].map((m) => m[1]);
const jphg01Quiz3Ids = [...jphg01Quiz3Data.matchAll(/id:\s*"(jphg01-3-[^"]+)"/g)].map((m) => m[1]);
assert.deepEqual(jphg01Quiz3Ids, ['jphg01-3-1', 'jphg01-3-2', 'jphg01-3-3']);
assert.equal(new Set(jphg01Quiz3Ids).size, jphg01Quiz3Ids.length);
for (const id of jphg01Quiz3Ids) {
  assert.ok(!jphg01Quiz1Ids.includes(id), `question id ${id} collides with quiz 1`);
  assert.ok(!jphg01Quiz2Ids.includes(id), `question id ${id} collides with quiz 2`);
}
assert.equal([...jphg01Quiz3Data.matchAll(/section:\s*"JPHG01\./g)].length, jphg01Quiz3Ids.length);

const heatQuiz3 = read('src/worksheets/heatCh1Quiz3.js');
assert.match(heatQuiz3, /embedPageUrl\(`jphg01-quiz-3\/quiz\.html/);
assert.match(heatQuiz3, /s3phy:lang/);
assert.doesNotMatch(heatQuiz3, /uni-tracker|uniplus:quizAnswer|quizId/);

const heatHub = read('src/strands/heatHub.js');
assert.match(heatHub, /createHeatCh1Quiz3/);
assert.match(heatHub, /jphg01-3/);

console.log('ok  embed loop fix leaves tracker / quizId wiring untouched');
console.log('ok  JPWM06 quiz 1 and quiz 2 post distinct quizId and questionId values');
console.log('ok  JPHG01 quiz 3 posts phy-jphg01-3 with distinct question ids');
