const EXERCISES=[
["Bench Press","Barbell","chest"],["Incline Dumbbell Press","Dumbbells","upper chest"],["Chest Fly","Cable/Machine","chest"],
["Overhead Press","Barbell","shoulders"],["Lateral Raise","Dumbbells","side delts"],["Triceps Pushdown","Cable","triceps"],
["Pull-up","Pull-up Bar","lats"],["Lat Pulldown","Lat Pulldown","lats"],["Seated Cable Row","Cable Row","upper back"],
["Barbell Row","Barbell","upper back"],["Dumbbell Curl","Dumbbells","biceps"],["Hammer Curl","Dumbbells","biceps"],
["Back Squat","Squat Rack","quads/glutes"],["Leg Press","Leg Press","quads/glutes"],["Romanian Deadlift","Barbell","hamstrings/glutes"],
["Leg Curl","Leg Curl","hamstrings"],["Leg Extension","Leg Extension","quads"],["Walking Lunge","Dumbbells","quads/glutes"],
["Calf Raise","Calf Raise","calves"],["Plank","Bodyweight","core"],["Hanging Knee Raise","Pull-up Bar","core"],
["Bodyweight Squat","Bodyweight","quads/glutes"],["Push-up","Bodyweight","chest/triceps"],["Pike Push-up","Bodyweight","shoulders"],
["Diamond Push-up","Bodyweight","triceps/chest"],["Inverted Row","Bodyweight","upper back"],["Reverse Lunge","Bodyweight","legs"],
["Glute Bridge","Bodyweight","glutes"],["Mountain Climber","Bodyweight","conditioning"]
];
const $=id=>document.getElementById(id);
const today=new Date().toISOString().slice(0,10);$("sessionDate").value=today;
let workout={name:"Push Day",date:today,goal:"muscle",duration:60,bodyWeight:null,goalWeight:null,timeframe:null,exercises:[]};
let history=JSON.parse(localStorage.getItem("forgeHistory")||"[]");

