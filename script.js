const homePage = document.getElementById('homePage');
const addFlightPage = document.getElementById('addFlightPage');

document.getElementById('addFlightBtn').addEventListener('click', () => {
  homePage.style.display = 'none';
  addFlightPage.style.display = 'block';
});

window.goHome = () => {
  addFlightPage.style.display = 'none';
  homePage.style.display = 'block';
};

document.getElementById('flightForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const flightData = {
    flightNumber: document.getElementById('flightNumber').value,
    departure: document.getElementById('departure').value,
    destination: document.getElementById('destination').value,
    airline: document.getElementById('airline').value,
    tripType: document.getElementById('tripType').value,
  };

  try {
    await db.collection("flights").add(flightData);
    alert('航班資料已送出！');
    this.reset();
    goHome();
    loadFlights();
  } catch (error) {
    console.error("錯誤:", error);
    alert("航班資料儲存失敗！");
  }
});

async function loadFlights() {
  const outboundList = document.getElementById('outboundList');
  const returnList = document.getElementById('returnList');

  outboundList.innerHTML = '';
  returnList.innerHTML = '';

  try {
    const querySnapshot = await db.collection("flights").get();
    querySnapshot.forEach(doc => {
      const flight = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `航班：${flight.flightNumber}，起飛：${flight.departure}，目的地：${flight.destination}，航空公司：${flight.airline}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.textContent = '刪除';
      deleteBtn.addEventListener('click', () => {
        deleteFlight(doc.id);
      });

      listItem.appendChild(deleteBtn);

      if (flight.tripType === '去程') {
        outboundList.appendChild(listItem);
      } else if (flight.tripType === '回程') {
        returnList.appendChild(listItem);
      }
    });
  } catch (error) {
    console.error("錯誤:", error);
    alert("無法載入航班資料！");
  }
}

async function deleteFlight(flightId) {
  try {
    await db.collection("flights").doc(flightId).delete();
    alert('航班已刪除！');
    loadFlights();
  } catch (error) {
    console.error("錯誤:", error);
    alert("刪除航班失敗！");
  }
}

// 頁面一開始就載入航班
loadFlights();
