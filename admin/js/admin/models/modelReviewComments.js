function intiReviewComments(){
    $("#container").empty().append(generateHtmlForReviewingComments())
    let columnIndex = 0;

    $('#reviewCommentsTable').DataTable({
        data:[],
        columnDefs: [
            {
                render: function (data, type, row) {
                    // Action
                    return row.userId
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.username
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.collection
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.question
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.commentBody
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return `<a href="javascript:" class="accept-comment" data-order-guide-request-header-id="${row.postId}"><i class="fas fa-edit"></i>Accept</a></br>
                            <a href="javascript:" class="decline-comment" data-order-guide-request-header-id="${row.postId}"><i class="fas fa-trash-alt text-danger"></i>Reject</a></li>`
                },
                className: 'form-control-xs',
                targets: columnIndex++
            },
        ]
    });

    getReviewCommentsData()
}

function getReviewCommentsData(){
    let arrayOfComments = []
    firebase
        .firestore()
        .collection("CommentsToReview")
        .get()
        .then(docs=>{
            docs.forEach(doc=>{
                console.log("here")
                arrayOfComments.push(doc.data().comment)
            })
        })
        .then(()=>{
            console.log(arrayOfComments)
            clearAndRefreshDataTable( $('#reviewCommentsTable'), arrayOfComments);
        })

}


function acceptComment(commentId,data){
    firebase
        .firestore()
        .collection("Comments")
        .doc(data.collection)
        .collection(data.docRefId)
        .add({
            collection: data.collection,
            commentBody : data.commentBody,
            commentDate: data.commentDate,
            docRefId : data.docRefId,
            postId: data.postId,
            userId: data.userId,
            question: data.question,
            avatar: data.avatar,
            userPhoto: data.userPhoto,
            isAnonymous: data.isAnonymous
        }).then(function(docId){
        firebase.firestore().collection(data.collection).doc(data.docRefId).update({
            numOfComments:firebase.firestore.FieldValue.increment(1)
        })
        firebase.firestore().collection("Comments").doc(data.collection).collection(data.docRefId).doc(docId.id).update({
            thisDocId: docId.id
        })
    }).then(()=>{
        firebase.firestore().collection("CommentsToReview").doc(commentId.toString()).delete().then(function() {
            console.log("Document deleted after been logged");
            getReviewCommentsData()
        }).catch(function(){
            console.log("Document did not delete")
        })
    }).catch(function(error){
        console.log("Something went wrong, " , error)
    });
}

function declineComment(data,reason){
    if(!reason){
        return;
    }
    firebase.firestore().collection("CommentsToReview").doc(data.postId.toString()).delete().then(function(){
        firebase.firestore()
            .collection("Notifications")
            .doc("documents")
            .collection(data.userId).add({
            collection:data.collection,
            date: new Date().getTime(),
            docRefId:data.docRefId,
            isRead:false,
            text:data.commentBody,
            reason:reason,
            type:"comment rejected"

        }).then((ref) => {
            firebase.firestore()
                .collection("Notifications")
                .doc("documents")
                .collection(data.userId)
                .doc(ref.id)
                .update({
                    refToDocId: ref.id
                })
                .then(()=>{
                    firebase.firestore().collection("CommentsToReview").doc(data.postId.toString()).delete().then(function(){
                        getReviewCommentsData()
                    }).catch(function(){
                        console.log("Document did not delete")
                    })
                })
                .catch((err) => {
                    return err
                })

        }).catch(function(){
            console.log("Document did not delete")
        })
    })
}
