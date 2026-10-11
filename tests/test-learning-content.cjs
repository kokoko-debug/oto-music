const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=require('./source.cjs');
const scripts=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach((script,i)=>new vm.Script(script,{filename:`learning-script-${i}.js`}));
const practiceScript=scripts.find(script=>script.includes(' const intervals='));
const bankSource=practiceScript.slice(practiceScript.indexOf(' const intervals='),practiceScript.indexOf(' const saved='));
const sandbox={};
vm.runInNewContext(bankSource+';this.bank={intervals,semitoneQuestions,chords,all};',sandbox);
const {intervals,semitoneQuestions,chords,all}=sandbox.bank;
assert.equal(new Set(all.map(q=>q.id)).size,all.length);
const correctDistances={'長2度':2,'短3度':3,'長3度':4,'完全4度':5,'完全5度':7};
for(const q of intervals){
 assert.equal(q.notes[1][2]-q.notes[0][2],correctDistances[q.choices[q.answer]],q.id);
 assert.equal(q.notes[1][3]-q.notes[0][3]+1,Number(q.choices[q.answer].match(/\d/)[0]),q.id);
}
for(const q of semitoneQuestions){
 assert.equal(q.choices[q.answer],`半音${q.notes[1][2]-q.notes[0][2]}個`,q.id);
 assert.equal(new Set(q.choices).size,q.choices.length,q.id);
}
for(const q of chords){
 const expected=q.symbol.endsWith('m')?[0,3,7]:[0,4,7];
 assert.deepEqual(Array.from(q.notes,n=>n[2]-q.notes[0][2]),expected,q.id);
 assert.equal(q.choices[q.answer],q.notes.map(n=>n[1]).join('・'),q.id);
 assert.deepEqual(Array.from(q.notes,n=>n[3]-q.notes[0][3]),[0,2,4],q.id);
}
assert.ok(chords.some(q=>q.symbol==='F')&&chords.some(q=>q.symbol==='Fm'));
console.log(`PASS: syntax and ${all.length} question identities, interval degrees/distances, chord spelling and answers.`);
