/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()

let transactions = [];
const TRANSACTION_KEY = "TRANSACTIONS";
let editingTransactionId = null;
const RENDER_EVENT = "transaction:updated";
const containerIncome = document.getElementById("incomeCardContainer");
const containerExpense = document.getElementById("expenseCardContainer");

function generateID() {
    return +new Date();
}


/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM
const incomeListElement = document.getElementById("incomeList");
const expenseListElement = document.getElementById("expenseList");


/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

function updateTransactionList() {
    incomeListElement.innerHTML = "";
    expenseListElement.innerHTML = "";

    const inputSearch = inputSearchElement.value.toLowerCase().trim();
    const filteredTransaction = transactions.filter((item) => item.title.toLowerCase().includes(inputSearch));
    const incomeResult = filteredTransaction.filter((item) => item.type === "income");
    const expenseResult = filteredTransaction.filter((item) => item.type === "expense");

    if(incomeResult.length === 0) {
        containerIncome.style.display = "none";
    } else {
        containerIncome.style.display = "";
    }

    if(expenseResult.length === 0) {
        containerExpense.style.display = "none";
    } else {
        containerExpense.style.display = "";
    }

    for (const transaction of filteredTransaction) {
        const cardElement = document.createElement("div");
        const titleElement = document.createElement("h3");
        const amountElement = document.createElement("p");
        const dateTimeElement = document.createElement("p");
        const typeTransactionElement = document.createElement("p");
        const wrapperButtonElement = document.createElement("div");
        const buttonEditTypeElement = document.createElement("button");
        const buttonEditTransactionElement = document.createElement("button");
        const buttonDeleteElement = document.createElement("button");

        cardElement.setAttribute("data-testid", "transactionItem");
        titleElement.setAttribute("data-testid", "transactionItemTitle");
        amountElement.setAttribute("data-testid", "transactionItemAmount");
        dateTimeElement.setAttribute("data-testid", "transactionItemDate");
        typeTransactionElement.setAttribute("data-testid", "transactionItemType");
        buttonEditTypeElement.setAttribute("data-testid", "transactionItemEditTypeButton");
        buttonDeleteElement.setAttribute("data-testid", "transactionItemDeleteButton");

        buttonDeleteElement.onclick = () => {
            deleteTransaction(transaction.id);
        };
        buttonEditTransactionElement.onclick = () => {
            editTransaction(transaction.id);
        };
        buttonEditTypeElement.onclick = () => {
            changeTypeTransaction(transaction.id);
        }

        cardElement.classList.add("tracker-transaction-item");
        titleElement.classList.add("tracker-transaction-item__title");
        amountElement.classList.add("tracker-transaction-item__amount",`${transaction.type === "income" ? "tracker-transaction-item__amount--income" : "tracker-transaction-item__amount--expense"}`);
        dateTimeElement.classList.add("tracker-transaction-item__date");
        typeTransactionElement.classList.add(`${transaction.type === "income" ? "tracker-transaction-item__icon--income" : "tracker-transaction-item__icon--expense"}`);
        wrapperButtonElement.classList.add("tracker-transaction-item__actions");
        buttonEditTypeElement.classList.add("tracker-transaction-item__btn");
        buttonEditTransactionElement.classList.add("tracker-transaction-item__btn");
        buttonDeleteElement.classList.add("tracker-transaction-item__btn");

        titleElement.innerText = transaction.title;
        amountElement.innerText = `Nominal: Rp${transaction.amount.toLocaleString("id-id")}`;
        dateTimeElement.innerText = `Tanggal: ${transaction.date}`;
        typeTransactionElement.innerText = `Tipe: ${transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}`;
        buttonEditTypeElement.innerText = "Ubah Tipe";
        buttonEditTransactionElement.innerText = "Edit";
        buttonDeleteElement.innerText = "Hapus";

        wrapperButtonElement.appendChild(buttonEditTypeElement);
        wrapperButtonElement.appendChild(buttonEditTransactionElement);
        wrapperButtonElement.appendChild(buttonDeleteElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(amountElement);
        cardElement.appendChild(dateTimeElement);
        cardElement.appendChild(typeTransactionElement);
        cardElement.appendChild(wrapperButtonElement);

        if(transaction.type == "income") {
            incomeListElement.append(cardElement);
        } else if(transaction.type == "expense") {
            expenseListElement.append(cardElement);
        }
    }
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

const transactionFormElement = document.getElementById("transactionForm");
transactionFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputTitle = document.getElementById("transactionFormTitleInput").value;
    const inputAmount = document.getElementById("transactionFormAmountInput").value.replace(/[^0-9]/g, '');
    const inputDate = document.getElementById("transactionFormDateInput").value;
    const selectedType = document.getElementById("transactionFormTypeSelect").value;

    if(inputTitle.trim().length === 0) {
        alert("Title Masih Kosong");
        return;
    }
    if(Number(inputAmount) < 1) {
        alert("Nominal Kurang dari 1");
        return;
    }

    if(editingTransactionId !== null) {
        const dataEditTransaction = transactions.find((item) => item.id === editingTransactionId);
        dataEditTransaction.title = inputTitle;
        dataEditTransaction.amount = Number(inputAmount);
        dataEditTransaction.date = inputDate;
        dataEditTransaction.type = selectedType;
        editingTransactionId = null;
    } else {
        const newTransaction = {
            id : generateID(),
            title : inputTitle,
            amount : Number(inputAmount),
            date : inputDate,
            type : selectedType,
        };
        
        transactions.push(newTransaction);
    }
    
    transactionFormElement.reset();
    document.dispatchEvent(new Event(RENDER_EVENT));
})

