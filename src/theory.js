// Original exercise generation, checked against the sources linked in the app.
(() => {
 'use strict';
 const letters=['C','D','E','F','G','A','B'],sol=['ド','レ','ミ','ファ','ソ','ラ','シ'],white=[0,2,4,5,7,9,11];
 const mod=(n,d)=>(n%d+d)%d;
 const accidental=a=>a===-2?'bb':a===-1?'b':a===1?'#':a===2?'x':'';
 function note(step,acc=0){const index=mod(step,7),octave=4+Math.floor(step/7);return {step,index,acc,octave,key:letters[index]+accidental(acc),name:letters[index]+accidental(acc)+octave,sol:sol[index]+(acc===-2?'𝄫':acc===-1?'♭':acc===1?'♯':acc===2?'𝄪':''),midi:12*(octave+1)+white[index]+acc};}
 function parseRoot(text){const m=/^([A-G])(bb|b|#|x)?$/.exec(text);if(!m)throw new Error('Invalid root');return note(letters.indexOf(m[1]),({bb:-2,b:-1,'#':1,x:2})[m[2]]||0);}
 const base=[0,2,4,5,7,9,11,12];
 const qualities={basic:['完全','長','短'],chromatic:['完全','長','短','増','減'],notation:['完全','長','短','増','減','重増','重減']};
 function semitones(degree,quality){const perfect=[1,4,5,8].includes(degree),b=base[degree-1];if(b===undefined)return null;
  if(quality==='完全')return perfect?b:null;if(quality==='長')return perfect?null:b;if(quality==='短')return perfect?null:b-1;
  return quality==='増'?b+1:quality==='減'?b-(perfect?1:2):quality==='重増'?b+2:quality==='重減'?b-(perfect?2:3):null;
 }
 const intervalCache={};
 function intervalBank(level='chromatic'){
  if(!qualities[level])level='chromatic';if(intervalCache[level])return intervalCache[level];
  const bank=[],max=level==='notation'?2:1;
  for(let i=0;i<7;i++)for(let acc=-max;acc<=max;acc++)for(let degree=1;degree<=8;degree++)for(const quality of qualities[level]){
   const semi=semitones(degree,quality);if(semi===null||semi<0||semi>12)continue;
   const low=note(i,acc),target=note(i+degree-1),upperAcc=low.midi+semi-target.midi;if(Math.abs(upperAcc)>max)continue;
   const high=note(i+degree-1,upperAcc),id=`i:${level}:${i}:${acc}:${degree}:${quality}`;
   bank.push({id,topic:'interval',level,degree,quality,semi,notes:[low,high],answer:quality+degree+'度'});
  }
  return intervalCache[level]=bank;
 }
 // Degree alterations refer to the major/perfect interval above the root.
 const specs=[
  ['major','','メジャー','triads','1 3 5'],['minor','m','マイナー','triads','1 b3 5'],['dim','dim','ディミニッシュ','triads','1 b3 b5'],['aug','aug','オーギュメント','triads','1 3 #5'],['sus2','sus2','サス2','triads','1 2 5'],['sus4','sus4','サス4','triads','1 4 5'],
  ['maj7','maj7','メジャーセブンス','sevenths','1 3 5 7'],['dom7','7','ドミナントセブンス','sevenths','1 3 5 b7'],['min7','m7','マイナーセブンス','sevenths','1 b3 5 b7'],['half-dim','m7(b5)','ハーフディミニッシュ','sevenths','1 b3 b5 b7'],['dim7','dim7','ディミニッシュセブンス','sevenths','1 b3 b5 bb7'],['min-maj7','m(maj7)','マイナーメジャーセブンス','sevenths','1 b3 5 7'],['aug7','7(#5)','オーギュメントセブンス','sevenths','1 3 #5 b7'],
  ['add9','add9','メジャー・アド9','added','1 3 5 9'],['madd9','m(add9)','マイナー・アド9','added','1 b3 5 9'],['six','6','メジャーシックス','added','1 3 5 6'],['msix','m6','マイナーシックス','added','1 b3 5 6'],['six-nine','6(add9)','シックス・ナイン','added','1 3 5 6 9'],['sus7','7sus4','セブンス・サス4','added','1 4 5 b7'],
  ['nine','9','ドミナントナインス','extensions','1 3 5 b7 9'],['maj9','maj9','メジャーナインス','extensions','1 3 5 7 9'],['m9','m9','マイナーナインス','extensions','1 b3 5 b7 9'],['eleven','11','ドミナントイレブンス','extensions','1 3 5 b7 9 11'],['m11','m11','マイナーイレブンス','extensions','1 b3 5 b7 9 11'],['thirteen','13','ドミナントサーティーンス','extensions','1 3 5 b7 9 11 13'],['maj13','maj13','メジャーサーティーンス','extensions','1 3 5 7 9 11 13'],['m13','m13','マイナーサーティーンス','extensions','1 b3 5 b7 9 11 13'],
  ['flat9','7(b9)','セブンス・フラット9','altered','1 3 5 b7 b9'],['sharp9','7(#9)','セブンス・シャープ9','altered','1 3 5 b7 #9'],['sharp11','7(#11)','セブンス・シャープ11','altered','1 3 5 b7 #11'],['flat13','7(b13)','セブンス・フラット13','altered','1 3 5 b7 b13'],['flat5','7(b5)','セブンス・フラット5','altered','1 3 b5 b7'],['maj-sharp5','maj7(#5)','メジャーセブンス・シャープ5','altered','1 3 #5 7'],['flat9-sharp11','7(b9,#11)','セブンス・フラット9・シャープ11','altered','1 3 5 b7 b9 #11'],['thirteen-flat9','13(b9)','サーティーンス・フラット9','altered','1 3 5 b7 b9 11 13'],['maj9-sharp11','maj9(#11)','メジャーナインス・シャープ11','altered','1 3 5 7 9 #11'],['m9-flat5','m9(b5)','マイナーナインス・フラット5','altered','1 b3 b5 b7 9']
 ];
 const types=specs.map(([id,suffix,label,group,formula])=>({id,suffix,label,group,formula,tones:formula.split(' ').map(token=>{const m=/^([b#]*)(\d+)$/.exec(token);return {degree:Number(m[2]),alter:[...m[1]].reduce((a,c)=>a+(c==='b'?-1:1),0),token};})}));
 const roots=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
 function chord(rootKey,typeId){const root=parseRoot(rootKey),type=types.find(t=>t.id===typeId);if(!type)throw new Error('Invalid chord type');
  const notes=type.tones.map(t=>{const step=root.step+t.degree-1,natural=note(step),distance=base[mod(t.degree-1,7)]+12*Math.floor((t.degree-1)/7)+t.alter;return {...note(step,root.midi+distance-natural.midi),degree:t.degree,token:t.token,distance};});
  if(notes.some(n=>Math.abs(n.acc)>2))throw new Error('Spelling exceeds double accidental');
  return {id:`c:${rootKey}:${typeId}`,topic:'chord',root:rootKey,type:typeId,group:type.group,symbol:rootKey+type.suffix,label:rootKey+type.label,formula:type.formula,notes};
 }
 const chordCache={};
 function chordBank(group='sevenths'){if(chordCache[group])return chordCache[group];return chordCache[group]=roots.flatMap(r=>types.filter(t=>group==='all'||t.group===group).map(t=>chord(r,t.id)));}
 function findQuestion(id){if(typeof id!=='string')return null;if(id.startsWith('i:'))return intervalBank(id.split(':')[1]).find(q=>q.id===id)||null;if(id.startsWith('c:'))return chordBank('all').find(q=>q.id===id)||null;return null;}
 function correctNotes(q,selected){const keys=[...new Set(selected)];return keys.length===q.notes.length&&q.notes.every(n=>keys.includes(n.key));}
 function voicing(q,inversion=0){if(!Number.isInteger(inversion)||inversion<0||inversion>=q.notes.length)return [];return q.notes.map((n,i)=>n.midi+(i<inversion?12:0)).sort((a,b)=>a-b);}
 function shuffled(items,seed){let value=seed>>>0;const rand=()=>{value=(Math.imul(1664525,value)+1013904223)>>>0;return value/4294967296;};const result=items.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
 const defaults=()=>({active:false,tab:'interval',drillTopic:'interval',level:'chromatic',group:'sevenths',roots:'all',display:'staff',direction:'up',limit:20,seed:1,cycle:0,position:0,answered:0,correct:0,streak:0,best:0,degree:null,quality:null,selected:[],checked:false,finished:false,wrong:[],review:false,reviewIds:[],refRoot:'C',refType:'maj7',inversion:0});
 function restore(value){const s=defaults();if(!value||typeof value!=='object')return s;
  const enums={tab:['interval','chord','reference','review'],drillTopic:['interval','chord'],level:Object.keys(qualities),group:['triads','sevenths','added','extensions','altered','all'],roots:['C','all'],display:['staff'],direction:['up','down','mixed'],refRoot:roots,refType:types.map(t=>t.id)};
  for(const [k,values]of Object.entries(enums))if(values.includes(value[k]))s[k]=value[k];
  for(const k of ['seed','cycle','position','answered','correct','streak','best'])if(Number.isInteger(value[k])&&value[k]>=0&&value[k]<=0xffffffff)s[k]=value[k];
  s.correct=Math.min(s.correct,s.answered);s.streak=Math.min(s.streak,s.correct);s.best=Math.max(s.best,s.streak);
  if([0,20,50].includes(value.limit))s.limit=value.limit;if(Number.isInteger(value.degree)&&value.degree>=1&&value.degree<=8)s.degree=value.degree;
  if(qualities.notation.includes(value.quality))s.quality=value.quality;
  if(Array.isArray(value.selected))s.selected=[...new Set(value.selected.filter(k=>typeof k==='string'&&/^[A-G](bb|b|#|x)?$/.test(k)))];
  for(const k of ['active','checked','finished','review'])s[k]=value[k]===true;
  for(const k of ['wrong','reviewIds'])if(Array.isArray(value[k]))s[k]=[...new Set(value[k].filter(id=>findQuestion(id)))].slice(0,3000);
  if([0,1,2,3].includes(value.inversion))s.inversion=value.inversion;return s;
 }
 globalThis.OtoTheory={letters,roots,types,qualities,note,parseRoot,semitones,intervalBank,chord,chordBank,findQuestion,correctNotes,voicing,shuffled,defaults,restore};
})();
