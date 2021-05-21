$( document ).ready(function() {

    $(document).on("click", "#login", function () {
        let email = $("#email").val()
        let password = $("#password").val()
        login(email, password)
    })

    $(document).on("click", "#signOut", function () {
        firebase.auth().signOut().then(() => {
            initLoginScreen()
        }).catch((error) => {
            // An error happened.
        });
    })

    $(document).on("click", "#reviewComments", function () {
        intiReviewComments()
    })

    $(document).on("click", "#addField", function () {
        initAddField()
    })

    $(document).on("click", "#addNewField", function () {
        addNewField()
    })

    $(document).on("change", ".reportForm .form-control", function () {
        refreshReportTable();
    });

    $(document).on("click", "#reports", function () {
        initReport()
    })

    $(document).on("click", ".accept-comment", function () {
        let data = getDtRowFromChild(this).data()
        acceptComment(data.postId,data)
    })

    $(document).on("click", ".decline-comment", function () {
       let reason =  window.prompt("Reason for declining this message?")
        declineComment(getDtRowFromChild(this).data(),reason)
    })
})