function saveDraft(){localStorage.setItem("forgeDraft",JSON.stringify(workout))}
function loadDraft(){const d=JSON.parse(localStorage.getItem("forgeDraft")||"null");if(d){workout=d;$("sessionName").value=d.name||"Workout";$("sessionDate").value=d.date||today;$("goal").value=d.goal||"muscle";$("duration").value=d.duration||45;$("currentWeight").value=d.bodyWeight||"";$("goalWeight").value=d.goalWeight||"";$("timeframe").value=d.timeframe||"";}}
function updateFromInputs(){workout.name=$("sessionName").value||"Workout";workout.date=$("sessionDate").value||today;workout.goal=$("goal").value;workout.duration=+$("duration").value;workout.bodyWeight=parseFloat($("currentWeight").value)||null;workout.goalWeight=parseFloat($("goalWeight").value)||null;workout.timeframe=parseFloat($("timeframe").value)||null;updateWeight();saveDraft();renderSession()}
function updateWeight(){const a=workout.bodyWeight,b=workout.goalWeight,w=workout.timeframe,e=$("weightSummary");if(!(a&&b&&w)){e.textContent="Add your weights and timeframe to see the arithmetic target.";return}const change=b-a;e.textContent=`${Math.abs(change).toFixed(1)} kg ${change<0?"loss":"gain"} over ${w} weeks • ${(Math.abs(change)/w).toFixed(2)} kg/week average target`}
function addExercise(data={}){workout.exercises.push({id:crypto.randomUUID(),name:data.name||"",machine:data.machine||"Bodyweight",targetSets:data.targetSets||3,targetReps:data.targetReps||10,sets:[]});saveDraft();renderAll()}
function removeExercise(id){workout.exercises=workout.exercises.filter(e=>e.id!==id);saveDraft();renderAll()}
function setCount(ex,n){n=Math.max(1,Math.min(12,+n||1));while(ex.sets.length<n)ex.sets.push({weight:"",reps:"",done:false});if(ex.sets.length>n)ex.sets.length=n}
function renderBuilderList(){const el=$("exerciseList");el.innerHTML="";workout.exercises.forEach(ex=>{const card=document.createElement("div");card.className="exercise-card";card.innerHTML=`<div class="exercise-card-head"><input class="ex-name-input" value="${esc(ex.name)}" placeholder="Exercise name"><button class="remove-ex" title="Remove">×</button></div><div class="mini-grid"><div><label>Machine / setup</label><input class="machine-input" value="${esc(ex.machine)}" placeholder="e.g. Leg Press"></div><div><label>Target sets</label><input class="sets-input" type="number" min="1" max="12" value="${ex.targetSets}"></div><div><label>Target reps</label><input class="reps-input" type="number" min="1" max="100" value="${ex.targetReps}"></div></div>`;card.querySelector(".remove-ex").onclick=()=>removeExercise(ex.id);card.querySelector(".ex-name-input").oninput=e=>{ex.name=e.target.value;saveDraft();renderSession()};card.querySelector(".machine-input").oninput=e=>{ex.machine=e.target.value;saveDraft();renderSession()};card.querySelector(".sets-input").onchange=e=>{ex.targetSets=+e.target.value||1;setCount(ex,ex.targetSets);saveDraft();renderSession()};card.querySelector(".reps-input").onchange=e=>{ex.targetReps=+e.target.value||1;saveDraft();renderSession()};el.appendChild(card)});$("exerciseCount").textContent=workout.exercises.length}
function renderSession(){const el=$("sessionEditor");$("liveTitle").textContent=workout.name||"Your session";$("liveMeta").textContent=`${workout.date} • ${workout.duration} min • ${workout.exercises.length} exercises`;if(!workout.exercises.length){el.innerHTML='<div class="empty-state"><b>◆</b>Add exercises on the left.<br>Every exercise can have its own machine, sets, reps and actual weight.</div>';return}el.innerHTML="";workout.exercises.forEach(ex=>{setCount(ex,ex.targetSets);const box=document.createElement("article");box.className="logged-ex";const vol=ex.sets.reduce((s,x)=>s+(+x.weight||0)*(+x.reps||0),0);box.innerHTML=`<div class="logged-head"><div><div class="logged-name">${esc(ex.name||"Unnamed exercise")}</div><div class="logged-sub">${ex.targetSets} target sets × ${ex.targetReps} target reps</div></div><span class="machine-badge">${esc(ex.machine||"Custom setup")}</span></div>`;ex.sets.forEach((set,i)=>{const row=document.createElement("div");row.className="set-row";row.innerHTML=`<span class="set-num">S${i+1}</span><div><label>Weight</label><input class="weight" type="number" step="0.5" value="${set.weight}" placeholder="0"></div><div><label>Reps</label><input class="reps" type="number" min="0" value="${set.reps}" placeholder="${ex.targetReps}"></div><div class="set-rest"><label>Done</label><input class="done-check" type="checkbox" ${set.done?"checked":""}></div><span></span>`;row.querySelector(".weight").oninput=e=>{set.weight=e.target.value;saveDraft();updateStatsPreview()};row.querySelector(".reps").oninput=e=>{set.reps=e.target.value;saveDraft();updateStatsPreview()};row.querySelector(".done-check").onchange=e=>{set.done=e.target.checked;saveDraft()};box.appendChild(row)});const vl=document.createElement("div");vl.className="volume-line";vl.textContent=`Logged volume: ${Math.round(vol).toLocaleString()} kg`;box.appendChild(vl);el.appendChild(box)})}
function updateStatsPreview(){/* intentionally lightweight; tracker computes saved sessions */}
function suggested(){workout.exercises=[];const goal=workout.goal;let names=goal==="strength"?["Bench Press","Barbell Row","Back Squat","Overhead Press","Romanian Deadlift"]:goal==="endurance"?["Push-up","Bodyweight Squat","Mountain Climber","Inverted Row","Reverse Lunge"]:["Bench Press","Lat Pulldown","Leg Press","Lateral Raise","Cable Triceps Pushdown"];names.forEach((n,i)=>{const found=EXERCISES.find(x=>x[0]===n)||[n,"Custom","custom"];addExercise({name:found[0],machine:found[1],targetSets:goal==="strength"&&i<3?4:3,targetReps:goal==="strength"&&i<3?5:10})});renderAll()}
function saveWorkout(){const clean=JSON.parse(JSON.stringify(workout));clean.id=crypto.randomUUID();clean.savedAt=new Date().toISOString();history.unshift(clean);history=history.slice(0,100);localStorage.setItem("forgeHistory",JSON.stringify(history));renderHistory();renderStats();alert("Workout saved locally.")}
function renderStats(){let exercises=0,sets=0,reps=0,weight=0,volume=0;history.forEach(w=>w.exercises.forEach(e=>{exercises++;e.sets.forEach(s=>{if(s.reps!==""||s.weight!==""){sets++;reps+=+s.reps||0;weight+=+s.weight||0;volume+=(+s.reps||0)*(+s.weight||0)}})}));$("avgSets").textContent=exercises?(sets/exercises).toFixed(1):"0";$("avgReps").textContent=sets?(reps/sets).toFixed(1):"0";$("avgWeight").textContent=sets?(weight/sets).toFixed(1):"0";$("totalExercises").textContent=exercises;$("totalSets").textContent=sets;$("totalVolume").textContent=Math.round(volume).toLocaleString()}
function renderHistory(){const el=$("history");if(!history.length){el.innerHTML='<div class="empty-state">No saved workouts yet.</div>';return}el.innerHTML="";history.forEach(w=>{const sets=w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.reps!==""||s.weight!=="").length,0);const vol=w.exercises.reduce((n,e)=>n+e.sets.reduce((x,s)=>x+(+s.weight||0)*(+s.reps||0),0),0);const item=document.createElement("div");item.className="history-item";item.innerHTML=`<div class="history-top"><strong>${esc(w.name)}</strong><span>${esc(w.date)}</span></div><div class="history-meta">${w.exercises.length} exercises • ${sets} logged sets • ${Math.round(vol).toLocaleString()} kg volume</div><div class="history-summary">${w.exercises.map(e=>esc(e.name)+" — "+esc(e.machine)).join(" · ")}</div>`;el.appendChild(item)})}

