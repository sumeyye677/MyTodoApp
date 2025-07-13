# Görev Yönetim Uygulaması 

## Web Live Link: https://customtodoapp.netlify.app/ ##

Merhaba! Bu küçük web uygulaması, JavaScript kullanarak geliştirdiğim bir **görev yönetim sistemi**. Amacım, kullanıcıların görevlerini kolayca ekleyip düzenleyebileceği, tamamladıklarını işaretleyip silebileceği basit ama işlevsel bir arayüz sunmaktı.

## ✨ Neler Yapabilirim?

- Görev başlığı, açıklama, bitiş tarihi ve öncelik bilgisi girerek yeni görev ekleyebilirsin.
- Görevleri **tamamlandı** olarak işaretleyebilir ya da istersen **geri alabilirsin**.
- Görevleri düzenleyebilir veya silebilirsin.
- Arama kutusu sayesinde görevler içinde kolayca arama yapabilirsin.
- "Tamamlananlar", "Bekleyenler", "Gecikmiş" gibi filtreler sayesinde istediğin görevlere anında ulaşabilirsin.
- Ekstra olarak görevleri **öncelik, başlık, tarih ya da kategoriye göre sıralayabilirsin.**
- Uygulama **karanlık mod** destekliyor! Sağ üstteki 🌙 simgesine tıklayarak geçiş yapabilirsin.
- Ayrıca aşağıda küçük bir istatistik bölümü de var; kaç görev eklenmiş, kaçı tamamlanmış gibi veriler burada gösteriliyor.

## 🛠️ Nasıl Çalışıyor?

Projede sadece **HTML, CSS ve JavaScript** kullandım. Framework ya da dış kütüphane kullanmadan, tamamen Vanilla JS ile DOM üzerinden elemanları oluşturup yönetiyorum. Form validasyonu, olay yakalama, event delegation gibi kavramları da kullandım. Görevler geçici olarak bellekte tutuluyor.

## 💾 Not

Sayfa yenilendiğinde veriler kaybolur. Bu versiyonda kalıcı kayıt için localStorage yerine sadece geçici bellek kullanıldı. İleride bunu geliştirmek kolay.

## 📁 Dosya Yapısı

index.html → Uygulama arayüzü
style.css → Tasarım ve responsive stiller
script.js → Uygulamanın iş mantığı (ekleme, silme, filtreleme vs.)

![aaaaa](https://github.com/user-attachments/assets/df8af45f-fc25-4c63-be3c-1850e2482eaa)

## 📌 Kısayollar

- `Ctrl + Enter` → Formu hızlıca gönder  
- `Escape` → Formu ve aramayı temizle  
- `Ctrl + F` → Arama kutusuna odaklan  

## 🖥️ Nasıl Çalıştırılır?

1. Bu klasörü bilgisayarına indir.
2. Visual Studio Code ile aç.
3. `index.html` dosyasını çift tıklayarak tarayıcıda açabilir ya da Live Server ile çalıştırabilirsin.
4. Uygulama tarayıcıda anında çalışmaya hazır 🎉

---

Bu proje, JavaScript öğrenme sürecimde DOM manipülasyonu, event handling ve kullanıcı etkileşimi konularını pekiştirmek için hazırlanmıştır. Kendi ihtiyaçlarına göre düzenleyebilir, yeni özellikler ekleyebilirsin.

Teşekkürler 🙌
