const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=require('./source.cjs');
const start=source.indexOf(' const chordRootNames=');
const end=source.indexOf(' function chordPiano(',start);
const context={};
vm.runInNewContext(source.slice(start,end)+';this.identify=identifyKeyboardChord;this.voice=chordVoicing;',context);
const identify=context.identify;
const pitch=label=>{
 const match=label.match(/^([A-G])(♯|♭|𝄫|𝄪)?$/);
 assert.ok(match,label);
 return ({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1]]+(match[2]==='♯'?1:match[2]==='♭'?-1:match[2]==='𝄫'?-2:match[2]==='𝄪'?2:0)+12)%12;
};
let recognized=0;
for(let root=0;root<12;root++)for(const minor of [false,true])for(let inversion=0;inversion<3;inversion++){
 const intervals=[0,minor?3:4,7];
 const bass=60+(root+intervals[inversion])%12;
 const keys=intervals.map(n=>bass+(root+n-bass%12+12)%12).sort((a,b)=>a-b);
 assert.ok(keys.every(n=>n>=60&&n<=84));
 const q=identify(keys.slice().reverse());
 assert.ok(q,keys.join(','));
 assert.equal(q.rootPc,root);
 assert.equal(q.minor,minor);
 assert.equal(q.inversion,inversion);
 assert.equal(q.bassMidi,bass);
 assert.equal(q.tones[inversion].name,q.bassName);
 for(const tone of q.tones)assert.equal(pitch(tone.letter),tone.pc);
 assert.deepEqual(Array.from(q.tones,t=>({C:0,D:1,E:2,F:3,G:4,A:5,B:6}[t.letter[0]]-({C:0,D:1,E:2,F:3,G:4,A:5,B:6}[q.tones[0].letter[0]])+7)%7),[0,2,4]);
 assert.equal(q.displaySymbol.includes('/'),inversion>0);
 assert.ok(q.displayName.endsWith(minor?'マイナー':'メジャー'));
 assert.equal(/[\/♭♯]/.test(q.displayName),false);
 for(let target=0;target<3;target++){
  const voiced=Array.from(context.voice(q,target));
  assert.equal(voiced.length,3);
  assert.ok(voiced.every(n=>n>=60&&n<=84));
  const changed=identify(voiced);
  assert.equal(changed.rootPc,root);
  assert.equal(changed.minor,minor);
  assert.equal(changed.inversion,target);
 }
 recognized++;
}
assert.equal(identify([64,67,72]).displaySymbol,'C/E');
assert.equal(identify([70,75,79]).displayName,'Ebメジャー');
assert.equal(identify([70,75,79]).position,'第2転回形');
assert.deepEqual(Array.from(context.voice(identify([70,75,79]),0)),[63,67,70]);
assert.deepEqual(Array.from(context.voice(identify([70,75,79]),1)),[67,70,75]);
assert.deepEqual(Array.from(context.voice(identify([70,75,79]),2)),[70,75,79]);
assert.equal(identify([70,75,78]).displayName,'Ebマイナー');
assert.equal(identify([70,75,78]).position,'第2転回形');
assert.equal(identify([67,72,76]).displaySymbol,'C/G');
assert.equal(identify([63,67,72]).displaySymbol,'Cm/E♭');
assert.equal(identify([67,72,75]).displaySymbol,'Cm/G');
assert.equal(identify([61,64,68]).displaySymbol,'C♯m');
assert.equal(identify([60,64,79]).displaySymbol,'C','Open voicing retains root position.');
assert.equal(identify([64,67,72,76]).displaySymbol,'C/E','Doubling retains the bass and inversion.');
assert.equal(identify([60,64,67,71]).displayName,'Cメジャーセブンス');
assert.equal(identify([60,63,66]),null,'Diminished triads are outside the current beginner scope.');
assert.equal(identify([60,64,68]),null,'Augmented triads must not be mislabeled.');
assert.equal(identify([60,72,64]),null,'Two distinct pitch classes do not form a triad.');
assert.equal(identify([]),null);
let checked=0;
for(let a=60;a<=82;a++)for(let b=a+1;b<=83;b++)for(let c=b+1;c<=84;c++){
 const q=identify([a,b,c]);
 if(q){assert.equal(q.bassMidi,a);assert.equal(new Set([a,b,c].map(n=>n%12)).size,3);assert.ok(q.tones.every(t=>[a,b,c].some(n=>n%12===t.pc)));}
 checked++;
}
console.log(`PASS: ${recognized} triads/inversions, 216 voicing switches, all ${checked} three-key selections, spelling, doubling and open voicings.`);

// Compare all keyboard seventh interpretations and inversion switches with the
// independently tested, degree-spelled theory engine, including ambiguous dim7.
const theoryContext={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../src/theory.js'),'utf8'),theoryContext);
const T=theoryContext.OtoTheory;
let seventhCount=0;
for(const root of T.roots)for(const type of T.types.filter(t=>t.group==='sevenths')){
 const chord=T.chord(root,type.id),symbol=chord.symbol.replace(/^([A-G])b/,'$1♭').replace(/^([A-G])#/,'$1♯');
 for(let inversion=0;inversion<4;inversion++){
  const keys=Array.from(T.voicing(chord,inversion));
  const q=identify(keys,symbol);
  assert.ok(q,`${symbol} inversion ${inversion}`);
  assert.equal(q.type,type.id);assert.equal(q.rootPc,chord.notes[0].midi%12);assert.equal(q.inversion,inversion);
  assert.deepEqual(Array.from(q.tones,t=>t.pc),Array.from(chord.notes,n=>n.midi%12));
  assert.deepEqual(Array.from(q.tones,t=>t.letter.replace(/♭/g,'b').replace(/♯/g,'#').replace(/𝄫/g,'bb').replace(/𝄪/g,'x')),Array.from(chord.notes,n=>n.key));
  for(let target=0;target<4;target++){
   const voiced=Array.from(context.voice(q,target)),changed=identify(voiced,symbol);
   assert.equal(voiced.length,4);assert.ok(voiced.every(n=>n>=60&&n<=84));
   assert.equal(changed.symbol,symbol);assert.equal(changed.inversion,target);
  }
  seventhCount++;
 }
}
const dim=identify([60,63,66,69]);assert.equal(dim.alternatives.length,4);assert.equal(dim.symbol,'Cdim7');
assert.equal(identify([63,66,69,72],'Cdim7').position,'第1転回形');
assert.equal(identify([69,72,75,78],'Cdim7').position,'第3転回形');
assert.equal(identify([60,63,66,69],'D♯dim7').symbol,'Cdim7','Unknown spelling cannot silently change the selected chord.');
assert.equal(identify([60,64,67,71,76]).type,'maj7','Doubling is allowed.');
assert.equal(identify([60,64,67,71,74]),null,'Five distinct pitches are outside the quick reference scope.');
assert.deepEqual(Array.from(context.voice(dim,4)),[]);
console.log(`PASS: ${seventhCount} seventh/root/inversion cases, 1344 inversion switches, correct double accidentals and ambiguous roots.`);
