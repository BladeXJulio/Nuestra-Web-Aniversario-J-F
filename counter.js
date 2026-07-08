const title = document.getElementById("daysTogether");
const counter = document.getElementById("loveCounter");

const startDate = new Date("2025-06-29T20:16:00");

function updateLoveCounter(){

    const now = new Date();

    const diff = now - startDate;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor(diff / 1000);

    title.textContent = `${days} días contigo`;

    counter.innerHTML = `
        ${hours.toLocaleString()} horas compartidas<br>
        ${minutes.toLocaleString()} minutos eligiéndote<br>
        ${seconds.toLocaleString()} segundos de nuestra historia
    `;

}

updateLoveCounter();