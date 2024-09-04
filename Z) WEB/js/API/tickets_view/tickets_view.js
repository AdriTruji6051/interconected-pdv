const dateInput = document.getElementById('date');
const ticketTable = document.getElementById('table-body-tickets');

const hoy = new Date().toISOString().split('T')[0];

dateInput.value = hoy;
var ticketsInfo = {};

const append_ticket_to_table = (ticket, ) => {
    console.log(ticket);
    const row = document.createElement('tr');
    row.id = `${ticket.id}`;

    row.innerHTML = `
        <td>${ticket.folio}</td>
        <td>${ticket.total}</td>
        <td>${ticket.articulos}</td>
        <td>${ticket.hour}</td>
    `;

    ticketTable.appendChild(row);
};

async function getTicketsDay(day){
    ticketTable.innerHTML = '';

    const tickets = await getTickets(dateInput.value);
    ticketsInfo = tickets;

    for(let key in ticketsInfo) append_ticket_to_table(ticketsInfo[key]);
};

dateInput.addEventListener('change', function(){
    getTicketsDay(dateInput.value);
});



