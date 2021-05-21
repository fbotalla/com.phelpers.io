function initReport() {
    $("#container").empty().append(generateHtmlForReports())
    let columnIndex = 0
    $("#report").DataTable({
        data:[],
        columnDefs: [
            {
                render: function (data, type, row) {

                    // Action
                    return row.email !== undefined ? row.username : row.collection
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.email !== undefined ? row.email : row.numOfHowManyFoundItUseful
                },
                targets: columnIndex++
            },
            {
                render: function (data, type, row) {
                    // Action
                    return row.email !== undefined ? row.hasPremium : row.numOfReports
                },
                targets: columnIndex++
            },
        ]
    })
}

function refreshReportTable(){
    let form = objectifyFormInputs($(".reportForm").find(".form-control"));
    if(form.type === "Users"){

        $("#reportTr").empty().append(generateHtmlTableForUsers())
    }else if(form.type === "Collections"){

        $("#reportTr").empty().append(generateHtmlTableForCollection())
    }

    getReportData(form)
}


function getReportData(form) {
    let reportData = [],
        collections = ["Healthy Living", "Parenting", "Finance", "Business", "Religion", "Sexuality", "Society", "Medical", "Mental Health", "Relationships", "Intimacy", "Females", "Males", "Covid-19", "LGBTQ", "BLM"];
    if (form.type === "Users") {
       getDataUsers(form)
    } else {
        new Promise((resolve) => {
            collections.forEach(async (collection) => {
                let docRef = firebase
                    .firestore()
                    .collection(collection)
                let docs = await docRef.get()
                await docs.forEach(doc => {
                    reportData.push(doc.data())
                })
                clearAndRefreshDataTable($("#report"), reportData)
            })
            resolve(reportData)
        })
    }
}

function getDataUsers(form){
    let reportData = []

    if(form.userId) {
        firebase
            .firestore()
            .collection("Users")
            .doc(form.userId)
            .get()
            .then(doc=>{
                console.log(doc.data())
                clearAndRefreshDataTable($("#report"), [doc.data()])
            })
    }else {
        firebase
            .firestore()
            .collection(form.type)
            .get(form.userId ? form.userId : "")
            .then(docs => {
                docs.forEach(doc => {
                    reportData.push(doc.data())
                })
            })
            .then(() => {
                clearAndRefreshDataTable($("#report"), reportData)
            })
    }
}

