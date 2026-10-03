/* =========================================================
   ПЛАВНОЕ ПОЯВЛЕНИЕ ТЕКСТА
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target
                        .classList
                        .add("visible");

                    revealObserver
                        .unobserve(
                            entry.target
                        );

                }

            });

        },

        {
            threshold: 0.35,
            rootMargin: "0px 0px -10% 0px"
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   АНИМАЦИЯ ДАТЫ 27.02 / 2027
========================================================= */

const dateTitle =
    document.querySelector(
        ".date-title"
    );


if (dateTitle) {

    const dateObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            dateObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    }
                );

            },

            {
                threshold: 0.3
            }

        );


    dateObserver.observe(
        dateTitle
    );

}


/* =========================================================
   КРУГИ ДРЕСС-КОДА
========================================================= */

const palette =
    document.querySelector(
        ".color-palette"
    );


if (palette) {

    const paletteObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add("visible");

                            paletteObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    }
                );

            },

            {
                threshold: 0.4
            }

        );


    paletteObserver.observe(
        palette
    );

}


/* =========================================================
   ТАЙМЕР — ОТДЕЛЯЮЩИЕСЯ ЛИСТЫ КАЛЕНДАРЯ
========================================================= */


/*
   Дата свадьбы:

   27 февраля 2027
   12:00

   Время считается по времени устройства гостя.
*/

const weddingDate =
    new Date("2027-02-27T12:00:00");


/* =========================================================
   СОХРАНЯЕМ ПРЕДЫДУЩИЕ ЗНАЧЕНИЯ
========================================================= */

const previousValues = {

    days: null,

    hours: null,

    minutes: null,

    seconds: null

};


/* =========================================================
   ОБНОВЛЕНИЕ ТАЙМЕРА
========================================================= */

function updateCountdown() {

    const now =
        new Date();

    const difference =
        weddingDate.getTime() -
        now.getTime();


    /* -----------------------------------------
       ЕСЛИ СВАДЬБА УЖЕ НАСТУПИЛА
    ----------------------------------------- */

    if (difference <= 0) {

        updateCalendarUnit(
            "days",
            0
        );

        updateCalendarUnit(
            "hours",
            0
        );

        updateCalendarUnit(
            "minutes",
            0
        );

        updateCalendarUnit(
            "seconds",
            0
        );

        return;

    }


    /* -----------------------------------------
       ОБЩЕЕ КОЛИЧЕСТВО СЕКУНД
    ----------------------------------------- */

    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    /* -----------------------------------------
       ДНИ
    ----------------------------------------- */

    const days =
        Math.floor(
            totalSeconds /
            (60 * 60 * 24)
        );


    /* -----------------------------------------
       ЧАСЫ
    ----------------------------------------- */

    const hours =
        Math.floor(
            (
                totalSeconds %
                (60 * 60 * 24)
            ) /
            (60 * 60)
        );


    /* -----------------------------------------
       МИНУТЫ
    ----------------------------------------- */

    const minutes =
        Math.floor(
            (
                totalSeconds %
                (60 * 60)
            ) /
            60
        );


    /* -----------------------------------------
       СЕКУНДЫ
    ----------------------------------------- */

    const seconds =
        totalSeconds % 60;


    /* -----------------------------------------
       ОБНОВЛЯЕМ ЧЕТЫРЕ ЛИСТА
    ----------------------------------------- */

    updateCalendarUnit(
        "days",
        days
    );

    updateCalendarUnit(
        "hours",
        hours
    );

    updateCalendarUnit(
        "minutes",
        minutes
    );

    updateCalendarUnit(
        "seconds",
        seconds
    );

}


/* =========================================================
   ПЕРЕЛИСТЫВАНИЕ ОДНОГО ЛИСТА
========================================================= */

