# Calculator App

A simple calculator application built with HTML, CSS, and JavaScript.

## Features

- Basic Arithmetic (+, -, ×, ÷)
- Percentage (%)
- Backspace
- Clear (AC)
- Keyboard Support
- Responsive Design
- Clean Code Architecture

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla)

## Folder Structure

Calculator-App/
│
├── index.html
├── style.css
├── script.js
├── README.md

## Future Plans

- Dark / Light Mode
- Calculation History
- Convert to APK
- Scientific Calculator

## Author

Fatih Kanz Al-Fajri


## Function
updateDisplay()
→ mengurus tampilan

clearDisplay()
→ mengurus AC

backspace()
→ menghapus karakter

percentage()
→ mengurus %

calculate()
→ menghitung ekspresi

appendValue()
→ menangani angka dan titik

handleOperator()
→ menangani operator

handleInput()
→ menentukan input harus pergi ke mana

event listener
→ menerima klik tombol





jika value === "%"
    cari operator terakhir
    ambil angka sebelum operator
    ambil angka setelah operator

    jika operator === "+, -"
        angka sebelum operator x (angka setelah operator / 100)
        selesai

    jika operator === "*, /"
        bagi angka setelah operator dengan 100
        selesai

    masukkan hasil ke currentinput
    updatevalue()