function initAddField(){
    $("#container").empty().append(generateHtmlForAddField())
}

function addNewField(){
    let form = objectifyFormInputs($(".add-new-field").find(".form-control"));
    switch (form.where) {
        case "Categories":
            addToCategories(form)
            break;
        case "Users":
            addToUsers(form)
            break;
        case "Notifications":
            // addToNotifications(form)
            break;
    }
}



function addToCategories(form) {
    let collections = ["Healthy Living", "Parenting", "Finance", "Business", "Religion", "Sexuality", "Society", "Medical", "Mental Health", "Relationships", "Intimacy", "Females", "Males", "Covid-19", "LGBTQ", "BLM"];

    if (form.fieldName.length > 0) {
       collections.forEach(collection => {
            firebase
                .firestore()
                .collection(collection)
                .get()
                .then(docs => {
                    docs.forEach(doc => {
                        firebase
                            .firestore()
                            .collection(collection)
                            .doc(doc.data().docRefId)
                            .set({
                                [form.fieldName]: form.defaultVal
                            }, {merge: true})
                            .then(() => {
                                console.log("Added to " + doc.data().docRefId)
                            })
                    })
                })
        })
    }
}

function addToUsers(form) {
    if (form.fieldName.length > 0) {
        firebase
            .firestore()
            .collection("Users")
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    firebase
                        .firestore()
                        .collection("Users")
                        .doc(doc.data().userId)
                        .set({
                            [form.fieldName]: form.defaultVal
                        }, {merge: true})
                        .then(() => {
                            console.log("Added to " + doc.data().userId)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            })
    }
}

// function addToNotifications(form){
//     if (form.fieldName.length > 0) {
//         firebase
//             .firestore()
//             .collection("Notifications")
//             .doc("documents")
//             .get()
//             .then(docs => {
//                 docs.forEach(doc => {
//                     console.log(doc)
//                     firebase
//                         .firestore()
//                         .collection("Notifications")
//                         .doc("documents")
//                         .collection()
//                         .doc(doc.data().refToDocId)
//                         .set({
//                             [form.fieldName]: form.defaultVal
//                         }, {merge: true})
//                         .then(() => {
//                             console.log("Added to " + doc.data().userId)
//                         })
//                         .catch((err) => {
//                             console.log(err)
//                         })
//                 })
//             })
//     }
// }
