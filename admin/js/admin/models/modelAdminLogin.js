function login(email,password){
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    firebase
                        .firestore()
                        .collection("Users")
                        .doc(user.uid)
                        .get()
                        .then(doc=>{
                            if(doc.data().admin){
                                initAdmin()
                            }else{
                                console.log("Display that you are not an admin")
                            }
                        })
                } else {
                    console.log("Something else")
                }
            });
        })
        .catch((error) => {
            console.log("Login Failed!", error);
        });
}


function initAdmin(){
    $("#adminPage").empty().append(generateHtmlForAdmin())
}

function initLoginScreen(){
    $("#adminPage").empty().append(generateHtmlForLogin())
}

