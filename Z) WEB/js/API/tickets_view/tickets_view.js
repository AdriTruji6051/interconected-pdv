const dateInput = document.getElementById('date');
const findedTicketTable = document.getElementById('table-body-tickets');
const ticketPreviewTable = document.getElementById('ticket-prev-table');
const btnReprintTicket = document.getElementById('btn-reprint');
const selectPrinter = document.getElementById('select-printer');

const hoy = new Date().toISOString().split('T')[0];

var ticketsInfo = {};
var selectedFindedTicketRow = null;

dateInput.value = hoy;
getTicketsDay(hoy)

const manageKey = (event) =>{
    const key = event.key;
    if(key === 'ArrowDown') go_to_next_finded_ticket();
    else if(key === 'ArrowUp') go_to_previous_finded_ticket();
}

btnReprintTicket.addEventListener('click', function(){
    rePrintTicket(selectedFindedTicketRow.id, selectPrinter.value);
});

const append_ticket_to_table = (ticket) => {
    console.log(ticket);
    const row = document.createElement('tr');
    row.id = `${ticket.id}`;

    row.innerHTML = `
        <td>${ticket.folio}</td>
        <td>${ticket.total}</td>
        <td>${ticket.articulos}</td>
        <td>${ticket.hour}</td>
    `;

    findedTicketTable.appendChild(row);
};

const go_to_previous_finded_ticket = () =>{
    const previousNode = selectedFindedTicketRow.previousSibling;
    if(previousNode) focus_row_on_finded_tickets(previousNode);
};

const go_to_next_finded_ticket = () =>{
    const nextNode = selectedFindedTicketRow.nextSibling;
    if(nextNode) focus_row_on_finded_tickets(nextNode);
};

const render_ticket = () => {
    ticketPreviewTable.innerHTML = '';
    ticket = ticketsInfo[selectedFindedTicketRow.id];

    ticket.productos.forEach(producto => {
        const p = document.createElement('tr');
        p.innerHTML = `
            <td>${producto[2]}</td>
            <td>${producto[1]}</td>
            <td>${producto[2] * producto[3]}</td>
        `;
        ticketPreviewTable.appendChild(p);
    });
};

const focus_row_on_finded_tickets = (row) => {
    if(selectedFindedTicketRow){
        selectedFindedTicketRow.classList.remove('table-primary');
    }
    row.classList.add('table-primary');
    selectedFindedTicketRow = row;
    render_ticket();
}

async function getTicketsDay(day){
    findedTicketTable.innerHTML = '';

    const tickets = await getTickets(dateInput.value);
    ticketsInfo = tickets;

    for(let key in ticketsInfo) append_ticket_to_table(ticketsInfo[key]);
    focus_row_on_finded_tickets(findedTicketTable.firstChild);
};

dateInput.addEventListener('change', function(){
    getTicketsDay(dateInput.value);
});

document.addEventListener('keydown', manageKey);

window.onload = async function(){
    var isFirst = true;
    const printers = await get_printers();
    
    printers.forEach(printer => {
        const printOption = document.createElement('option');
        if(isFirst) printOption.selected = true;
        printOption.value = printer;
        printOption.innerText = printer;
        selectPrinter.appendChild(printOption);
        isFirst = false;
    });
}




