const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=require('./source.cjs');
const scripts=[...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach((script,i)=>new vm.Script(script,{filename:`learning-script-${i}.js`}));
const practiceScript=scripts.find(script=>script.includes(' const intervals='));
const bankSource=practiceScript.slice(practiceScript.indexOf(' const intervals='),practiceScript.indexOf(' const saved='));
const sandbox={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../src/theory.js'),'utf8'),sandbox);
vm.runInNewContext(bankSource+';this.bank={intervals,semitoneQuestions,chords,chromaticIntervals,chromaticSemitones,diminishedChords,seventhChords,all,practiceBank};',sandbox);
const {intervals,semitoneQuestions,chords,chromaticIntervals,chromaticSemitones,diminishedChords,seventhChords,all,practiceBank}=sandbox.bank;
assert.equal(new Set(all.map(q=>q.id)).size,all.length);
const base=[0,2,4,5,7,9,11,12];
for(const q of [...intervals,...chromaticIntervals]){
 const answer=q.choices[q.answer],m=/^(完全|長|短|増|減)([1-8])度$/.exec(answer);assert.ok(m,q.id);
 const degree=Number(m[2]),perfect=[1,4,5,8].includes(degree),offset=({完全:0,長:0,短:-1,増:1,減:perfect?-1:-2})[m[1]];
 assert.equal(q.notes[1][2]-q.notes[0][2],base[degree-1]+offset,q.id);
 assert.equal(q.notes[1][3]-q.notes[0][3]+1,degree,q.id);
 assert.equal(new Set(q.choices).size,4,q.id);
}
for(const q of [...semitoneQuestions,...chromaticSemitones]){
 assert.equal(q.choices[q.answer],`半音${q.notes[1][2]-q.notes[0][2]}個`,q.id);
 assert.equal(new Set(q.choices).size,q.choices.length,q.id);
}
const formulas={major:[0,4,7],minor:[0,3,7],dim:[0,3,6],aug:[0,4,8],maj7:[0,4,7,11],dom7:[0,4,7,10],min7:[0,3,7,10],'half-dim':[0,3,6,10],dim7:[0,3,6,9],'min-maj7':[0,3,7,11],aug7:[0,4,8,10]};
for(const q of [...chords,...diminishedChords,...seventhChords]){
 assert.deepEqual(Array.from(q.notes,n=>n[2]-q.notes[0][2]),formulas[q.chordType],q.id);
 assert.equal(q.choices[q.answer],q.notes.map(n=>n[1]).join('・'),q.id);
 assert.deepEqual(Array.from(q.notes,n=>n[3]-q.notes[0][3]),q.scope==='sevenths'?[0,2,4,6]:[0,2,4],q.id);
 assert.equal(new Set(q.choices).size,4,q.id);
}
assert.equal(chords.length,24);assert.equal(diminishedChords.length,24);assert.equal(seventhChords.length,84);
assert.equal(intervals.length,84);assert.equal(semitoneQuestions.length,12);assert.equal(chromaticIntervals.length,98);assert.equal(chromaticSemitones.length,14);
for(const group of ['triads','diminished','sevenths']){
 const bank=practiceBank({page:'chord',chordGroup:group,roots:'all'});assert.equal(bank.length,group==='sevenths'?84:24);
 const c=practiceBank({page:'chord',chordGroup:group,roots:'C'});assert.equal(c.length,group==='sevenths'?7:2);assert.ok(c.every(q=>q.root==='C'));
}
const cIntervals=practiceBank({page:'interval',kind:'names',intervalRange:'basic',roots:'C'});assert.equal(cIntervals.length,12);
const cChromatic=practiceBank({page:'interval',kind:'names',intervalRange:'chromatic',roots:'C'});assert.equal(cChromatic.length,14);
assert.equal(seventhChords.find(q=>q.symbol==='Cdim7').choices[seventhChords.find(q=>q.symbol==='Cdim7').answer],'ド・ミ♭・ソ♭・シ𝄫');
assert.ok(chromaticIntervals.some(q=>q.root==='C'&&q.label==='増4度'&&q.notes[1][0]==='F#'));
assert.ok(chromaticIntervals.some(q=>q.root==='C'&&q.label==='減5度'&&q.notes[1][0]==='Gb'));
assert.deepEqual(Array.from(chords.slice(0,4),q=>q.id),['c-major','c-minor','f-major','f-minor'],'Existing sessions preserve the old question order.');
assert.deepEqual(Array.from(intervals.slice(0,5),q=>q.id),['major-third','minor-third','perfect-fourth','major-second','perfect-fifth']);
assert.ok(chords.some(q=>q.symbol==='F')&&chords.some(q=>q.symbol==='Fm'));
console.log(`PASS: syntax and ${all.length} question identities, interval degrees/distances, chord spelling and answers.`);

// Exercise the real session restoration code, including the legacy four-question
// course and checked answers inside the new seventh-chord range.
const stateStart=practiceScript.indexOf("  const area=app.querySelector('.oto-content');const state="),stateEnd=practiceScript.indexOf('  root.otoSetReferenceOpen=',stateStart);
function restorePractice(previous){
 const stateContext={variant:true,app:{querySelector:()=>({})},saved:{privateContent:{practice:previous}},all,practiceBank};
 vm.runInNewContext(practiceScript.slice(stateStart,stateEnd)+';this.restored=JSON.parse(JSON.stringify(state));',stateContext);
 return stateContext.restored;
}
const old=restorePractice({page:'chord',kind:'semitones',index:3,selected:2,checked:true,finished:true,correctIds:['c-major','f-minor','missing']});
assert.equal(old.index,3);assert.equal(old.selected,2);assert.equal(old.checked,true);assert.equal(old.finished,false);assert.equal(old.version,2);assert.deepEqual(Array.from(old.correctIds),['c-major','f-minor']);
const seventhState={version:2,page:'chord',chordGroup:'sevenths',roots:'C',index:4,selected:seventhChords.find(q=>q.symbol==='Cdim7').answer,checked:true,finished:false,correctIds:[]};
const restoredSeventh=restorePractice(seventhState);assert.equal(restoredSeventh.chordGroup,'sevenths');assert.equal(restoredSeventh.index,4);assert.equal(restoredSeventh.selected,seventhState.selected);assert.equal(restoredSeventh.checked,true);assert.equal(practiceBank(restoredSeventh)[4].symbol,'Cdim7');
const changed=restorePractice({version:2,page:'interval',kind:'names',intervalRange:'chromatic',roots:'C',index:2,selected:1,checked:true});assert.equal(changed.intervalRange,'chromatic');assert.equal(changed.index,2);assert.equal(changed.checked,true);
const invalid=restorePractice({version:2,page:'chord',chordGroup:'bad',intervalRange:'bad',roots:'bad',index:999,selected:999,checked:true});assert.equal(invalid.chordGroup,'triads');assert.equal(invalid.roots,'all');assert.equal(invalid.index,0);assert.equal(invalid.selected,null);assert.equal(invalid.checked,false);
console.log('PASS: guided range/root filtering, legacy answers, expanded courses and checked seventh/interval session restoration.');
