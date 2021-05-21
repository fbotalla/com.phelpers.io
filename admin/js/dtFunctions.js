function clearAndRefreshDataTable($table, data) {
    $table.DataTable().clear().rows.add(data).draw();
}

function getDtRowFromChild(el) {
    let $el = $(el),
        $closestRow = $el.closest("tr");
    return $closestRow.closest("table").DataTable().row($closestRow)
}

function getDtRowFromRowsChild(el) {
    return getDtRowFromChild($(el).closest("tr").closest("table").closest("tr").prev())
}

function getDtRowParentFromChild(el) {
    return getDtRowFromChild($(el).closest("tr").prev())
}

function objectifyFormInputs(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {

        /*        if ($(formArray[i]).is(':radio')) {
                    // Skip iterations where a radio isn't selected.
                    if (!$(formArray[i]).is(':checked')) {
                        continue;
                    }
                }*/

        var val = _.defaultTo($(formArray[i]).val(), null);
        if ($(formArray[i]).is(':checkbox')) {
            val = $(formArray[i]).is(':checked');
        }
        if ($(formArray[i]).is(':radio')) {
            val = $(formArray[i]).is(':checked') ? $(formArray[i]).val() : null;
        }
        if (formArray[i]['name']) {
            if ($(formArray[i]).hasClass("upload-file")) {
                val = $(formArray[i]).closest(".upload-file-container").find(".file").data().id
            }
            if (typeof returnArray[formArray[i]['name']] === 'undefined' || returnArray[formArray[i]['name']] === null) {
                returnArray[formArray[i]['name']] = (val !== "" ? val : null)
            }
        }
    }
    return returnArray;
}
