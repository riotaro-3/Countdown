const message= document.getElementById('message');
let minutes=document.getElementById('minutes');
const time=document.getElementById('time');
const message1=document.getElementById('message1');
const start=document.getElementById('start');
const line=document.getElementById('line');
let timer;/*カウントダウンのfunctionをブロック外でも使えるよう */
let running= false;/*カウントが動いてるかどうか */
let value;/*入力内容を数値化したもの */
let second=0;
let hun=0;
let music;/*終了音 */
let music2;
let voices=[];/*メッセージ音声 */
speechSynthesis.onvoiceschanged = e => {
  voices=speechSynthesis.getVoices();
}
let width;
let width2= 80;
width =Number(80);
let et= false;

start.addEventListener('click',async function() {/*スタートボタンが押された時 */
  if (!music2) {
    music2=new Audio('music.mp3');
    await music2.play();
    music2.pause();
    music2.currentTime=0;
  }
  if (!et) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(""));  // 無音で読み上げ開始
    et = true;
  }
  
  if (!music) {
      music = new Audio('Countdawn.mp3');
  }
  else {
    music.pause();
    music.currentTime=0;
  }

  if (!running) {/*カウントが動いてたら一時停止ボタンの役割になる */
    
    value=Number(minutes.value);/*入力内容を数値化してる */

    if (second>0&&hun===value) {/*スタートボタンが押された時一時停止後のスタートかどうか */
      running=true;
      document.getElementById('start').textContent='一時停止';
      start.style.backgroundColor='#ED1A3D';
      message.style.opacity=0;

      loop();/*カウントダウンのfunction */
    }

    else {/*こっちが最初のスタートボタンだった時の役割 */
      message1.style.opacity=0;/*応援メッセージを透明化してる */

      value=Number(minutes.value);

      hun=value;

      if (!Number.isInteger(value)||value===''||value<=0) {/*入力内容が整数じゃないかどうか */
        document.getElementById('message').textContent='整数を入力しましょう！';/*注意メッセージの文を書き換えてる */
        message.style.opacity=1;/*透明化解除で注意メッセージを表示 */
        message1.style.opacity=0;
        document.getElementById('message1').textContent='応援メッセージ';
        document.getElementById('time').textContent='00:00:00';
        running= false;
        second=0;
      }

      else {/*こっちが整数だった時の役割 */
       document.getElementById('message').textContent='注意メッセージ';
       document.getElementById('start').textContent='一時停止';/*スタートボタンを一時停止ボタンにしてる */
       start.style.backgroundColor='#ED1A3D';/*スタートボタンを一時停止ボタンにしてる */
       message.style.opacity=0;

       if (value<60){/*入力内容が1時間以下かどうか */
       document.getElementById('time').textContent=`00:${String(value).padStart(2,'0')}:00`;/*最初の表示時間 */
       }

       else {
         const hours=Math.floor(value/60);/*時 */
         const min=Math.floor(value%60);/*分 */
         document.getElementById('time').textContent=`${String(hours).padStart(2,'0')}:${String(min).padStart(2,'0')}:00`;/*最初の表示時間 */
       }
       line.style.width = 80+"%";
  
       second=60*minutes.value;/*秒 */

       width =(80/second);

       width2=80;

       running= true;

       loop();/*カウントダウンのfunction */
      }

    }

  } 

  else {/*カウントが動いてなかった時、一時停止の役割 */
     document.getElementById('start').textContent='スタート';
     start.style.backgroundColor='#3b82f6';
     clearInterval(timer);/*カウントの停止 */
     running= false;
     time.style.animation='none';/*点滅を消す*/
     if (music) {/*終了音を消す*/
      music.pause();
      music.currentTime=0;
      }
    }

});

let reset=document.getElementById('reset');
function a() {/*リセットボタンが押された時の役割*/
  clearInterval(timer);
  message.style.opacity=0;
  message1.style.opacity=0;
  document.getElementById('time').textContent='00:00:00';
  document.getElementById('message').textContent='注意メッセージ';
  document.getElementById('message1').textContent='応援メッセージ';
  minutes.value='';
  document.getElementById('start').textContent='スタート';
  start.style.backgroundColor='#3b82f6';
  running = false;
  second=0;
  time.style.animation='none';
  line.style.width = 80+"%";
  width2=80;
  if (music) {
  music.pause();
  music.currentTime=0;
  }
}
reset.addEventListener('click',a);/*リセットが押された時*/

function loop() { /*カウントダウンのfunction*/
  timer=setInterval(() => {
   second -= 1;
   const minute=Math.floor((second/60)%60);
   const hour=Math.floor((second/60)/60);
   const second2=second%60;
   if (hour===0) {/*入力内容が1時間未満だったら*/
    document.getElementById('time').textContent=`00:${String(minute).padStart(2,'0')}:${String(second2).padStart(2,'0')}`;
   }
   else {/*入力内容が1時間以上だったら*/
    document.getElementById('time').textContent=`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second2).padStart(2,'0')}`;
   }
   width2 -=width;
   line.style.width = width2+"%";
   if (second===300) {/*残り時間5分の時*/
     const uttr= new SpeechSynthesisUtterance('残り5分だよ');
     uttr.voice=voices[0];
     speechSynthesis.speak(uttr);
     message1.textContent='残り5分だよ!';
     message1.style.opacity=1;
   }
   else if (second===180) {/*残り時間3分の時*/
     const uttr= new SpeechSynthesisUtterance('残り3分だよ');
     uttr.voice=voices[0];
     speechSynthesis.cancel();
     speechSynthesis.speak(uttr);
     message1.textContent='残り3分だよ!';
     message1.style.opacity=1;
   }
   else if (second===60) {/*残り時間1分の時*/
     const uttr= new SpeechSynthesisUtterance('残り1分、もう少し');
     uttr.voice=voices[0];
     speechSynthesis.cancel();
     speechSynthesis.speak(uttr);
     message1.textContent='残り1分!もう少し!';
     message1.style.opacity=1;
   }
   else if (second<=10&&second>0) {/*残り時間1分からカウント終了まで*/
    time.style.animation='blink-slow 1s infinite';
  }
   else if (second<=0) {/*残り時間0秒の時*/
     clearInterval(timer);
     const uttr= new SpeechSynthesisUtterance('時間になりました');
     uttr.voice=voices[0];
     speechSynthesis.cancel();

     uttr.onend = () => {
      music.currentTime = 0;
      music.play();
    };

     speechSynthesis.speak(uttr);
     document.getElementById('time').textContent='00:00:00';
     message1.textContent='時間になりました';
     message1.style.opacity=1;
     time.style.animation='none';
     document.getElementById('start').textContent='スタート';
     start.style.backgroundColor='#3b82f6';
     running = false;
     width2=80;
   }
 },1000);
}

function inputs () {/*入力内容が4桁以下の整数以外にならないようにしてるfunction*/
  var inpus=document.getElementById('minutes');
  var inpus1=inpus.value;

  if(!/^[0-9]{1,4}$/.test(inpus1)) {
    minutes.value = '';
  } 
}

minutes.addEventListener('input',inputs);/*入力された時*/
