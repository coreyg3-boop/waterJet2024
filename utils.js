//import {dbStuff} from './db-utils.js';
console.log('utils');
const theForm = document.getElementById('page-form');
const submitButton = document.querySelector('.submit');

submitButton.addEventListener('click', (ev) => {
    console.log('ev');
});

const navMenu = () => {
    const winContainer = document.getElementById('window-container');
}

const formSubmit = (ev) => {
    console.log(window.location);
    console.log(ev);
}

const getPageForm = () => {
    const theForm = document.getElementById('page-form');
    // const submitButton = theForm.querySelector('.submit');

    // submitButton.addEventListener('click', (ev) => {
    //     theForm.preventDefault();
    //     console.log(ev);
    // });
    console.log(theForm);
    //console.log(dbStuff);
}

getPageForm();