let weekPlan=JSON.parse(localStorage.getItem("forgeWeekPlan")||"null") || defaultWeek();

function defaultWeek(){
  return ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day,i)=>({
    day,index:i,type:i===2||i===6?"Rest":"Training",focus:i===0?"Push":i===1?"Pull":i===2?"Rest":i===3?"Legs":i===4?"Upper":i===5?"Lower":"Rest",
    duration:+($("weekDuration")?.value||60),
    exercises:i===2||i===6?[]:["Bench Press","Lat Pulldown","Leg Press","Lateral Raise"].map(n=>EXERCISES.find(x=>x[0]===n)||[n,"Custom","custom"])
  }));
}
function makeWeek(days){
  const patterns={
    2:[["Full Body"],["Full Body"]],
    3:[["Push"],["Pull"],["Legs"]],
    4:[["Upper"],["Lower"],["Upper"],["Lower"]],
    5:[["Push"],["Pull"],["Legs"],["Upper"],["Lower"]],
    6:[["Push"],["Pull"],["Legs"],["Push"],["Pull"],["Legs"]]
  };
  const focusList=patterns[days];
  const exByFocus={
    Push:["Bench Press","Overhead Press","Lateral Raise","Triceps Pushdown"],
    Pull:["Lat Pulldown","Seated Cable Row","Dumbbell Curl","Face Pull"],
    Legs:["Back Squat","Romanian Deadlift","Leg Press","Leg Curl"],
    Upper:["Bench Press","Lat Pulldown","Overhead Press","Dumbbell Curl"],
    Lower:["Back Squat","Romanian Deadlift","Leg Press","Leg Curl"],
    "Full Body":["Back Squat","Bench Press","Lat Pulldown","Dumbbell Curl"]
  };
  let out=[], ti=0;
  for(let i=0;i<7;i++){
    if(ti<days){
      const focus=focusList[ti][0], names=exByFocus[focus]||exByFocus["Full Body"];
      out.push({day:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i],index:i,type:"Training",focus,duration:+$("weekDuration").value,
        exercises:names.map(n=>EXERCISES.find(x=>x[0]===n)||[n,"Custom","custom"])}); ti++;
    } else out.push({day:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][i],index:i,type:"Rest",focus:"Rest",duration:0,exercises:[]});
  }
  // Always preserve at least one rest day and spread it through the week for 6-day plans.
  if(days===6){out[3]={day:"Thursday",index:3,type:"Rest",focus:"Rest",duration:0,exercises:[]};out[4]={day:"Friday",index:4,type:"Training",focus:"Push",duration:+$("weekDuration").value,exercises:exByFocus.Push.map(n=>EXERCISES.find(x=>x[0]===n)||[n,"Custom","custom"])};}
  return out;
}
function renderWeek(){
  const grid=$("weekGrid"); if(!grid)return; grid.innerHTML="";
  weekPlan.forEach((d,i)=>{
    const card=document.createElement("div");card.className="day-card"+(d.type==="Rest"?" rest":"");
    const ex=d.exercises||[];
    card.innerHTML=`<div class="day-top"><span class="day-name">${d.day}</span><span class="day-number">DAY ${i+1}</span></div>
      <div class="day-type">${d.type==="Rest"?"REST DAY":d.focus.toUpperCase()}</div>
      ${d.type==="Rest"?'<div class="rest-label">Recovery<br>Mobility / easy movement optional</div>':
      `<div class="day-exercises">${ex.map(x=>`<div>• ${esc(x[0])}</div>`).join("")}</div>
       <div class="day-footer">${d.duration} min • ${ex.length} exercises</div>
       <button class="open-day" data-day="${i}">Use this day in Builder →</button>`}`;
    grid.appendChild(card);
  });
  grid.querySelectorAll(".open-day").forEach(b=>b.onclick=()=>loadWeekDay(+b.dataset.day));
}
function loadWeekDay(i){
  const d=weekPlan[i]; if(!d||d.type==="Rest")return;
  workout={name:`${d.day} — ${d.focus}`,date:today,goal:workout.goal||"muscle",duration:d.duration,bodyWeight:workout.bodyWeight||null,goalWeight:workout.goalWeight||null,timeframe:workout.timeframe||null,exercises:[]};
  d.exercises.forEach(x=>addExercise({name:x[0],machine:x[1],targetSets:3,targetReps:workout.goal==="strength"?6:10}));
  $("sessionName").value=workout.name;$("sessionDate").value=today;$("duration").value=workout.duration;
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelector('.tab[data-tab="builder"]').classList.add("active");
  document.querySelectorAll(".tab-panel").forEach(x=>x.classList.add("hidden"));$("builderTab").classList.remove("hidden");renderAll();window.scrollTo(0,0);
}
function saveWeek(){localStorage.setItem("forgeWeekPlan",JSON.stringify(weekPlan));alert("Weekly plan saved locally.")}
function generateWeek(){weekPlan=makeWeek(+$("daysPerWeek").value);renderWeek();localStorage.setItem("forgeWeekPlan",JSON.stringify(weekPlan))}

