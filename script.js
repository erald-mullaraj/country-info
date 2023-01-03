"user strict";

let taskNr = 0;


const randomInteger = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
        `rgb(${randomInteger(0,255)}, ${randomInteger(0,255)},
        ${randomInteger(0,255)})`;

const getCountry = function(data, nr, className = '') {
    let a = `.container-${nr}`;
    const countriesContainer = document.querySelector(a);
    const htmlInput = `
        <div class="country ${className}">
        <img class="cntry-img" src= "${data.flag}" />
            <div calss="cntry-info">
                <h3 calss="cntry-name">${data.name}</h3>
                <h4 class="cntry-region">Region: ${data.region}</h4>
                <p class="cntry-row"><span>Population: </span>${(+data.population / 1000000).toFixed(2)}M people</p>
                <p class="cntry-row"><span>Language: </span>${data.languages[0].name}</p>
                <p class="cntry-row"><span>Capital: </span>${data.capital}</p>
                <p class="cntry-row"><span>Currency: </span>${data.currencies[0].name}</p>
            </div>
        </div>`;
        countriesContainer.insertAdjacentHTML('beforeend', htmlInput)
        // countriesContainer.style.opacity = 1;
};

const getCountryPlusNeighbour = function(country, nr) {
   
    // AJAX call
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`);
    request.send();

    request.addEventListener('load', function(){
        // kllapat tek [data] bejne destructuring
        const [data] = JSON.parse(this.responseText);
        console.log(data);
        getCountry(data, nr);
        // geting neighbour country
        const neighbours = data.borders;
        // if there are no neighbours
        if(!neighbours) return;

        neighbours.forEach(function (ngbCountry) {
            const request2 = new XMLHttpRequest();
            request2.open('GET', `https://restcountries.com/v2/alpha/${ngbCountry}`);
            request2.send();
            request2.addEventListener('load', function(){
                const data2 = JSON.parse(this.responseText); 
                getCountry(data2, nr, 'neighbour');
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', function() {
    //by defaultm submit button is disabled
    document.querySelector('#submit').disabled = true;
    document.querySelector('#countrySearch').onkeyup = () => {
        if (document.querySelector('#countrySearch').value.length > 0) {
            document.querySelector('#submit').disabled = false;
        } else {
            document.querySelector('#submit').disabled = true;
        };
    };
    postTask ();         
    });        

const formatedDate = function () {
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    return `${day}.${month}.${year} - ${hour}:${min}`;
};

 
    
        
 

function postTask (){
    document.querySelector('form').onsubmit = () => {
        taskNr++;
        let countryValue = document.querySelector('#countrySearch').value;
    getCountryPlusNeighbour (countryValue, taskNr);
    let post = document.createElement('div');
    post.className = `post-${taskNr} post`;
    post.innerHTML = 
        `<button class="delete">Delete</button>
        <div class="date">${formatedDate()}</div>
        <div class="container-${taskNr} container"></div>`; 
        document.querySelector('#posts').append(post);                       
        document.querySelector('#countrySearch').value = '';
        document.querySelector('#submit').disabled = true;                      
        // stop form from submitting
        
        return false;
    }; 
};
           
 // If hide button is clicked, delete the post
document.addEventListener('click', event => {
    const element = event.target;       
         if (element.className === 'delete') {
            element.parentElement.style.animationPlayState = 'running';
            element.parentElement.addEventListener('animationend', () =>  {
            element.parentElement.remove();
            });
        }   
    });

// sticky scoll
const body = document.body;
let scrollValue = 0; 
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > scrollValue) {
        body.classList.add('scroll-down');
    };
    if (currentScroll < scrollValue) {
        body.classList.remove('scroll-down');
    };
    scrollValue = currentScroll;
});

