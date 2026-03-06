// const createSynonym = (synonym) => {
//     const synonymElement = synonym.map(syn => `<span class="btn btn-xs btn-outline">${syn ? syn : 'কোনো সমার্থক শব্দ পাওয়া যায়নি'}</span>`)
    
//     return synonymElement.join(' '); 
// }

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const loadLessons = () => {
    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
        .then(res => res.json())
        .then(data => displayLessons(data.data))
}

const removeActiveClass = () => {
    const buttons = document.querySelectorAll('.lesson-btn');
    buttons.forEach(btn => {
        // btn.classList.remove('bg-[#422AD5]', 'text-white');
        btn.classList.remove('active');
        // console.log(btn);
    });
};

const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayWordDetails(data.data);
}

// data: 
// id: 72
// level: 1
// meaning: "বড়"
// partsOfSpeech: "adjective"
// points: 1
// pronunciation: "বিগ"
// sentence: "He has a big house."
// synonyms: Array(3)
// 0: "large"
// 1: "huge"
// 2: "giant"
//word: "Eager"

const displayWordDetails = (word) => {
    console.log(word);

    const modalCard = document.getElementById('modal-card');
    modalCard.innerHTML = `
                    <div class="space-y-4 bg-[#BADEFF26] outline-gray-300 outline-2 outline rounded-lg p-6">
                        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                        <h3 class="text-xl font-semibold"> Meaning</h3>
                        <p>${word.meaning ? word.meaning : 'কোনো অর্থ পাওয়া যায়নি'}</p>
                        <h3 class="text-xl font-semibold">Example</h3>
                        <p>${word.sentence ? word.sentence : 'কোনো উদাহরণ পাওয়া যায়নি'}</p>
                        <h3 class="text-xl font-semibold">সমার্থক শব্দ গুলো</h3>
                       <p>${word.synonyms.map(synonym => `<button class="btn btn-xs btn-outline">${synonym ? synonym : 'কোনো সমার্থক শব্দ পাওয়া যায়নি'}</button>`).join(' ')}</p>   
                    </div>`;                
    document.getElementById('wordDetails').showModal();
}

const loadSpinner = (status) => {
    if (status) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}


//load words by level no
const loadWord = (id) => {
    loadSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`; //qus
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass(); //remove active class from all buttons
            const activeBtn = document.getElementById(`lesson-btn-${id}`);
            // activeBtn.classList.add('bg-[#422AD5]', 'text-white');
            activeBtn.classList.add('active');

            displayLevelWord(data.data)
        })
}

// id: 5, level: 1, word: 'Eager', meaning: 'আগ্রহী', pronunciation: 'ইগার'

const displayLevelWord = (data) => {
    // console.log(data);
    if (data.length === 0) {
        const wordContainer = document.getElementById('word-container');
        wordContainer.innerHTML = `
        <div class="bg-[#BADEFF26] text-center p-6 rounded-lg shadow-md space-y-4 col-span-full">
                <img src="../assets/alert-error.png" alt="Sad" class="w-16 mx-auto">
                <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="text-3xl font-bold">নেক্সট Lesson এ যান</h3>
            </div>
        `;
        loadSpinner(false);
        return;
    }
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    data.forEach(word => {
        console.log(word);
        const wordDiv = document.createElement('div');
        wordDiv.classList.add('text-center', 'border', 'p-8', 'rounded-lg', 'shadow-sm', 'bg-[#BADEFF26]', 'space-y-2', 'w-full', 'md:w-11/12', 'mx-auto');
        wordDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${word.word ? word.word : 'কোনো শব্দ পাওয়া যায়নি'}</h2>
        <p class="text-lg">meaning/pronunciation</p>
        <p class="text-xl italic font-bold">"${word.meaning ? word.meaning : 'কোনো অর্থ পাওয়া যায়নি'}/${word.pronunciation ? word.pronunciation : 'কোনো উচ্চারণ পাওয়া যায়নি'}"</p>
        <div class="flex justify-between">
            <button onclick="loadWordDetails('${word.id}')"  class="btn btn-outline btn-primary"><i class="fa-solid fa-circle-question"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn btn-outline btn-secondary"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        `;
        wordContainer.appendChild(wordDiv);
    })
    loadSpinner(false);
}

// {id: 101, level_no: 1, lessonName: 'Basic Vocabulary'}

const displayLessons = (lessons) => {
    // console.log(lessons);
    const vocabularyContainer = document.getElementById('vocabulary-container');

    for (const lesson of lessons) {
        const btnDiv = document.createElement('div');
        btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary w-32 md:w-40 lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
            `
        vocabularyContainer.appendChild(btnDiv);
    }
}

loadLessons();