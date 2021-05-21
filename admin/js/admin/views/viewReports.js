function generateHtmlForReports() {
    return `
           <div class="reportForm">
                    <div class="row form-group required">
                        <label class="col-sm-4 text-right">
                            Type:
                        </label>
                        <div class="col-sm-8">
                           <select 
                                data-placeholder="Select a type..." 
                                class="form-control toggle-select2-search" 
                                id="type" 
                                name="type">
                                <option value=""></option>
                                <option value="Collections">Collections</option>
                                <option value="Users">Users</option>
                           </select>
                        </div>
                    </div>
                    <div class="row form-group required">
                        <label class="col-sm-4 text-right">
                            Top:
                        </label>
                        <div class="col-sm-8">
                            <input class="form-control"
                               type="number"
                                name="top">
                        </div>
                    </div>
                    <div class="row form-group required">
                               <label class="col-sm-4 text-right">
                                    Search Value:
                                </label>
                                <div class="col-sm-8">
                                    <input name="value" class="form-control"
                                           id="value"
                                           type="text">
                               </div>
                    </div>
                     <div class="row form-group required">
                               <label class="col-sm-4 text-right">
                                    UserId:
                                </label>
                                <div class="col-sm-8">
                                    <input name="userId" class="form-control"
                                           id="userId"
                                           type="text">
                               </div>
                    </div>
            </div>
             <table id="report" class="table" style="width: 100%">
                <thead>
                    <tr id="reportTr">
                       
                    </tr>
                </thead>
            </table>
          
    `
}

function generateHtmlTableForUsers(){
    return `
            <th>Username</th>
            <th>Email</th>
            <th>Premium</th>
    `
}

function generateHtmlTableForCollection(){
    return `
            <th>Collection</th>
            <th>Useful</th>
            <th>Reports</th>
    `
}
