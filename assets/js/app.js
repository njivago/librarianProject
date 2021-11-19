const navLinks = document.querySelectorAll('#navbar-link');
const containers = document.querySelectorAll('.container');
const listBooks = document.querySelector('.books');
const listVisitors = document.querySelector('.vis');
const listCards = document.querySelector('.cards');
const books = JSON.parse(localStorage.getItem("books"));
const visitors = JSON.parse(localStorage.getItem("visitors"));
const cards = JSON.parse(localStorage.getItem("cards"));
const btn = document.querySelectorAll(".add_btn");
const forms = document.querySelectorAll('form');

btn.forEach(i => {
    showModal(i);
})

if (books) {
    books.forEach(book => {
        buildFromLS(book, 'books', listBooks)
    });
}

if (visitors) {
    visitors.forEach(visitor => {
        buildFromLS(visitor, 'visitors', listVisitors)
    });
}

if (cards) {
    cards.forEach(card => {
        buildFromLS(card, 'cards', listCards)
    });
}

navLinks.forEach(item => {
    item.addEventListener('click', e => {
        let d = e.target.dataset.cont;
        containers.forEach(i => {
            i.classList.remove('active')
            if(i.dataset.cont == d) {
                i.classList.add('active')
            }
        })        
    })
})

class Book {
    constructor(id, name, author, count) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.count = count;
    }
    render() {
        const tr = document.createElement('ul');
        tr.classList.add('tr__books');
        tr.classList.add('new__books');
        tr.innerHTML = `<li>${this.id}</li>
        <li>${this.name}</li>
        <li>${this.author}</li>
        <li>${this.count}</li>
        <li><button type="button" class="edit__button" data-prop="books"></button></li>
        <li><button type="button" class="remove__button"></button></li>`;
        const editBtn = tr.querySelector('.edit__button');
        const removeBtn = tr.querySelector('.remove__button');
        removeBtn.addEventListener('click', e => {
            e.target.parentElement.parentElement.remove();
        })
        showModal(editBtn);
        return tr;
    }
}
class Visitor {
    constructor(id, name, phone) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }
    render() {
        const tr = document.createElement('ul');
        tr.classList.add('tr__visitors');
        tr.classList.add('new__visitors');
        tr.innerHTML = `<li>${this.id}</li>
        <li>${this.name}</li>
        <li>${this.phone}</li>
        <li><button type="button" class="edit__button" data-prop="vis"></button></li>`;
        const editBtn = tr.querySelector('.edit__button');
        showModal(editBtn);
        return tr;
    }
}

class Card {
    constructor(id, name, phone) {
        this.id = id;
        this.name = name;
        this.phone = phone;
    }
    render() {
        const tr = document.createElement('ul');
        tr.classList.add('tr__cards');
        tr.classList.add('new__cards');
        tr.innerHTML = `<li>${this.id}</li>
        <li>${this.name}</li>
        <li>${this.phone}</li>
        <li>${getTime()}</li>
        <li><button type="button" class="return__btn"></button></li>
        `;
        const returnBtn = tr.querySelector('.return__btn');    
        returnBtn.addEventListener('click', e => {
                e.target.parentElement.innerHTML = `${getTime()}`
                e.target.remove()
        }) 
        return tr;
    }
}

function showModal(i) {
    i.addEventListener('click', e => {
        let btn = e.target;
        let containData = e.target.dataset.prop;
        const contain = document.querySelector(`.${containData}`).querySelector('ul');
        const contProps = contain.querySelectorAll('li')
        e.target.parentElement.parentElement.append(openModal(contProps));
        const modal = document.querySelector('.modal');
        if(e.target.classList.contains('edit__button')) {
            modal.querySelector('button').innerText = 'Edit'
        }
        const span = document.querySelector(".close");
        const form = modal.querySelector('.add_form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            if(e.target.querySelector('.error')) e.target.querySelector('.error').remove()
            const errorC = document.createElement('p');
            errorC.innerText = 'Error, incorrectly entered data.';
            errorC.classList.add('error')
            const inps = e.target.querySelectorAll('input');
            let j = 0;
            inps.forEach(i => {
                if(i.value == '') j++;
                else if(i.type == 'number') {
                    if(i.value <= 0) j++; 
                }
            })
            if(j === 0){
                addContent(containData, e.target, btn);
                modal.remove();
            }  
            else e.target.append(errorC);
        })
        span.addEventListener('click', e => {
            modal.remove();
    })
        window.addEventListener('click', e => {
            if (e.target == modal) {
                modal.remove();
            }
            
        })
})
}

