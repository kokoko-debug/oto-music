const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=require('./source.cjs');
const begin=source.indexOf(' const keySpellings=');
const end=source.indexOf(' function chartRender(){',begin);
const sandbox={degreeNames:['ド','レ','ミ','ファ','ソ','ラ','シ','ド']};
vm.runInNewContext(source.slice(begin,end)+';this.calculate=keyboardInterval;',sandbox);
const expectedByDistance=['完全1度','短2度','長2度','短3度','長3度','完全4度',null,'完全5度','短6度','長6度','短7度','長7度','完全8度'];
const pitchOfLabel=label=>{
 const match=label.match(/^(ド|レ|ミ|ファ|ソ|ラ|シ)(♯|♭)?$/);
 return {pitch:{ド:0,レ:2,ミ:4,ファ:5,ソ:7,ラ:9,シ:11}[match[1]]+(match[2]==='♯'?1:match[2]==='♭'?-1:0),letter:['ド','レ','ミ','ファ','ソ','ラ','シ'].indexOf(match[1])};
};
for(let start=60;start<=72;start++)for(let finish=60;finish<=72;finish++){
 const q=sandbox.calculate(start,finish),distance=Math.abs(start-finish);
 assert.equal(q.semi,distance);
 if(distance===6)assert.ok(['増4度','減5度'].includes(q.label));
 else assert.equal(q.label,expectedByDistance[distance],`${start}→${finish}`);
 for(const n of q.notes){const spelling=pitchOfLabel(n[1]);assert.equal((spelling.pitch+12)%12,n[2]%12);assert.equal(n[3]%7,spelling.letter);}
 assert.equal(Math.abs(q.notes[1][3]-q.notes[0][3])+1,q.degree);
 assert.equal(q.notes[0][2],start);
 assert.equal(q.notes[1][2],finish);
}
assert.equal(sandbox.calculate(65,71).label,'増4度','White-key F→B is an augmented fourth.');
assert.equal(sandbox.calculate(64,65).label,'短2度');
assert.equal(sandbox.calculate(69,65).label,'長3度','Descending direction retains interval size.');
assert.equal(sandbox.calculate(60,72).label,'完全8度');
assert.equal(sandbox.calculate(61,61).label,'完全1度');
const foundationStart=source.indexOf(' const referenceExamples=');
const foundationEnd=source.indexOf(' function originDiagram',foundationStart);
vm.runInNewContext(source.slice(foundationStart,foundationEnd)+';this.examples=referenceExamples;',sandbox);
for(const q of Object.values(sandbox.examples)){assert.equal(q.notes[1][2]-q.notes[0][2],4);assert.equal(q.notes[1][3]-q.notes[0][3]+1,3);assert.equal(q.path.length,5);}
console.log('PASS: all 169 keyboard pairs, spelled degree counts, same key, octave, descending direction and reference examples.');