function renderAll(){renderBuilderList();renderSession();updateWeight()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

loadDraft();renderAll();renderHistory();renderStats();renderWeek();
["sessionName","sessionDate","goal","duration","currentWeight","goalWeight","timeframe"].forEach(id=>$(id).addEventListener(["currentWeight","goalWeight","timeframe"].includes(id)?"input":"change",updateFromInputs));
$("startBtn").onclick=()=>{$("welcomeScreen").classList.add("hidden");$("builderScreen").classList.remove("hidden");window.scrollTo(0,0)};
$("backBtn").onclick=()=>{$("builderScreen").classList.add("hidden");$("welcomeScreen").classList.remove("hidden")};
$("addExercise").onclick=()=>addExercise();
$("generateSuggested").onclick=suggested;
$("saveWorkout").onclick=saveWorkout;
$("clearWorkout").onclick=()=>{if(confirm("Clear the current workout?")){workout={name:"Workout",date:today,goal:"muscle",duration:60,bodyWeight:null,goalWeight:null,timeframe:null,exercises:[]};$("sessionName").value="Workout";saveDraft();renderAll()}};
$("clearHistory").onclick=()=>{if(confirm("Delete all saved workout history from this browser?")){history=[];localStorage.removeItem("forgeHistory");renderHistory();renderStats()}};
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".tab-panel").forEach(x=>x.classList.add("hidden"));$(t.dataset.tab+"Tab").classList.remove("hidden")});
$("autoWeek").onclick=generateWeek;$("saveWeek").onclick=saveWeek;$("daysPerWeek").onchange=generateWeek;$("weekDuration").onchange=()=>{weekPlan.forEach(d=>{if(d.type==="Training")d.duration=+$("weekDuration").value});renderWeek()};
$("themeToggle").onclick=()=>{document.body.classList.toggle("light");$("themeToggle").textContent=document.body.classList.contains("light")?"☀":"☾"};
