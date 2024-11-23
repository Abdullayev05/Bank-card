// Sayfa yükləndikdə əvvəllər saxlanmış məlumatları yoxla
window.addEventListener("load", function () {
    const savedData = localStorage.getItem("cardData");

    // Əgər saxlanmış məlumat varsa, onları JSON formatında al
    if (savedData) {
        const cardData = JSON.parse(savedData);

        // Məlumatları console-da göstər
        console.log("Saved API data:", JSON.stringify(cardData, null, 2));
    }
});

// Form göndərildikdə
document.getElementById("cardForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Sayfanın yenilənməsinin qarşısını alır

    // Kart məlumatlarını topla
    const cardHolder = document.getElementById("cardHolder").value;
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Yeni kart məlumatlarını JSON formatında yarat
    const newCardData = {
        cardHolder: cardHolder,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv
    };

    // Əvvəlki məlumatları localStorage-dan al
    const savedData = localStorage.getItem("cardData");
    let allCardData = [];

    // Əgər əvvəllər saxlanmış məlumat varsa, onları array-ə çevir
    if (savedData) {
        allCardData = JSON.parse(savedData);
    }

    // Yeni məlumatı əlavə et
    allCardData.push(newCardData);  // Yalnız əlavə et, əvvəlki məlumatları silmə

    // Bütün məlumatları yenidən localStorage-a yaz
    localStorage.setItem("cardData", JSON.stringify(allCardData));

    // Bütün məlumatları API kimi konsola göstər
    console.log("API Response (All Data):", JSON.stringify(allCardData, null, 2));

    // Formu sıfırla (input sahələrini boşalt)
    document.getElementById("cardForm").reset();
});

// Kart nömrəsini 16 simvola qədər məhdudlaşdırmaq
document.getElementById("cardNumber").addEventListener("input", function (event) {
    let value = event.target.value.replace(/\D/g, ''); // Yalnız rəqəmləri saxla
    if (value.length > 16) {
        value = value.substring(0, 16); // 16 simvoldan artıq yazılmasına icazə vermə
    }

    // 4 rəqəmli qruplar şəklində göstərmək (#### #### #### ####)
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

    event.target.value = value;
});

// Son istifadə tarixini yalnız 12 aya qədər məhdudlaşdırmaq
document.getElementById("expiryDate").addEventListener("input", function (event) {
    let value = event.target.value.replace(/\D/g, ''); // Yalnız rəqəmləri saxla
    if (value.length > 4) {
        value = value.substring(0, 4); // MMYY formatında 4 rəqəmdən artıq olmamalıdır
    }

    if (value.length >= 2) {
        const month = value.substring(0, 2);
        if (parseInt(month) > 12) {
            event.target.value = "12"; // Əgər ay 12-dən böyükdürsə, onu 12-yə məhdudlaşdır
            return;
        }
    }

    event.target.value = value.substring(0, 2) + (value.length >= 2 ? '/' : '') + value.substring(2, 4);
});
