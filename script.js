const homePage = document.getElementById('homePage');
const addFlightPage = document.getElementById('addFlightPage');

document.getElementById('addFlightBtn').addEventListener('click', () => {
  homePage.style.display = 'none';
  addFlightPage.style.display = 'block';
});

document.getElementById('flightForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const flightData = {
    flightNumber: document.getElementById('flightNumber').value,
    departure: document.getElementById('departure').value,
    destination: document.getElementById('destination').value,
    airline: document.getElementById('airline').value,
    tripType: document.getElementById('tripType').value
  };

  let flights = JSON.parse(localStorage.getItem('flights')) || [];
  flights.push(flightData);
  localStorage.setItem('flights', JSON.stringify(flights));

  alert('航班資料已送出！');
  this.reset();

  homePage.style.display = 'block';
  addFlightPage.style.display = 'none';
  loadFlights();
});

function loadFlights() {
  const outboundList = document.getElementById('outboundList');
  const returnList = document.getElementById('returnList');

  outboundList.innerHTML = '';
  returnList.innerHTML = '';

  const flights = JSON.parse(localStorage.getItem('flights')) || [];

  flights.forEach((flight, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `航班：${flight.flightNumber}，起飛：${flight.departure}，目的地：${flight.destination}，航空公司：${flight.airline}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.textContent = '刪除';
    deleteBtn.addEventListener('click', () => {
      deleteFlight(index);
    });

    listItem.appendChild(deleteBtn);

    if (flight.tripType === '去程') {
      outboundList.appendChild(listItem);
    } else if (flight.tripType === '回程') {
      returnList.appendChild(listItem);
    }
  });
}

function deleteFlight(index) {
  let flights = JSON.parse(localStorage.getItem('flights')) || [];
  flights.splice(index, 1);
  localStorage.setItem('flights', JSON.stringify(flights));

  loadFlights();
}

loadFlights();
