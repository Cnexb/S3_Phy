// Run: node scripts/test-topic-columns.cjs <path-to-reviewed-platform-uni-tracker.js>
// Does not access the network. Publish the platform tracker before this loader version.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const trackerFile=process.argv[2];
assert.ok(trackerFile,'Supply the reviewed platform tracker file; do not silently test a downloaded live version.');
let listener; const posts=[];
vm.runInNewContext(fs.readFileSync(trackerFile,'utf8'),{
 window:{addEventListener:(_,fn)=>listener=fn},sessionStorage:{getItem:()=>null,setItem:()=>{}},
 console:{log:()=>{},warn:()=>{},error:()=>{}},
 fetch:(url,options)=>{posts.push({url,body:JSON.parse(options.body)});return Promise.resolve({ok:true});}
});
listener({data:{type:'uniplus:session',userId:'offline-test',accessToken:'offline-token',subject:"PHY"}});
listener({data:{type:'uniplus:quizAnswer',subject:"PHY",section:"JPHG02.2",questionId:'offline-test',quizId:'offline-test',isCorrect:true}});
assert.equal(posts.length,1);
assert.ok(posts[0].url.endsWith('/phy_quiz_attempts'));
assert.equal(posts[0].body.topic,"JPHG02 Heat and internal energy");
assert.equal(posts[0].body.subtopic,"JPHG02.2 Energy transfer and Power");
let loaders=0;
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(['.git','node_modules','dist'].includes(e.name))continue;
  const f=path.join(dir,e.name);
  if(e.isDirectory()){walk(f);continue;}
  if(!f.endsWith('.html'))continue;
  const html=fs.readFileSync(f,'utf8');
  const refs=html.match(/https:\/\/uni-education-elearning\.pages\.dev\/tracker\/uni-tracker\.js\?[^"'<>\s]+/g)||[];
  for(const ref of refs){assert.ok(ref.endsWith('?v=20261013-topic-columns'),f+' has stale tracker');loaders++;}
 }
}
walk(root);
assert.ok(loaders>0,'No active tracker loaders found');
console.log('PASS PHY: POST topic columns and '+loaders+' pinned tracker loaders; no network writes.');