function updateCalendarUnit(
    id,
    number
) {

    const element =
        document.getElementById(id);


    if (!element) return;


    const sheet =
        element.closest(
            ".calendar-sheet"
        );


    if (!sheet) {

        element.textContent =
            String(number).padStart(2, "0");

        return;

    }


    const newValue =
        String(number).padStart(2, "0");


    /*
       При первом запуске просто устанавливаем число.
       Анимация начинается только после реального изменения.
    */

    if (
        previousValues[id] === null
    ) {

        element.textContent =
            newValue;

        const nextNumber =
            sheet.querySelector(
                ".calendar-sheet-next span"
            );

        if (nextNumber) {

            nextNumber.textContent =
                newValue;

        }

        previousValues[id] =
            newValue;

        return;

    }


    /*
       Если число не изменилось —
       ничего не делаем.
    */

    if (
        previousValues[id] === newValue
    ) {

        return;

    }


    /* -----------------------------------------
       НАХОДИМ ЛИСТЫ
    ----------------------------------------- */

    const currentSheet =
        sheet.querySelector(
            ".calendar-sheet-current"
        );

    const nextSheet =
        sheet.querySelector(
            ".calendar-sheet-next"
        );


    const currentNumber =
        currentSheet.querySelector(
            "span"
        );

    const nextNumber =
        nextSheet.querySelector(
            "span"
        );


    if (
        !currentNumber ||
        !nextNumber
    ) {

        return;

    }


    /* -----------------------------------------
       НОВОЕ ЧИСЛО КЛАДЁМ ПОД СТАРЫЙ ЛИСТ
    ----------------------------------------- */

    nextNumber.textContent =
        newValue;


    /* -----------------------------------------
       ЗАПУСКАЕМ ПЕРЕЛИСТЫВАНИЕ
    ----------------------------------------- */

    sheet.classList.remove(
        "flipping"
    );


    /*
       Небольшой reflow нужен,
       чтобы браузер заново запустил animation.
    */

    void sheet.offsetWidth;


    sheet.classList.add(
        "flipping"
    );


    /* -----------------------------------------
       ПОСЛЕ АНИМАЦИИ
       НОВЫЙ ЛИСТ СТАНОВИТСЯ ТЕКУЩИМ
    ----------------------------------------- */

    setTimeout(
        () => {

            currentNumber.textContent =
                newValue;


            sheet.classList.remove(
                "flipping"
            );

        },
        720
    );


    previousValues[id] =
        newValue;

}


/* =========================================================
   ПЕРВЫЙ ЗАПУСК
========================================================= */

updateCountdown();


/* =========================================================
   ОБНОВЛЕНИЕ КАЖДУЮ СЕКУНДУ
========================================================= */

setInterval(
    updateCountdown,
    1000
);

/* =========================================================
   ВЫВОД ЧИСЕЛ
========================================================= */

function setNumber(
    id,
    number
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        String(number)
            .padStart(
                2,
                "0"
            );

}


/* =========================================================
   ЗАПУСК
========================================================= */

updateCountdown();


setInterval(
    updateCountdown,
    1000
);
/* =========================================================
   УСПЕШНАЯ ОТПРАВКА АНКЕТЫ
========================================================= */

const guestForm =
    document.querySelector(".guest-form-fields");

const successModal =
    document.querySelector(".success-modal");


if (guestForm && successModal) {

    guestForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            successModal.classList.add("visible");

        }
    );

}
const successClose =
    document.querySelector(".success-close");

if (successClose && successModal) {

    successClose.addEventListener(
        "click",
        function () {

            successModal.classList.remove("visible");

        }
    );

}
/* =========================================================
   ОТКРЫТИЕ ПРИГЛАШЕНИЯ
========================================================= */

const curtainScreen =
    document.getElementById("curtainScreen");

const weddingMusic =
    document.getElementById("weddingMusic");


if (curtainScreen) {

    curtainScreen.addEventListener(
        "click",
        function () {

            /* запускаем музыку */

            if (weddingMusic) {

                weddingMusic.volume = 0;

                const playPromise =
                    weddingMusic.play();

                if (playPromise !== undefined) {

                    playPromise
                        .then(() => {

                            /* плавное увеличение громкости */

                            let volume = 0;

                            const fadeInMusic =
                                setInterval(() => {

                                    volume += 0.04;

                                    if (volume >= 1) {

                                        volume = 1;

                                        clearInterval(
                                            fadeInMusic
                                        );

                                    }

                                    weddingMusic.volume =
                                        volume;

                                }, 80);

                        })
                        .catch(() => {

                            /* браузер заблокировал звук */

                        });

                }

            }


            /* открываем занавес */

            curtainScreen.classList.add("open");
            setTimeout(() => {
                const hero = document.querySelector(".hero");

                if (hero) {
                    hero.classList.add("hero-start");
                }
            }, 1000);
        },
        { once: true }
    );

}