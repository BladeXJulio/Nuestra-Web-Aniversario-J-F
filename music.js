/* ============================
        MUSICA
============================ */

function startMusic(){

    music.volume=0;

    music.currentTime=0;

    music.play();

    fadeIn();

}

function fadeIn(){

    const interval=setInterval(()=>{

        if(music.volume<0.98){

            music.volume+=0.02;

        }else{

            music.volume=1;

            clearInterval(interval);

        }

    },60);

}

music.addEventListener("ended",()=>{

    fadeOut();

});

function fadeOut(){

    music.volume=1;

    const interval=setInterval(()=>{

        if(music.volume>0.02){

            music.volume-=0.02;

        }else{

            music.volume=0;

            clearInterval(interval);

            setTimeout(()=>{

                music.currentTime=0;

                music.play();

                fadeIn();

            },5000);

        }

    },40);

}