const inputAmountElement = document.getElementById("transactionFormAmountInput");
inputAmountElement.addEventListener("input", () => {
    const inputAmountNum = inputAmountElement.value.replace(/[^0-9]/g, '');
    if(inputAmountNum === "") {
        inputAmountElement.value = "";
        return;
    }
    const formatRupiah = Intl.NumberFormat("id-ID").format(inputAmountNum);
    inputAmountElement.value = formatRupiah;
})

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */



/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

function updatePanelDashboard() {
    const amountCountElement = document.querySelector(".tracker-summary__balance-amount");
    const incomeElement = document.querySelector(".tracker-summary__stat-amount--income");
    const expenseElement = document.querySelector(".tracker-summary__stat-amount--expense");

    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
        if(transaction.type === "income") {
            totalIncome += transaction.amount;
        } else if(transaction.type === "expense") {
            totalExpense += transaction.amount;
        }
    }


    const saldo = totalIncome - totalExpense;

    amountCountElement.innerText = `Rp${saldo.toLocaleString("id-ID")}`;
    incomeElement.innerText = `Rp${totalIncome.toLocaleString("id-ID")}`;
    expenseElement.innerText = `Rp${totalExpense.toLocaleString("id-ID")}`;
}

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

function saveDataToStorage() {
    const dataTransaction = JSON.stringify(transactions);
    localStorage.setItem(TRANSACTION_KEY, dataTransaction);
}


document.addEventListener("DOMContentLoaded", () => {
    const loadData = localStorage.getItem(TRANSACTION_KEY);
    if(loadData !== null) {
        transactions = JSON.parse(loadData);
    }
    // updateTransactionList();
    // updatePanelDashboard();
    document.dispatchEvent(new Event(RENDER_EVENT));
})

function deleteTransaction(transactionId) {
    transactions = transactions.filter((item) => item.id !== transactionId);

    if(editingTransactionId === transactionId) {
        editingTransactionId = null;
        transactionFormElement.reset();
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

function editTransaction(transactionId) {
    const findTransaction = transactions.find((item) => item.id === transactionId);

    if(findTransaction) {
        document.getElementById("transactionFormTitleInput").value = findTransaction.title;
        document.getElementById("transactionFormAmountInput").value = findTransaction.amount;
        document.getElementById("transactionFormDateInput").value = findTransaction.date;
        document.getElementById("transactionFormTypeSelect").value = findTransaction.type;

        editingTransactionId = findTransaction.id;
    }
}


/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

document.addEventListener(RENDER_EVENT, () => {
    saveDataToStorage();
    updateTransactionList();
    updatePanelDashboard();
})


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

function changeTypeTransaction(transactionId) {
    const findTransaction = transactions.find((item) => item.id === transactionId);

    if(!findTransaction) return;

    findTransaction.type === "income" ? findTransaction.type = "expense" : findTransaction.type = "income";

    document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

const inputSearchElement = document.getElementById("searchTransactionFormTitleInput");
inputSearchElement.addEventListener("input", () => {
    updateTransactionList();
})


/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
*/

const searchForm = document.getElementById("searchTransactionForm");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateTransactionList();
})