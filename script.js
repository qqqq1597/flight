// Firebase 初始化
const db = firebase.firestore();

// 顯示首頁和新增頁面
const homePage = document.getElementById('homePage');
const addFlightPage = document.getElementById('addFlightPage');

// 點擊新增航班按鈕，切換頁面
document.getElementById('addFlightBtn').addEventListener('click', () => {
  homePage.style.display = 'none';
  addFlightPage.style.display = 'block';
});

// 提交表單時，將航班資料儲存到 Firestore
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
    // 儲存資料到 Firestore
    await db.collection("flights").add(flightData);

    alert('航班資料已送出！');
    this.reset();

    // 切換回首頁，並加載航班資料
    homePage.style.display = 'block';
    addFlightPage.style.display = 'none';
    loadFlights();
  } catch (error) {
    console.error("錯誤:", error);
    alert("航班資料儲存失敗！");
  }
});

// 載入 Firestore 中的航班資料
async function loadFlights() {
  const outboundList = document.getElementById('outboundList');
  const returnList = document.getElementById('returnList');

  outboundList.innerHTML = '';
  returnList.innerHTML = '';

  try {
    // 從 Firestore 加載所有航班
    const querySnapshot = await db.collection("flights").get();
    
    querySnapshot.forEach(doc => {
      const flight = doc.data();
      const listItem = document.createElement('li');
      listItem.textContent = `航班：${flight.flightNumber}，起飛：${flight.departure}，目的地：${flight.destination}，航空公司：${flight.airline}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.textContent = '刪除';
      deleteBtn.addEventListener('click', () => {
        deleteFlight(doc.id); // 使用 doc.id 刪除
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

// 刪除 Firestore 中的航班資料
async function deleteFlight(flightId) {
  try {
    // 刪除指定的航班
    await db.collection("flights").doc(flightId).delete();

    alert('航班已刪除！');
    loadFlights(); // 刪除後重新載入航班
  } catch (error) {
    console.error("錯誤:", error);
    alert("刪除航班失敗！");
  }
}

// 頁面加載時載入航班資料
loadFlights();
