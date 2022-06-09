const contactform = document.querySelector('.contact_form');

let fname = document.querySelector('#fname');
let lname = document.querySelector('#lname');
let email = document.querySelector('#email');
let phone = document.querySelector('#phone');
let message = document.querySelector('#message');

contactform.addEventListener('submit', (e) => {
    e.preventDefault();
    createNotifications("Hold on!")
    console.log('submit clicked');
    let formData = {
        fname: fname.value,
        lname: lname.value,
        email: email.value,
        phone: phone.value,
        message: message.value
    }
    console.log(formData);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/contact');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function () {
        console.log(xhr.responseText);
        if (xhr.responseText === 'success') {
            createNotifications("Email sent Successfully!");
            fname.value = '';
            lname.value = '';
            email.value = '';
            phone.value = '';
            message.value = '';
        }
        else {
            createNotifications("Something went wrong!");
        }
    }
    xhr.send(JSON.stringify(formData))
})

const notificationsContainer = document.querySelector('.notifications-container');
function createNotifications(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification-styles');

    notification.innerText = message;

    notificationsContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2000)
}
