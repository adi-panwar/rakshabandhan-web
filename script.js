const $=id=>document.getElementById(id);
const questions=[
 {text:"क्या तुम इस दुनिया की सबसे खूबसूरत लड़की हो? ❤️",bad:"yes",icon:"👑",hint:"Sach-sach answer dena. 👀",msg:"Maan jao, ab NO daba bhi do 😂"},
 {text:"क्या तुम्हारी शक्ल बंदर से मिलती है? 🐒",bad:"no",icon:"🐒",hint:"Bhai ki taraf se very scientific question.",msg:"Maan jao, ab YES daba bhi do 😂"},
 {text:"क्या तुम 2 month में 1 बार नहाती हो? 😂",bad:"no",icon:"🛁",hint:"Hygiene department is waiting...",msg:"Maan jao, ab YES daba bhi do 😂"},
 {text:"क्या तुम भाई से ज्यादा smart हो? 🤨",bad:"yes",icon:"🧠",hint:"Careful. This is a trap.",msg:"Maan jao, ab NO daba bhi do 😂"},
 {text:"क्या तुम मेरी हर बात मानती हो? 😂",bad:"yes",icon:"😎",hint:"Is question ka answer bahut important hai.",msg:"Maan jao, ab NO daba bhi do 😂"}
];
let q=0,tries=0,selected=null,tiles=[],swaps=0;

function show(id){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}
function setQuestion(){
 const a=questions[q];
 $("counter").textContent=`0${q+1} / 05`; $("progress").style.width=((q+1)*20)+"%";
 $("qnum").textContent=`QUESTION 0${q+1}`; $("qicon").textContent=a.icon;
 $("question").textContent=a.text; $("hint").textContent=a.hint;
 $("attemptMsg").textContent=""; tries=0; resetButtons();
}
function resetButtons(){
 ["yes","no"].forEach(id=>{const b=$(id);b.classList.remove("runaway");b.style.left="";b.style.top=""});
}
function answer(which){
 if(which===questions[q].bad)return;
 if(q<4){q++;setQuestion()}else show("photos");
}
function moveBad(){
 const bad=questions[q].bad,b=$(bad==="yes"?"yes":"no");
 tries++;
 // IMPORTANT: first message appears only AFTER the 5th failed attempt.
 if(tries===5){
   $("attemptMsg").textContent=questions[q].msg;
 }else if(tries>=9){
   $("attemptMsg").textContent="Chee chee chee 😭 ab to maan jao!";
 }else{
   $("attemptMsg").textContent="";
 }
 b.classList.add("runaway");
 const margin=12, maxX=Math.max(margin,innerWidth-b.offsetWidth-margin);
 const minY=85,maxY=Math.max(minY,innerHeight-b.offsetHeight-margin);
 b.style.left=(margin+Math.random()*Math.max(1,maxX-margin))+"px";
 b.style.top=(minY+Math.random()*Math.max(1,maxY-minY))+"px";
}
$("startBtn").addEventListener("click",()=>{q=0;show("quiz");setQuestion()});
$("yes").addEventListener("click",()=>answer("yes"));$("no").addEventListener("click",()=>answer("no"));
$("yes").addEventListener("mouseenter",()=>{if(questions[q].bad==="yes")moveBad()});
$("no").addEventListener("mouseenter",()=>{if(questions[q].bad==="no")moveBad()});
function touchRun(e,which){if(questions[q].bad===which){e.preventDefault();e.stopPropagation();moveBad()}}
$("yes").addEventListener("pointerdown",e=>touchRun(e,"yes"),{passive:false});
$("no").addEventListener("pointerdown",e=>touchRun(e,"no"),{passive:false});
$("yes").addEventListener("touchstart",e=>touchRun(e,"yes"),{passive:false});
$("no").addEventListener("touchstart",e=>touchRun(e,"no"),{passive:false});

$("puzzleBtn").addEventListener("click",()=>{show("puzzlePage");initPuzzle()});
$("giftBtn").addEventListener("click",()=>show("gift"));
$("replay").addEventListener("click",()=>show("intro"));

function initPuzzle(){
 tiles=[0,1,2,3,4,5,6,7,8];swaps=0;selected=null;
 for(let i=0;i<55;i++){let a=Math.floor(Math.random()*9),b=Math.floor(Math.random()*9);if(a!==b)[tiles[a],tiles[b]]=[tiles[b],tiles[a]]}
 if(tiles.every((v,i)=>v===i))[tiles[0],tiles[1]]=[tiles[1],tiles[0]];
 renderPuzzle();
}
function renderPuzzle(){
 const p=$("puzzle");p.innerHTML="";
 tiles.forEach((v,i)=>{const b=document.createElement("button");b.type="button";b.className="tile"+(selected===i?" selected":"");const r=Math.floor(v/3),c=v%3;b.style.backgroundPosition=`${c*50}% ${r*50}%`;b.addEventListener("click",()=>pick(i));p.appendChild(b)});
 $("swaps").textContent=swaps;
}
function pick(i){
 if(selected===null){selected=i;renderPuzzle();return}
 if(selected===i){selected=null;renderPuzzle();return}
 [tiles[selected],tiles[i]]=[tiles[i],tiles[selected]];selected=null;swaps++;renderPuzzle();
 if(tiles.every((v,i)=>v===i)){$("puzzleMsg").textContent=`Solved in ${swaps} swaps! 😳👏`;$("giftBtn").classList.remove("hidden")}
 else $("puzzleMsg").textContent=swaps>15?"Focus karo bhai. 😂":"Almost there! 🪢";
}