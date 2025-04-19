function updateDateTime() {
  // वर्तमान तारीख और समय प्राप्त करें
  const currentDateTime = new Date();
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();

  // समय को फॉर्मेट करें (HH:MM:SS)
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  // 'dateTime' div में समय सेट करें
  document.getElementById('dateTime').innerText = formattedTime;
}

// हर एक सेकंड में समय को अपडेट करने के लिए setInterval का उपयोग करें
setInterval(updateDateTime, 1000);

// पेज लोड होने पर तुरंत समय दिखाने के लिए
updateDateTime();
