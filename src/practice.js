(()=>{
 const root=document.getElementById('oto-mock');if(!root)return;
 const settings={tablet:false,largeText:false};
 root.otoReveal=(region,selector='.oto-title')=>{const target=region.querySelector(selector);if(!target)return;target.tabIndex=-1;if(selector.includes('feedback'))target.scrollIntoView({block:'nearest'});else root.querySelector('.oto-main').scrollIntoView({block:'start'});target.focus({preventScroll:true});};
 const names={60:'ド',61:'ド♯',62:'レ',63:'ミ♭',64:'ミ',65:'ファ',66:'ソ♭',67:'ソ',68:'ラ♭',69:'ラ',70:'シ♭',71:'シ',72:'ド'};
 const intervals=[
 {id:'major-third',category:'3度',notes:[['C','ド',60,0],['E','ミ',64,2]],title:'ドとミの間は、何の音程？',choices:['短3度','長3度','完全4度','長2度'],answer:1,count:'ド・レ・ミと数えると、3度。',distance:'半音4個ぶん離れているので、長3度です。',hint:'まずはド・レ・ミ。出発のドも「1」と数えます。',more:'白鍵どうしの間も、いつも半音ではありません。ド→レは半音2個、レ→ミも半音2個。合わせて4個です。'},
 {id:'minor-third',category:'3度',notes:[['C','ド',60,0],['E♭','ミ♭',63,2]],title:'ドとミ♭の間は、何の音程？',choices:['長3度','短2度','短3度','完全4度'],answer:2,count:'♭が付いても、ド・レ・ミなので3度。',distance:'半音3個ぶん離れているので、短3度です。',hint:'度数を数えるときは、いったん♭を外して音の名前を見ます。',more:'ド→ミの長3度は半音4個。ミを半音下げたミ♭にすると、距離が1個減って短3度になります。'},
 {id:'perfect-fourth',category:'4度',notes:[['C','ド',60,0],['F','ファ',65,3]],title:'ドとファの間は、何の音程？',choices:['長3度','完全4度','完全5度','短3度'],answer:1,count:'ド・レ・ミ・ファと数えると、4度。',distance:'半音5個ぶん離れているので、完全4度です。',hint:'出発のドから、ファまで音の名前を順番に数えましょう。',more:'ド→レは2個、レ→ミは2個、ミ→ファは1個。合計5個です。基本の4度には「長・短」ではなく「完全」を使います。'},
 {id:'major-second',category:'2度',notes:[['C','ド',60,0],['D','レ',62,1]],title:'ドとレの間は、何の音程？',choices:['短2度','長2度','長3度','完全1度'],answer:1,count:'ド・レと数えると、2度。',distance:'半音2個ぶん離れているので、長2度です。',hint:'隣り合う音の名前でも、距離は半音とは限りません。',more:'鍵盤ではドとレの間にド♯があります。ド→ド♯→レと2回進むので、半音2個です。'},
 {id:'perfect-fifth',category:'5度',notes:[['C','ド',60,0],['G','ソ',67,4]],title:'ドとソの間は、何の音程？',choices:['完全4度','長6度','完全5度','短6度'],answer:2,count:'ド・レ・ミ・ファ・ソと数えると、5度。',distance:'半音7個ぶん離れているので、完全5度です。',hint:'出発のドを含めて、音の名前がいくつ並ぶか数えます。',more:'基本の5度は半音7個ぶんの距離です。コードの「ルート（根音）から5度の音」を見つけるときにも使います。'}
 ];
 const chords=[
 {id:'c-major',category:'三和音',notes:[['C','ド',60,0],['E','ミ',64,2],['G','ソ',67,4]],title:'Cのコードは、どの3つの音？',choices:['ド・ミ♭・ソ','ド・ファ・ソ','ド・ミ・ソ','ド・ミ・ソ♭'],answer:2,count:'Cのルート（根音）はド。そこにミとソを重ねます。',distance:'ルート（根音）から長3度のミ、完全5度のソです。',hint:'Cはメジャーの三和音。ルート（根音）＋長3度＋完全5度で作ります。',more:'ルート（根音）はコードの基準になる音です。Cではドがルート（根音）。ドから半音4個のミと、半音7個のソを重ねます。',symbol:'C'},
 {id:'c-minor',category:'三和音',notes:[['C','ド',60,0],['E♭','ミ♭',63,2],['G','ソ',67,4]],title:'Cmのコードは、どの3つの音？',choices:['ド・ミ・ソ','ド・ミ♭・ソ','ド・ミ♭・ソ♭','ド・ファ・ソ'],answer:1,count:'Cmのルート（根音）はド。そこにミ♭とソを重ねます。',distance:'ルート（根音）から短3度のミ♭、完全5度のソです。',hint:'小文字のmはマイナー。Cのミを半音下げるとCmになります。',more:'CとCmは、真ん中の音だけが違います。Cのミはルート（根音）から長3度、Cmのミ♭は短3度です。',symbol:'Cm'}
 ];
 const semitoneQuestions=intervals.map(q=>{
  const semitones=q.notes[1][2]-q.notes[0][2], label=q.choices[q.answer];
  const choices=[1,2,3,4,5,7].filter(n=>Math.abs(n-semitones)<=2||n===semitones).slice(0,4);
  if(!choices.includes(semitones))choices[choices.length-1]=semitones;
  return {...q,id:q.id+'-semitones',title:label+'は、半音いくつ？',choices:choices.map(n=>'半音'+n+'個'),answer:choices.indexOf(semitones),semitone:true,hint:label+'の行を早見表で確認してみましょう。表を見ながら答えて大丈夫です。'};
 });
 const extraChords=[
  {id:'f-major',category:'三和音',notes:[['F','ファ',65,3],['A','ラ',69,5],['C','ド',72,7]],title:'Fのコードは、どの3つの音？',choices:['ファ・ラ♭・ド','ファ・ラ・ド','ファ・ソ・ド','ド・ミ・ソ'],answer:1,count:'Fのルート（根音）はファ。そこにラとドを重ねます。',distance:'ファから長3度のラ、完全5度のドです。',hint:'Fはファがルート（根音）のメジャー三和音。ルート（根音）から半音4個と7個の音を重ねます。',more:'ファ→ラは半音4個、ファ→上のドは半音7個。Cと同じ距離の並びを、ファから作ります。',symbol:'F'},
  {id:'f-minor',category:'三和音',notes:[['F','ファ',65,3],['A♭','ラ♭',68,5],['C','ド',72,7]],title:'Fmのコードは、どの3つの音？',choices:['ファ・ラ・ド','ファ・ラ♭・シ','ファ・ラ♭・ド','ファ・ソ・ド'],answer:2,count:'Fmのルート（根音）はファ。そこにラ♭とドを重ねます。',distance:'ファから短3度のラ♭、完全5度のドです。',hint:'Fの真ん中の音ラを、半音下げてラ♭にします。',more:'マイナー三和音はルート（根音）から半音3個と7個。FとFmは、ラとラ♭だけが違います。',symbol:'Fm'}
 ];
 chords.push(...extraChords);
 // Guided exercises reuse the degree-spelled theory engine. Legacy question IDs
 // and choice ordering stay intact so saved answers and review entries still work.
 const chordGroups={triads:['major','minor'],diminished:['dim','aug'],sevenths:OtoTheory.types.filter(t=>t.group==='sevenths').map(t=>t.id)};
 const degreeJapanese=['ド','レ','ミ','ファ','ソ','ラ','シ'];
 const displayNote=n=>(n.midi>=72?'上の':'')+n.sol;
 const tuple=n=>[n.key,n.sol,n.midi,n.step];
 function choicesWithAnswer(answer,alternatives,seed){
  const items=[answer,...alternatives.filter(x=>x!==answer)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,4);
  if(items.length!==4)throw new Error('Four unique practice choices are required');
  const shift=seed%4;return items.slice(shift).concat(items.slice(0,shift));
 }
 function intervalExercise(item){
  const perfect=[1,4,5,8].includes(item.degree),label=item.answer,qualities=perfect?['完全','増','減']:['長','短','増','減'];
  const choices=choicesWithAnswer(label,[...qualities.map(k=>k+item.degree+'度'),'長3度','完全4度','完全5度'],item.degree+item.notes[0].step);
  const names=Array.from({length:item.degree},(_,i)=>degreeJapanese[(item.notes[0].step+i)%7]).join('・');
  const altered=['増','減'].includes(item.quality),base=perfect?'完全':item.quality==='減'?'短':'長';
  return {id:'guided-'+item.id,sourceId:item.id,root:item.notes[0].key,scope:altered?'chromatic':'basic',category:altered?'増・減音程':item.degree+'度',notes:item.notes.map(tuple),title:displayNote(item.notes[0])+'と'+displayNote(item.notes[1])+'の間は、何の音程？',choices,answer:choices.indexOf(label),label,
   count:names+'と、出発の音も含めて数えると'+item.degree+'度。',distance:'距離は半音'+item.semi+'個なので、'+label+'です。',
   hint:altered?'まず変化記号を外して度数を数えます。増は長・完全より半音1個広く、減は短・完全より半音1個狭い距離です。':'出発の音も1に含めて度数を数え、半音の数を確かめましょう。',
   more:altered?label+'は'+base+item.degree+'度より半音1個'+(item.quality==='増'?'広い':'狭い')+'音程です。同じ鍵盤でも、音名の綴りで度数が変わります。':'度数は音名を含めて数えます。半音の距離を確かめて、長・短・完全を決めます。'};
 }
 const basicSource=OtoTheory.intervalBank('basic').filter(q=>q.notes[0].acc===0);
 for(const item of basicSource){
  if(intervals.some(q=>q.notes[0][2]===item.notes[0].midi&&q.notes[1][2]===item.notes[1].midi&&q.choices[q.answer]===item.answer))continue;
  intervals.push(intervalExercise(item));
 }
 intervals.forEach(q=>{q.scope='basic';q.root=q.root||'C';q.label=q.label||q.choices[q.answer];});
 const chromaticIntervals=OtoTheory.intervalBank('notation').filter(q=>q.notes[0].acc===0&&['増','減'].includes(q.quality)).map(intervalExercise);
 function semitoneExercise(q){
  const distance=q.notes[1][2]-q.notes[0][2],label=q.label;
  const candidates=[distance-1,distance+1,distance-2,distance+2,0,6,12].filter(n=>n>=0&&n<=12).map(n=>'半音'+n+'個');
  const choices=choicesWithAnswer('半音'+distance+'個',candidates,q.notes[1][3]);
  return {...q,id:q.id+'-semitones',title:label+'は、半音いくつ？',choices,answer:choices.indexOf('半音'+distance+'個'),semitone:true,hint:'同じ度数の音程と比べ、半音の距離を考えましょう。表を見ながらで大丈夫です。'};
 }
 for(const q of intervals)if(!semitoneQuestions.some(s=>s.title===q.label+'は、半音いくつ？'))semitoneQuestions.push(semitoneExercise(q));
 semitoneQuestions.forEach(q=>{q.scope='basic';q.root='C';q.label=q.label||q.title.split('は、')[0];});
 const chromaticSemitones=[];
 for(const q of chromaticIntervals)if(!chromaticSemitones.some(s=>s.label===q.label))chromaticSemitones.push(semitoneExercise(q));
 function chordExercise(rootKey,typeId){
  const item=OtoTheory.chord(rootKey,typeId),type=OtoTheory.types.find(t=>t.id===typeId),four=item.notes.length===4,group=four?'sevenths':['dim','aug'].includes(typeId)?'diminished':'triads';
  const alternatives=(four?chordGroups.sevenths:['major','minor','dim','aug']).filter(id=>id!==typeId).map(id=>OtoTheory.chord(rootKey,id).notes.map(n=>n.sol).join('・'));
  const answer=item.notes.map(n=>n.sol).join('・'),choices=choicesWithAnswer(answer,alternatives,OtoTheory.roots.indexOf(rootKey)+OtoTheory.types.indexOf(type));
  const names=item.notes.map(n=>n.sol).join('・');
  const formulas={major:'長3度・完全5度',minor:'短3度・完全5度',dim:'短3度・減5度',aug:'長3度・増5度',maj7:'長3度・完全5度・長7度',dom7:'長3度・完全5度・短7度',min7:'短3度・完全5度・短7度','half-dim':'短3度・減5度・短7度',dim7:'短3度・減5度・減7度','min-maj7':'短3度・完全5度・長7度',aug7:'長3度・増5度・短7度'};
  return {id:'guided-'+item.id,sourceId:item.id,root:rootKey,chordType:typeId,scope:group,category:four?'4和音（セブンス）':group==='diminished'?'増・減の三和音':'三和音',symbol:item.symbol,label:item.label,notes:item.notes.map(tuple),title:item.symbol+'のコードは、どの'+item.notes.length+'つの音？',choices,answer:choices.indexOf(answer),
   count:item.symbol+'は'+type.label+'。ルート（根音）の'+item.notes[0].sol+'に、'+formulas[typeId]+'の音を重ねます。',distance:'構成音は'+names+'です。',
   hint:four?'まず三和音を作り、7度の種類を確かめます。maj7は長7度、7・m7は短7度。dim7は減7度です。':group==='diminished'?'dimは短3度＋減5度、augは長3度＋増5度です。ルート（根音）から数えます。':'メジャーは長3度＋完全5度、マイナーは短3度＋完全5度です。',
   more:item.symbol+'はルート（根音）から'+item.notes.slice(1).map(n=>'半音'+n.distance+'個').join('・')+'の音を加えます。'+(typeId==='dim7'?'減7度は半音9個。長6度と同じ鍵盤でも、7度なので7番目の音名で表します。':'構成音は3度ずつ音名を重ねるため、同じ鍵盤でも綴りを確かめます。')};
 }
 chords.forEach(q=>{q.scope='triads';q.root=q.symbol.startsWith('F')?'F':'C';q.chordType=q.symbol.endsWith('m')?'minor':'major';q.label=q.symbol+(q.symbol.endsWith('m')?'（マイナー）':'（メジャー）');});
 for(const r of OtoTheory.roots)for(const t of chordGroups.triads)if(!chords.some(q=>q.root===r&&q.chordType===t))chords.push(chordExercise(r,t));
 const diminishedChords=OtoTheory.roots.flatMap(r=>chordGroups.diminished.map(t=>chordExercise(r,t)));
 const seventhChords=OtoTheory.roots.flatMap(r=>chordGroups.sevenths.map(t=>chordExercise(r,t)));
 function practiceBank(options){
  const list=options.page==='chord'?(options.chordGroup==='sevenths'?seventhChords:options.chordGroup==='diminished'?diminishedChords:chords):options.intervalRange==='chromatic'?(options.kind==='names'?chromaticIntervals:chromaticSemitones):options.kind==='names'?intervals:semitoneQuestions;
  return options.roots==='C'&&(options.page==='chord'||options.kind==='names')?list.filter(q=>q.root==='C'):list;
 }
 const all=intervals.concat(semitoneQuestions,chromaticIntervals,chromaticSemitones,chords,diminishedChords,seventhChords);const memory={wrong:[],completed:[]};
 const saved=globalThis.openai&&globalThis.openai.widgetState;
 if(saved&&saved.privateContent&&Array.isArray(saved.privateContent.wrong))memory.wrong=saved.privateContent.wrong.filter(id=>all.some(q=>q.id===id));
 function persist(){if(globalThis.openai&&typeof globalThis.openai.setWidgetState==='function')globalThis.openai.setWidgetState({modelContent:{screen:'音楽理論の学習',device:settings.tablet?'iPad':'PC',wrong:memory.wrong,tab:root.otoAdvanced?.active?'アドバンス':root.otoLearning?.mode||'基礎',foundationStep:root.otoLearning?.step||0},privateContent:{wrong:memory.wrong,learning:root.otoLearning||saved?.privateContent?.learning||null,practice:root.otoPracticeState||null,advanced:root.otoAdvanced||saved?.privateContent?.advanced||null}}).catch(()=>{});}
 root.otoPersist=persist;
 function icons(){if(globalThis.lucide)globalThis.lucide.createIcons({attrs:{width:16,height:16}});}
 function piano(notes){
  const wide=notes.some(n=>n[2]>72),white=wide?[60,62,64,65,67,69,71,72,74,76,77,79,81,83,84]:[60,62,64,65,67,69,71,72],black=wide?[[61,1],[63,2],[66,4],[68,5],[70,6],[73,8],[75,9],[78,11],[80,12],[82,13]]:[[61,1],[63,2],[66,4],[68,5],[70,6]],lit=notes.map(n=>n[2]);
  const labels={...Object.fromEntries(Array.from({length:25},(_,i)=>[60+i,names[60+i%12]])),...Object.fromEntries(notes.map(n=>[n[2],n[1]]))};
  let h='<div class="oto-piano '+(wide?'oto-practice-wide-piano':'')+'" aria-label="'+(wide?'2オクターブ':'ドから1オクターブ')+'の鍵盤。問題の音を緑で表示">';
  white.forEach(m=>h+='<button type="button" class="oto-white cursor-interaction '+(lit.includes(m)?'lit':'')+'" data-key="'+m+'" aria-label="'+(m>=72?'上の':'')+labels[m]+'を鳴らす">'+labels[m]+'</button>');
  black.forEach(([m,pos])=>h+='<button type="button" class="oto-black cursor-interaction '+(lit.includes(m)?'lit':'')+'" data-key="'+m+'" style="left:'+pos*100/white.length+'%" aria-label="'+(m>=72?'上の':'')+labels[m]+'を鳴らす">'+(lit.includes(m)?labels[m]:'')+'</button>');
  return (wide?'<div class="oto-practice-piano-scroll" tabindex="0" aria-label="鍵盤を左右にスクロールできます">':'')+h+'</div>'+(wide?'</div>':'');
 }
 function staff(notes,chord){
  let h='<svg class="oto-staff" viewBox="0 0 330 150" role="img" aria-label="'+notes.map(n=>n[1]).join('と')+'をト音記号の五線譜に表示"><title>'+notes.map(n=>n[1]).join('・')+'</title>';
  [46,58,70,82,94].forEach(y=>h+='<line x1="24" y1="'+y+'" x2="308" y2="'+y+'"/>');h+='<text x="37" y="96" font-size="62">𝄞</text>';
  notes.forEach((n,i)=>{const x=chord?177:137+i*88,y=106-n[3]*6,down=n[3]>=6,stem=x+(down?-7:7),key=n[0].replace(/♭/g,'b').replace(/♯/g,'#'),mark=key.endsWith('bb')?'𝄫':key.endsWith('b')?'♭':key.endsWith('#')?'♯':key.endsWith('x')?'𝄪':'♮';
   for(let line=106;line<=y;line+=12)h+='<line x1="'+(x-15)+'" x2="'+(x+15)+'" y1="'+line+'" y2="'+line+'"/>';
   for(let line=34;line>=y;line-=12)h+='<line x1="'+(x-15)+'" x2="'+(x+15)+'" y1="'+line+'" y2="'+line+'"/>';
   h+='<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="5.5" transform="rotate(-18 '+x+' '+y+')"/><line x1="'+stem+'" x2="'+stem+'" y1="'+y+'" y2="'+(y+(down?35:-35))+'" style="opacity:1;stroke-width:1.4"/><text x="'+(x-27)+'" y="'+(y+5)+'" font-size="21">'+mark+'</text>';
  });return h+'</svg>';
 }
 function guide(q){return q.semitone?'<aside class="oto-guide"><h3>見ながら、覚える。</h3><div class="oto-guide-step"><em>1</em><b>音程名を表で探す</b></div><p>度数と、長・短・完全を見ます。</p><div class="oto-guide-step"><em>2</em><b>半音の数を確かめる</b></div><p>表の数字が半音の数。鍵盤でも数えられます。</p><p class="oto-guide-foot">最初は表を見て大丈夫。慣れたら閉じて挑戦しましょう。</p></aside>':q.symbol?'<aside class="oto-guide"><h3>コードの考え方</h3><div class="oto-guide-step"><em>1</em><b>ルート（根音）を見つける</b></div><p>'+(q.root||q.symbol.replace('m',''))+'のルート（根音）は'+q.notes[0][1]+'。<br>ここを基準にします。</p><div class="oto-guide-step"><em>2</em><b>音程を重ねる</b></div><p>コードの種類ごとに、重ねる音程が決まっています。</p><p class="oto-guide-foot">音程で覚えると、別のルート（根音）でも組み立てられます。</p></aside>':'<aside class="oto-guide"><h3>音程は、2段階で。</h3><div class="oto-guide-step"><em>1</em><b>何度かを数える</b></div><p>音の名前を順に数える。<br>出発の音も1に含めます。</p><div class="oto-guide-step"><em>2</em><b>半音の数を確認</b></div><p>鍵盤で距離を確かめ、長・短・完全を決めます。</p><p class="oto-guide-foot">迷ったら、ひとつずつ。<br>ヒントから確認できます。</p></aside>';}
 let audioContext=null;
 async function play(notes,together,area,labels={}){const status=area.querySelector('[data-sound-status]');try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio)throw new Error('audio unavailable');audioContext=audioContext||new Audio();await audioContext.resume();const now=audioContext.currentTime+.02;notes.forEach((m,i)=>{const start=now+(together?0:i*.5),o=audioContext.createOscillator(),g=audioContext.createGain();o.type='triangle';o.frequency.value=440*Math.pow(2,(m-69)/12);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.07/Math.sqrt(notes.length),start+.015);g.gain.exponentialRampToValueAtTime(.001,start+.65);o.connect(g);g.connect(audioContext.destination);o.start(start);o.stop(start+.7);});status.hidden=false;status.textContent=notes.map(m=>(m>=72?'上の':'')+(labels[m]||names[60+m%12])).join(together?'・':' → ');}catch(e){status.hidden=false;status.textContent='音を再生できません。鍵盤図で確認できます。';}}
 function applySettings(){root.classList.toggle('tablet',settings.tablet);root.querySelectorAll('.oto-subtitle,.oto-feedback p,.oto-hint,.oto-more').forEach(e=>e.style.fontSize=settings.largeText?'16px':'14px');}
 root.querySelectorAll('.oto-app').forEach((app)=>{ const variant=true;
  const area=app.querySelector('.oto-content');const state={page:'interval',index:0,selected:null,checked:false,hint:false,more:false,chat:false,view:variant?'piano':'names',reviewId:null,finished:false,correctIds:[],kind:'semitones',referenceOpen:false,version:2,intervalRange:'basic',chordGroup:'triads',roots:'all'};
  const previous=saved?.privateContent?.practice;
  if(!previous&&['interval','chord','review'].includes(saved?.privateContent?.learning?.page))state.page=saved.privateContent.learning.page;
  if(previous&&typeof previous==='object'){
   if(['interval','chord','review'].includes(previous.page))state.page=previous.page;
   if(['names','semitones'].includes(previous.kind))state.kind=previous.kind;
   if(['names','piano','staff'].includes(previous.view))state.view=previous.view;
   if(['basic','chromatic'].includes(previous.intervalRange))state.intervalRange=previous.intervalRange;
   if(['triads','diminished','sevenths'].includes(previous.chordGroup))state.chordGroup=previous.chordGroup;
   if(['C','all'].includes(previous.roots))state.roots=previous.roots;
   const bank=practiceBank(state);
   if(Number.isInteger(previous.index)&&previous.index>=0&&previous.index<bank.length)state.index=previous.index;
   if(all.some(q=>q.id===previous.reviewId))state.reviewId=previous.reviewId;
   const current=state.reviewId?all.find(q=>q.id===state.reviewId):bank[state.index];
   if(Number.isInteger(previous.selected)&&previous.selected>=0&&previous.selected<current.choices.length){state.selected=previous.selected;state.checked=previous.checked===true;}
   state.finished=previous.version===2&&previous.finished===true;state.referenceOpen=previous.referenceOpen===true;
   if(Array.isArray(previous.correctIds))state.correctIds=previous.correctIds.filter(id=>bank.some(q=>q.id===id));
  }
  root.otoSetReferenceOpen=open=>{state.referenceOpen=open===true;root.otoPracticeState={...state};persist();};
  function questions(){return practiceBank(state);}
  function question(){return state.reviewId?all.find(q=>q.id===state.reviewId):questions()[state.index];}
  function practicePath(q){
   const items=state.reviewId?[q]:questions(),position=state.reviewId?0:state.index;
   const item=(entry,i)=>'<li'+(entry.id===q.id?' aria-current="step"':'')+'><span class="oto-practice-number">'+(i+1)+'</span><span>'+(entry.symbol?entry.label:entry.semitone?entry.title.split('は、')[0]:entry.notes.map(n=>(n[2]>=72?'上の':'')+n[1]).join(' → '))+'</span>'+(entry.id===q.id?'<small>いまここ</small>':state.correctIds.includes(entry.id)?'<small>正解済み</small>':'')+'</li>';
   if(items.length<=7)return '<ol class="oto-practice-path" aria-label="練習の項目一覧">'+items.map(item).join('')+'</ol>';
   const start=Math.max(0,Math.min(position-2,items.length-5)),visible=items.slice(start,start+5);
   return '<ol class="oto-practice-path" aria-label="現在の問題と前後の項目">'+visible.map((entry,i)=>item(entry,start+i)).join('')+'</ol><details class="oto-practice-all"><summary>全'+items.length+'問の一覧を見る</summary><ol class="oto-practice-path" aria-label="練習の全項目">'+items.map(item).join('')+'</ol></details>';
  }
  function practiceSettings(){
   if(state.reviewId)return '';
   const chord=state.page==='chord',groups=chord?{triads:'基本の三和音',diminished:'増・減の三和音',sevenths:'4和音（セブンス）'}:{basic:'長・短・完全',chromatic:'増・減音程'},selected=chord?state.chordGroup:state.intervalRange;
   return '<div class="oto-practice-course" role="group" aria-label="練習の範囲">'+Object.entries(groups).map(([key,label])=>'<button type="button" class="oto-secondary" data-practice-range="'+key+'" aria-pressed="'+(selected===key)+'">'+label+'</button>').join('')+'</div>'+(chord||state.kind==='names'?'<div class="oto-practice-roots" role="group" aria-label="練習するルート・基準の音">'+[['C','Cで仕組みを確認'],['all',chord?'全12ルートで練習':'基準の音を変えて練習']].map(([key,label])=>'<button type="button" class="oto-link" data-practice-roots="'+key+'" aria-pressed="'+(state.roots===key)+'">'+label+'</button>').join('')+'</div>':'');
  }
  function courseConcept(q){
   const topic=q.scope==='sevenths'?'三和音に7度の音を加えた4和音です。maj7は長7度、7・m7は短7度、dim7は減7度を重ねます。':q.scope==='diminished'?'dim（減三和音）は短3度＋減5度。aug（増三和音）は長3度＋増5度。どちらもルート（根音）から数えます。':q.scope==='chromatic'?'増は長・完全より半音1個広い音程。減は短・完全より半音1個狭い音程。度数は音名から数えます。𝄫（ダブルフラット）は半音2個下、𝄪（ダブルシャープ）は半音2個上です。':'';
   return topic?'<details class="oto-practice-concept" data-practice-concept><summary>この範囲の考え方を短く確認</summary><p>'+topic+'</p><p>同じ鍵盤でも、音名の綴りで音程や構成音の名前が変わります。</p></details>':'';
  }
  function nextCourse(){
   if(state.page==='chord')return state.chordGroup==='triads'?{label:'次は増・減の三和音',group:'diminished'}:state.chordGroup==='diminished'?{label:'次は4和音（セブンス）',group:'sevenths'}:{label:'アドバンスでさらに練習する'};
   return state.intervalRange==='basic'?{label:'次は増・減音程',range:'chromatic'}:{label:'アドバンスでさらに練習する'};
  }
  function practiceIdentity(){const q=state.page==='review'&&!state.reviewId?null:question();area.dataset.questionId=q?.id||'';area.dataset.topic=q?.symbol?'chord':'interval';area.dataset.range=q?.scope||'';area.dataset.root=q?.root||'C';}
  function changePage(page){Object.assign(state,{page,index:0,selected:null,checked:false,hint:false,more:false,chat:false,reviewId:null,finished:false,correctIds:[]});render();}
  function render(){
   const answerFocus=document.activeElement?.dataset.answer,viewFocus=document.activeElement?.dataset.view;
   root.otoPracticeState={...state};persist();
   practiceIdentity();
   app.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page===state.page);b.setAttribute('aria-current',b.dataset.page===state.page?'page':'false');});app.querySelector('.oto-course small:last-child').textContent=state.page==='chord'?'ルート（根音） → 三和音 → マイナー':state.page==='review'?'迷ったところを、もう一度':'基準 → 半音 → 度数';app.querySelector('.oto-course b').textContent=state.page==='chord'?'コードの基本':state.page==='review'?'間違えた問題':'音程の基本';
   if(state.page==='review'&&!state.reviewId){const list=memory.wrong.map(id=>all.find(q=>q.id===id));area.innerHTML='<span class="oto-overline">REVIEW</span><h2 class="oto-title">もう一度、確かめよう。</h2><p class="oto-subtitle">間違えた問題を、自分のペースで復習します。</p>'+(list.length?'<div class="oto-review-list">'+list.map(q=>'<div class="oto-review-item"><div><b>'+q.title+'</b><p>'+q.category+'の練習</p></div><button type="button" class="oto-primary cursor-interaction" data-retry="'+q.id+'">もう一度解く</button></div>').join('')+'</div>':'<div class="oto-empty"><p>いまは、復習する問題がありません。</p><small>音程やコードの問題で間違えると、ここに追加されます。</small><div class="oto-actions"><button type="button" class="oto-primary cursor-interaction" data-return>音程を練習する</button></div></div>');area.querySelectorAll('[data-retry]').forEach(b=>b.addEventListener('click',()=>{Object.assign(state,{reviewId:b.dataset.retry,selected:null,checked:false,hint:false,more:false,chat:false});render();}));const back=area.querySelector('[data-return]');if(back)back.addEventListener('click',()=>changePage('interval'));icons();return;}
   if(state.finished){const continuation=nextCourse();const destination=memory.wrong.length?'間違えた問題を復習する':state.page==='interval'?(state.kind==='semitones'?'2つの音から音程名を練習する':'コードの基礎へ進む'):'コードの早見表で確認する';area.innerHTML='<span class="oto-overline">PRACTICE COMPLETE</span><h2 class="oto-title">ひと区切り、できました。</h2><p class="oto-subtitle">今日の小さな練習を、次につなげましょう。</p><div class="oto-empty"><p>'+questions().length+'問の練習が終わりました。</p><small>正解した問題は'+state.correctIds.length+'問。'+(memory.wrong.length?'復習に'+memory.wrong.length+'問残っています。':'いまは、復習に残っている問題はありません。')+'</small><div class="oto-actions"><button type="button" class="oto-secondary cursor-interaction" data-again>同じ内容を練習</button><button type="button" class="oto-primary cursor-interaction" data-review>'+destination+'</button><button type="button" class="oto-secondary" data-next-course>'+continuation.label+'</button></div></div>';area.querySelector('[data-next-course]').addEventListener('click',()=>{if(continuation.group){state.chordGroup=continuation.group;changePage('chord');}else if(continuation.range){state.intervalRange=continuation.range;changePage('interval');}else{app.querySelector('[data-advanced-nav]').click();return;}root.otoReveal(area);});area.querySelector('[data-again]').addEventListener('click',()=>changePage(state.page));area.querySelector('[data-review]').addEventListener('click',()=>{if(memory.wrong.length){changePage('review');root.otoReveal(area);}else if(state.page==='interval'&&state.kind==='semitones'){state.kind='names';changePage('interval');root.otoReveal(area);}else if(state.page==='interval'){app.querySelector('[data-page="chord"]').click();root.otoReveal(app.querySelector('.oto-learning'));}else app.querySelector('[data-mode="chart"]').click();});icons();return;}
   const q=question(),correct=state.selected===q.answer,total=state.reviewId?1:questions().length,current=state.reviewId?1:state.index+1;const displayed=!state.checked?(q.symbol?q.notes.slice(0,1):q.semitone?[]:q.notes):q.notes;
   let h=practiceSettings()+(state.page==='interval'?'<div class="oto-practice-switch" role="group" aria-label="音程の練習内容">'+[['semitones','名前 → 半音の数'],['names','2つの音 → 音程名']].map(([key,label])=>'<button type="button" class="oto-secondary '+(state.kind===key?'active':'')+'" data-practice-kind="'+key+'" aria-pressed="'+(state.kind===key)+'">'+label+'</button>').join('')+'</div>':'')+'<div class="oto-topline"><span>'+(state.reviewId?'復習':q.symbol?'コードの練習':'音程の練習')+' ／ <b>'+q.category+'</b></span><span class="oto-practice-location">全'+total+'問中 <b>'+current+'問目</b></span></div><div class="oto-progress" role="progressbar" aria-label="問題の進捗" aria-valuenow="'+current+'" aria-valuemin="0" aria-valuemax="'+total+'"><span style="width:'+current/total*100+'%"></span></div>'+practicePath(q)+'<span class="oto-overline">'+(q.symbol?'CHORDS':'INTERVALS')+'</span><h2 class="oto-title">'+q.title+'</h2><p class="oto-subtitle">'+(q.symbol?'ルート（根音）を基準に、重ねる音を考えましょう。':q.semitone?'早見表を見ながらで大丈夫。まずは距離の対応を覚えましょう。':'まず何度かを数えて、次に長・短・完全を考えましょう。')+'</p>'+courseConcept(q)+'<div class="'+(variant?'oto-study-grid':'oto-study-single')+'"><div><div class="oto-question"><div class="oto-tabs" role="group" aria-label="音の表示方法">'+[['names','音名'],['piano','鍵盤'],['staff','五線譜']].map(p=>'<button type="button" class="oto-tab cursor-interaction '+(state.view===p[0]?'active':'')+'" data-view="'+p[0]+'" aria-pressed="'+(state.view===p[0])+'">'+p[1]+'</button>').join('')+'</div><div class="oto-notation">';
   if(state.view==='names')h+='<div class="oto-notes">'+(q.symbol?'<div class="oto-note"><b>'+q.symbol+'</b><small>このコードの構成音は？</small></div>':(q.semitone&&!state.checked?'<div class="oto-note"><b>'+q.label+'</b><small>この音程は半音いくつ？</small></div>':q.notes.map((n,i)=>(i?'<span class="oto-arrow" aria-hidden="true">→</span>':'')+'<div class="oto-note"><b>'+(n[2]>=72?'上の':'')+n[1]+'</b><small>'+n[0]+'</small></div>').join('')))+'</div>';else if(state.view==='piano')h+='<div style="width:100%">'+piano(displayed)+'<p class="oto-piano-caption">'+(q.symbol&&!state.checked?'ルート（根音）の'+q.notes[0][1]+'を、緑で示しています。':q.symbol?'答えの構成音を、緑で示しています。':q.semitone&&!state.checked?'音程名から距離を考えましょう。答え合わせ後に鍵盤で確認できます。':'問題の2つの音を、緑で示しています。')+'</p></div>';else h+=q.semitone&&!state.checked?'<p class="oto-piano-caption">'+q.label+'の距離を考えましょう。答え合わせ後に五線譜を表示します。</p>':staff(displayed,!!q.symbol);
   h+='</div><div class="oto-play-row"><button type="button" class="oto-secondary cursor-interaction" data-play '+(!displayed.length?'disabled':'')+'><i data-lucide="volume-2" aria-hidden="true"></i>'+(q.symbol&&!state.checked?'ルート（根音）を聴く':'音を聴く')+'</button></div><div class="oto-toast" aria-live="polite" data-sound-status hidden></div></div><div class="oto-options" role="group" aria-label="回答の選択肢">'+q.choices.map((text,i)=>'<button type="button" class="oto-option cursor-interaction '+(state.selected===i?'selected ':'')+(state.checked&&i===q.answer?'right ':'')+(state.checked&&state.selected===i&&!correct?'wrong':'')+'" data-answer="'+i+'" aria-pressed="'+(state.selected===i)+'" '+(state.checked?'disabled':'')+'><small>'+String.fromCharCode(65+i)+'</small><span>'+text+'</span></button>').join('')+'</div>';
   if(state.checked)h+='<section class="oto-feedback" data-correct="'+correct+'" aria-live="polite"><h3><i data-lucide="'+(correct?'circle-check':'lightbulb')+'" aria-hidden="true"></i>'+(correct?'その通り。':'答えは「'+q.choices[q.answer]+'」。')+'</h3><p>'+q.count+'</p><p>'+q.distance+'</p><button type="button" class="oto-link cursor-interaction" data-more aria-expanded="'+state.more+'">'+(state.more?'補足を閉じる':'もう少し詳しく')+'</button>'+(state.more?'<div class="oto-more">'+q.more+'</div>':'')+'</section>';
   if(state.hint&&!state.checked)h+='<div class="oto-hint" aria-live="polite">'+q.hint+'</div>';
   h+='<div class="oto-actions"><button type="button" class="oto-link cursor-interaction" data-hint aria-expanded="'+state.hint+'" '+(state.checked?'hidden':'')+'><i data-lucide="lightbulb" aria-hidden="true"></i>'+(state.hint?'ヒントを閉じる':'ヒントを見る')+'</button>'+(state.checked?'<button type="button" class="oto-primary cursor-interaction" data-next>'+(state.reviewId?'復習へ戻る':current===total?'練習を終える':'次の問題')+'<i data-lucide="arrow-right" aria-hidden="true"></i></button>':'<button type="button" class="oto-primary cursor-interaction" data-check '+(state.selected===null?'disabled':'')+'>答え合わせ<i data-lucide="arrow-right" aria-hidden="true"></i></button>')+'</div></div>'+(variant?guide(q):'')+'</div><div class="oto-chat-row oto-chat-only"><span>疑問が残ったら、いつものChatGPTで。</span><button type="button" class="oto-link cursor-interaction" data-chat><i data-lucide="messages-square" aria-hidden="true"></i>ChatGPTに質問する</button></div>';
   area.innerHTML=h;
   area.querySelectorAll('[data-practice-range]').forEach(b=>b.addEventListener('click',()=>{if(state.page==='chord')state.chordGroup=b.dataset.practiceRange;else state.intervalRange=b.dataset.practiceRange;changePage(state.page);}));
   area.querySelectorAll('[data-practice-roots]').forEach(b=>b.addEventListener('click',()=>{state.roots=b.dataset.practiceRoots;changePage(state.page);}));
   area.querySelectorAll('[data-practice-kind]').forEach(b=>b.addEventListener('click',()=>{state.kind=b.dataset.practiceKind;changePage('interval');}));
   area.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{state.selected=Number(b.dataset.answer);render();}));area.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;render();}));area.querySelector('[data-hint]').addEventListener('click',()=>{state.hint=!state.hint;render();});
   const check=area.querySelector('[data-check]');if(check)check.addEventListener('click',()=>{if(state.selected===null)return;state.checked=true;if(state.selected!==q.answer&&!memory.wrong.includes(q.id))memory.wrong.push(q.id);if(state.selected===q.answer&&!state.correctIds.includes(q.id))state.correctIds.push(q.id);if(state.reviewId&&state.selected===q.answer)memory.wrong=memory.wrong.filter(id=>id!==q.id);persist();render();root.otoReveal(area,'.oto-feedback h3');});
   const next=area.querySelector('[data-next]');if(next)next.addEventListener('click',()=>{if(state.reviewId){state.reviewId=null;render();root.otoReveal(area);return;}if(state.index===questions().length-1){state.finished=true;render();root.otoReveal(area);return;}Object.assign(state,{index:state.index+1,selected:null,checked:false,hint:false,more:false,chat:false});render();root.otoReveal(area);});
   const more=area.querySelector('[data-more]');if(more)more.addEventListener('click',()=>{state.more=!state.more;render();});area.querySelector('[data-chat]').addEventListener('click',()=>root.otoAskGPT('音楽理論の入門者です。\n問題：'+q.title+'\n私の回答：'+(state.selected===null?'まだ回答していません':q.choices[state.selected])+'\n'+(state.checked?'正解：'+q.choices[q.answer]+'\n基本解説：'+q.count+' '+q.distance:'まだ答え合わせをしていません。答えをすぐに明かさず、考え方から案内してください。')+'\n\n短い説明と、理解を確かめる2問以内の確認をお願いします。一度に1問ずつ、音名や鍵盤の具体例を使ってください。区切りで学習画面に戻るか、疑問を続けて聞くか確認してください。',area));area.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{state.chat=false;render();}));
   area.querySelector('[data-play]').addEventListener('click',()=>play(displayed.map(n=>n[2]),!!q.symbol,area,Object.fromEntries(displayed.map(n=>[n[2],n[1]]))));area.querySelectorAll('[data-key]').forEach(b=>b.addEventListener('click',()=>play([Number(b.dataset.key)],false,area)));applySettings();icons();if(answerFocus!==undefined)area.querySelector('[data-answer="'+answerFocus+'"]')?.focus({preventScroll:true});else if(viewFocus)area.querySelector('[data-view="'+viewFocus+'"]')?.focus({preventScroll:true});
  }
  app.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>changePage(b.dataset.page)));render();
 });
 applySettings();
 if(globalThis.Tweak){const tweak=new globalThis.Tweak({container:root,onChange:()=>{applySettings();persist();}});tweak.addToggle(settings,'tablet',{label:'iPadでの表示'});tweak.addToggle(settings,'largeText',{label:'説明の文字を大きく'});}
})();
