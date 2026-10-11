const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/theory.js'),'utf8'),context);
const T=context.OtoTheory,plain=v=>JSON.parse(JSON.stringify(v));
const pitch=key=>{const m=/^([A-G])(bb|b|#|x)?$/.exec(key);assert.ok(m,key);return (({C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+({bb:-2,b:-1,'#':1,x:2}[m[2]]||0))%12+12)%12;};
// Fixed textbook examples exercise enharmonic spelling, not just pitch classes.
const fixtures={maj7:['C','E','G','B'],dom7:['C','E','G','Bb'],min7:['C','Eb','G','Bb'],'half-dim':['C','Eb','Gb','Bb'],dim7:['C','Eb','Gb','Bbb'],'min-maj7':['C','Eb','G','B'],aug7:['C','E','G#','Bb'],nine:['C','E','G','Bb','D'],eleven:['C','E','G','Bb','D','F'],thirteen:['C','E','G','Bb','D','F','A'],add9:['C','E','G','D'],sus7:['C','F','G','Bb'],sharp9:['C','E','G','Bb','D#'],'flat9-sharp11':['C','E','G','Bb','Db','F#'],'thirteen-flat9':['C','E','G','Bb','Db','F','A'],'maj9-sharp11':['C','E','G','B','D','F#']};
for(const [type,keys]of Object.entries(fixtures)){const q=T.chord('C',type);assert.deepEqual(plain(q.notes.map(n=>n.key)),keys);assert.equal(T.correctNotes(q,keys.slice().reverse()),true);assert.equal(T.correctNotes(q,keys.slice(1)),false);assert.equal(T.correctNotes(q,keys.concat('Fx')),false);}
assert.equal(T.correctNotes(T.chord('C','dim7'),['C','Eb','Gb','A']),false);
assert.deepEqual(plain(T.chord('F#','maj7').notes.map(n=>n.key)),['F#','A#','C#','E#']);
assert.equal(T.correctNotes(T.chord('F#','maj7'),['F#','A#','C#','F']),false);
let chordCount=0;
for(const r of T.roots)for(const type of T.types){const q=T.chord(r,type.id);chordCount++;assert.equal(new Set(q.notes.map(n=>n.key)).size,q.notes.length);assert.equal(T.correctNotes(q,q.notes.map(n=>n.key)),true);assert.equal(T.findQuestion(q.id).symbol,q.symbol);
 for(const n of q.notes){assert.equal(pitch(n.key),((n.midi%12)+12)%12);assert.equal((n.index-q.notes[0].index+7)%7,(n.degree-1)%7);assert.ok(Math.abs(n.acc)<=2);}
 if(q.group==='sevenths')for(let inversion=0;inversion<4;inversion++){const keys=T.voicing(q,inversion);assert.equal(keys[0]%12,q.notes[inversion].midi%12);assert.deepEqual(Array.from(keys,n=>n%12).sort((a,b)=>a-b),Array.from(q.notes,n=>n.midi%12).sort((a,b)=>a-b));}
}
const independentQuality=(degree,semi)=>{const perfect=[1,4,5,8].includes(degree),base=[0,2,4,5,7,9,11,12][degree-1],diff=semi-base;return (perfect?{0:'完全',1:'増','-1':'減',2:'重増','-2':'重減'}:{0:'長','-1':'短',1:'増','-2':'減',2:'重増','-3':'重減'})[diff];};
let intervalCount=0;
for(const level of ['basic','chromatic','notation']){const bank=T.intervalBank(level);assert.ok(bank.length>100);const ids=new Set();for(const q of bank){intervalCount++;assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.notes[1].step-q.notes[0].step+1,q.degree);assert.equal(q.notes[1].midi-q.notes[0].midi,q.semi);assert.ok(q.semi>=0&&q.semi<=12);assert.equal(independentQuality(q.degree,q.semi),q.quality);for(const n of q.notes){assert.ok(Math.abs(n.acc)<=(level==='notation'?2:1));assert.equal(pitch(n.key),((n.midi%12)+12)%12);}}
 const shuffled=T.shuffled(bank,17);assert.equal(shuffled.length,bank.length);assert.equal(new Set(shuffled.map(q=>q.id)).size,bank.length);assert.deepEqual(plain(shuffled.map(q=>q.id)),plain(T.shuffled(bank,17).map(q=>q.id)));assert.notDeepEqual(plain(shuffled.slice(0,10)),plain(T.shuffled(bank,18).slice(0,10)));
}
const intervals=T.intervalBank('chromatic');
assert.ok(intervals.some(q=>q.notes[0].key==='C'&&q.notes[1].key==='F#'&&q.answer==='増4度'));
assert.ok(intervals.some(q=>q.notes[0].key==='C'&&q.notes[1].key==='Gb'&&q.answer==='減5度'));
assert.ok(intervals.some(q=>q.notes[0].key==='C#'&&q.notes[1].key==='Db'&&q.answer==='減2度'&&q.semi===0));
const state={...T.defaults(),active:true,tab:'reference',drillTopic:'chord',checked:true,finished:true,seed:27,position:12,answered:4,correct:3,streak:2,best:3,selected:['C','Eb','Gb','Bbb'],wrong:['c:C:dim7'],reviewIds:['c:C:dim7'],review:true,refType:'dim7',inversion:3};
assert.deepEqual(plain(T.restore(state)),plain(state));
assert.equal(T.defaults().display,'staff');
assert.deepEqual(plain(T.restore({...state,display:'names'})),plain(state),'Old display settings migrate without losing session progress.');
const bad=T.restore({active:'true',level:'fake',group:'fake',degree:9,quality:'major',selected:['<script>','C','C'],wrong:['missing','c:C:dim7','c:C:dim7'],correct:10,answered:2});
assert.equal(bad.active,false);assert.equal(bad.level,'chromatic');assert.equal(bad.degree,null);assert.deepEqual(plain(bad.selected),['C']);assert.deepEqual(plain(bad.wrong),['c:C:dim7']);assert.equal(bad.correct,2);
assert.equal(T.findQuestion('bad'),null);assert.throws(()=>T.chord('C','bad'));assert.throws(()=>T.parseRoot('C<script>'));
// Each staff note has an explicit accidental: a natural cancels a previous sharp
// even for two versions of the same letter on the same staff.
const uiSource=fs.readFileSync(path.join(__dirname,'../src/advanced.js'),'utf8');
const staffContext={s:{direction:'down',position:0},esc:text=>String(text)};
vm.runInNewContext(uiSource.slice(uiSource.indexOf(' function staff('),uiSource.indexOf(' function correct('))+';this.draw=staff;',staffContext);
const naturalUnison=intervals.find(q=>q.notes[0].key==='C'&&q.notes[1].key==='C#');
const notation=staffContext.draw(naturalUnison);assert.ok(notation.includes('♮'));assert.ok(notation.includes('♯'));assert.ok(notation.includes('C#4からC4'));
staffContext.s.direction='up';const highNotes=staffContext.draw({notes:[T.note(6),T.note(13)]});assert.ok(highNotes.includes('x1="133" x2="133" y1="70" y2="100"'));assert.ok(highNotes.includes('y1="28" y2="58"'));
console.log(`PASS: ${intervalCount} spelled simple intervals; ${chordCount} chord spellings, seventh inversions, strict answers, seeded repetition, saved sessions and invalid data.`);
