var socket = io.connect('http://localhost:4000');

var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output');


btn.addEventListener('click', function(){
  socket.emit('chat', {
      message: message.value,
      handle: handle.value
  });
  message.value = "";
});

socket.on('chat', function(data){
    
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    input = data.message;
    morse(input);
});





function morse(input) {  
    const 
       audioContext = new (window.AudioContext || window.webkitAudioContext),
       outputType = ['audio', 'vibrate', 'blink'],
       dit = 65, // base length of signal
       dah = dit * 3,
       symbolSpace = dit,
       letterSpace = dah,
       wordSpace = dit * 7,
       toneFrequency = 600, //Hz
       morseChars = {
         " "  : "/",
         "a"  : "·−",
         "b"  : "−···",
         "c"  : "−·−·",
         "d"  : "−··",
         "e"  : "·",
         "f"  : "··−·",
         "g"  : "−−·",
         "h"  : "····",
         "i"  : "··",
         "j"  : "·−−−",
         "k"  : "−·−",
         "l"  : "·−··",
         "m"  : "−−",
         "n"  : "−·",
         "o"  : "−−−",
         "p"  : "·−−·",
         "q"  : "−−·−",
         "r"  : "·−·",
         "s"  : "···",
         "t"  : "−",
         "u"  : "··−",
         "v"  : "···−",
         "w"  : "·−−",
         "x"  : "−··−",
         "y"  : "−·−−",
         "z"  : "−−··",
         "1"  : "·−−−−",
         "2"  : "··−−−",
         "3"  : "···−−",
         "4"  : "····−",
         "5"  : "·····",
         "6"  : "−····",
         "7"  : "−−···",
         "8"  : "−−−··",
         "9"  : "−−−−·",
         "0"  : "−−−−−",
         "à"  : "·−−·−",
         "ä"  : "·−·−",
         "è"  : "·−··−",
         "é"  : "··−··",
         "ö"  : "−−−·",
         "ü"  : "··−−",
         "ß"  : "···−−··",
         "ñ"  : "−−·−−",
         "."	 : "·−·−·−",
         ","	 : "−−··−−",
         ":"	 : "−−−···",
         ";"	 : "−·−·−·",
         "?"	 : "··−−··",
         "-"	 : "−····−",
         "_"  : "··−−·−",
         "("	 : "−·−−·",
         ")"	 : "−·−−·−",
         "'"	 : "·−−−−·",
         "="	 : "−···−",
         "+"	 : "·−·−·",
         "/"	 : "−··−·",
         "@"	 : "·−−·−·"
       };
     
     if (outputType.includes('audio') && !AudioContext) {
         alert("Sorry! No audio in your browser 😢");
         return;
     }
     
     function inputToMorse(input) {
       if (!input) {return;}
       const characters = input.toLowerCase().trim().split('');
       let output = [];
       characters.forEach(character => {
         if (morseChars[character]) {
           output.push(morseChars[character]);
         }
       });
       return output;
     }
     
     function morseCodeToTime(input) {
       let output = []; // Alternating beep and silence lenghts
       let morseCode = inputToMorse(input);
       morseCode.forEach((set, index) => {
         let singleCharacters = set.split('');
         singleCharacters.forEach(char => {
           switch (char) {
             case "/":
               output.pop();
               output.push(wordSpace);
               break;
             case "·":
               output.push(dit, symbolSpace);
               break;
             case "−":
               output.push(dah, symbolSpace);
               break;
           }
         });
         if (output.slice(-1)[0] !== wordSpace) {
           output.pop();
           output.push(letterSpace);
         }
       });
       return output;
     }
     
     function playSound(sequence) {
       const audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
       oscillator = audioCtx.createOscillator();
       oscillator.type = 'sine';
       oscillator.frequency.setValueAtTime(toneFrequency, audioCtx.currentTime);
       let time = audioCtx.currentTime;
   
       let gainNode = audioCtx.createGain();
       gainNode.gain.setValueAtTime(0, time);
       
       sequence.forEach(function(symbol, index) {
           if (index % 2) {
             gainNode.gain.setValueAtTime(0, time);
             time += symbol / 1000;
           } else {
             gainNode.gain.setValueAtTime(1, time);
             time += symbol / 1000;
           }
       });
       oscillator.connect(gainNode);
       gainNode.connect(audioCtx.destination);
       oscillator.start();
     }
   
     function runSequence(input) {
       let timeSequence = morseCodeToTime(input);
       navigator.vibrate(timeSequence);
       playSound(timeSequence);
     };
     runSequence(input);
   };
   