function openModal(prop) {
    const mod = document.createElement('div');
    let arrProp = [];
    let labelStr = [];
    prop.forEach(i => {
        if(i.innerText === "Edit" || i.innerText === "Borrow Date" || i.innerText === "Delete"
         || i.innerText === "Return Date" || i.innerText === "ID") {
        }
        else 
        arrProp.push(i.textContent);
    })
    arrProp.forEach(i => {
        if(i == 'Count' || i == 'Phone') {
        labelStr.push(`<label>${i}:<input type="number" name="${i}"></label>`)
        }
        else labelStr.push(`<label>${i}:<input type="text" name="${i}"></label>`)
    })
    mod.innerHTML = ` <div id="modal" class="modal" >
    <div class="modal-content">
                <span class="close">&times;</span>
                <form class="add_form">
                    ${labelStr.join()}
                    <button type="submit">Add a note</button>
                    </form>
                    </div>
                    </div>`
    return mod;
};

function addContent(cont, form, btn) {
    let inputs = form.querySelectorAll('input');
    const container = document.querySelector(`.${cont}`);
    let arr = [];
    inputs.forEach(i => {
        arr.push(i.value);
    })
    let index = 0;
    if(cont == 'books') {
        const array = container.querySelectorAll('.tr__books');
        const idCont = array[array.length - 1];
        const currentID = Number(idCont.querySelectorAll('li')[0].innerHTML);
        const editID = Number(btn.parentElement.parentElement.querySelectorAll('li')[0].innerHTML)
        index = currentID + 1;
        if(btn.classList.contains('edit__button')) {
            let book = new Book(editID , ...arr)
            btn.parentElement.parentElement.innerHTML = `${book.render().innerHTML}`
            btn.parentElement.classList.add('new_books')
            updateLS();
        }
        else {
            let book = new Book(index , ...arr)
            listBooks.append(book.render());
            updateLS();
        }
    }
    else if(cont == 'vis'){
        const array = container.querySelectorAll('.tr__visitors');
        const idCont = array[array.length - 1];
        const currentID = Number(idCont.querySelectorAll('li')[0].innerHTML)
        const editID = Number(btn.parentElement.parentElement.querySelectorAll('li')[0].innerHTML)
        index = currentID + 1;
        if(btn.classList.contains('edit__button')) {
            let visitor = new Visitor(editID , ...arr)
            btn.parentElement.parentElement.innerHTML = `${visitor.render().innerHTML}`;
            btn.parentElement.classList.add('new_visitors');
            updateLS()
        }
        else {
            let visitor = new Visitor(index ,...arr)
            listVisitors.append(visitor.render());
            updateLS()
        }
    }
    else if(cont == 'cards') {
        const array = container.querySelectorAll('.tr__cards');
        const idCont = array[array.length - 1];
        const currentID = Number(idCont.querySelectorAll('li')[0].innerHTML)
        index = currentID + 1;
        let card = new Card(index ,...arr)
        listCards.append(card.render());
        updateLS();
    }
}

function getTime() {
    let today = new Date();
    const dd = String(today.getDate());
    const mm = String(today.getMonth() + 1);
    const yyyy = today.getFullYear();
    return today = mm + '/' + dd + '/' + yyyy;
}

function addEvent() {
    const editBtn = document.querySelectorAll('.edit__button');
    const removeBtn = document.querySelectorAll('.remove__button');
    const returnBtn = document.querySelectorAll('.return__btn');    
    returnBtn.forEach(i => {
        i.addEventListener('click', e => {
        e.target.parentElement.innerHTML = `${getTime()}`
        updateLS();
    }) 
    })
    editBtn.forEach(i => {
        showModal(i);
    })
    removeBtn.forEach(i => {
        i.addEventListener('click', e => {
            e.target.parentElement.parentElement.remove()
            updateLS()
        })
    })
   
}
addEvent();

function updateLS() {
    
    const books = document.querySelectorAll(".new__books");
    const visitors = document.querySelectorAll(".new__visitors");
    const cards = document.querySelectorAll(".new__cards");

    localStorage.clear();
    
    let booksArr = [];
    let visitorsArr = [];
    let cardsArr = [];
    
    books.forEach(book => {
        booksArr.push(book.innerHTML);
        localStorage.setItem("books", JSON.stringify(booksArr));
    });
    visitors.forEach(visitor => {
        visitorsArr.push(visitor.innerHTML);
        localStorage.setItem("visitors", JSON.stringify(visitorsArr));
    });
    cards.forEach(card => {
        cardsArr.push(card.innerHTML);
        localStorage.setItem("cards", JSON.stringify(cardsArr));
    });
}

function buildFromLS(item, name, cont) {
    let el = document.createElement('ul');
    el.classList.add(`tr__${name}`);
    el.classList.add(`new__${name}`);
    el.innerHTML = `${item}`;
    cont.append(el);
}