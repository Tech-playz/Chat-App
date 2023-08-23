

const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');



const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h2>Hello ${user.displayName}!</h2>`;
        // Set up websocket connection
        let socket = new WebSocket('ws://2.216.112.75:8080');
            
        let canSendMessage = true;
        let currentServer = 'server1';


        // Send message when the form is submitted
        document.getElementById('message-sub').addEventListener('submit', (event) => {
        event.preventDefault();
        const input = document.getElementById('message');
        const username = user.displayName;


        if (input.value.trim() === '') {
        // If the message is an empty string, don't send it and return early
        return;
        };

        if (canSendMessage) {
        document.getElementById('cooldown-indicator').style.display = 'none';
        socket.send(username + ': ' +input.value);


        input.value = '';

        canSendMessage = false;
        setTimeout(() => {
        canSendMessage = true;
        }, 5000);
        }
        else {
        // If the user cannot send a message, show a visual indication
        document.getElementById('cooldown-indicator').style.display = 'block';
        }});

        // Add message to the chat window when a message is received
        socket.addEventListener('message', (event) => {
        const message = event.data;
        const li = document.createElement('li');
        li.innerHTML = message;
        const messages = document.getElementById('messages');
        //messages.appendChild(li);
        messages.prepend(li);

        // Scroll the chat box to the bottom
        messages.scrollTop = messages.scrollHeight;
        messages.scrollIntoView(true);
        });

        socket.addEventListener('error', function(event) {
        console.log('Error:', event);    







});
        
    } else {
        // not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

