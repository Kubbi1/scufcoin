// script.js

// Константы
const MAX_ENERGY = 3000;
const ENERGY_REGEN_RATE = 1; // Единиц энергии в секунду
const BOOST_DURATION = 15000; // 15 секунд
const BOOST_MULTIPLIER = 15;
const BASE_INCREMENT = 7; // Изменение монет за клик
const BOOST_COUNT = 5;
const RESTORE_COUNT = 3;

// Переменные состояния
let isBoostActive = false;
let boostEndTimeout;

// Функция для получения значения из LocalStorage или установки по умолчанию
function getLocalStorageItem(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

// Функция для установки значения в LocalStorage
function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Функции для работы с балансом
function getBalance() {
    return getLocalStorageItem('balance', 0);
}

function updateBalance(newBalance) {
    setLocalStorageItem('balance', newBalance);
    document.getElementById('balance').innerText = newBalance;
}

// Функции для работы с энергией
function getEnergy() {
    return getLocalStorageItem('energy', MAX_ENERGY);
}

function updateEnergy(newEnergy) {
    setLocalStorageItem('energy', newEnergy);
    const energyPercentage = (newEnergy / MAX_ENERGY) * 100;
    document.getElementById('energy-fill').style.width = `${energyPercentage}%`;
}

function regenEnergy() {
    let energy = getEnergy();
    if (energy < MAX_ENERGY) {
        energy = Math.min(MAX_ENERGY, energy + ENERGY_REGEN_RATE);
        updateEnergy(energy);
    }
}

// Функции для работы с бустами и восстановлением
function getBoostCount() {
    return getLocalStorageItem('boostCount', BOOST_COUNT);
}

function updateBoostCount(count) {
    setLocalStorageItem('boostCount', count);
    document.getElementById('boost-count').innerText = count;
}

function getRestoreCount() {
    return getLocalStorageItem('restoreCount', RESTORE_COUNT);
}

function updateRestoreCount(count) {
    setLocalStorageItem('restoreCount', count);
    document.getElementById('restore-count').innerText = count;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateBalance(getBalance());
    updateEnergy(getEnergy());
    updateBoostCount(getBoostCount());
    updateRestoreCount(getRestoreCount());
    setInterval(regenEnergy, 1000);
});

// Обновление баланса и анимации при клике на изображение
document.getElementById('clickable-image').addEventListener('click', (event) => {
    let balance = getBalance();
    let energy = getEnergy();

    if (energy > 0) {
        let increment = isBoostActive ? BASE_INCREMENT + BOOST_MULTIPLIER : BASE_INCREMENT;
        balance += increment;
        energy--;
        updateBalance(balance);
        updateEnergy(energy);

        const image = event.target;
        image.classList.add('clicked');
        setTimeout(() => {
            image.classList.remove('clicked');
        }, 100);

        const feedback = document.getElementById('click-feedback');
        feedback.style.left = `${event.clientX}px`;
        feedback.style.top = `${event.clientY}px`;
        feedback.innerText = `+${increment}`;
        feedback.style.opacity = 1;
        feedback.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            feedback.style.opacity = 0;
            feedback.style.transform = 'translateY(0)';
        }, 500);
    } else {
       //
    }
});

// Активация буста
document.getElementById('boost-button').addEventListener('click', () => {
    let boostCount = getBoostCount();
    if (boostCount > 0 && !isBoostActive) {
        isBoostActive = true;
        updateBoostCount(--boostCount);
        boostEndTimeout = setTimeout(() => {
            isBoostActive = false;
        }, BOOST_DURATION);
    } else if (isBoostActive) {
        //
    } else {
        //
    }
});

// Полное восстановление энергии
document.getElementById('restore-button').addEventListener('click', () => {
    let restoreCount = getRestoreCount();
    if (restoreCount > 0) {
        updateEnergy(MAX_ENERGY);
        updateRestoreCount(--restoreCount);
    } else {
        //
    }
});

// Функция для обновления бустов и восстановлений каждые 12 часов
function resetBoostsAndRestores() {
    const lastReset = getLocalStorageItem('lastReset', 0);
    const currentTime = Date.now();
    const hoursSinceLastReset = (currentTime - lastReset) / (1000 * 60 * 60);

    if (hoursSinceLastReset >= 12) {
        updateBoostCount(BOOST_COUNT);
        updateRestoreCount(RESTORE_COUNT);
        setLocalStorageItem('lastReset', currentTime);
    }
}

// Проверка при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    resetBoostsAndRestores();
});
