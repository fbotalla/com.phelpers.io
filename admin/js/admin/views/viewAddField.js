function generateHtmlForAddField(){
    return `
        <div class="add-new-field">
                    <div class="row form-group required">
                        <label class="col-sm-4 text-right">
                            Where:
                        </label>
                        <div class="col-sm-8">
                           <select 
                                data-placeholder="Select a type..." 
                                class="form-control toggle-select2-search" 
                                id="where" 
                                name="where">
                                <option value="Categories">Categories</option>
                                <option value="Users">Users</option>
                                <option value="Notifications">Notitications</option>
                           </select>
                        </div>
                    </div>
                    <div class="row form-group required">
                        <label class="col-sm-4 text-right">
                            Field Name:
                        </label>
                        <div class="col-sm-8">
                            <input class="form-control"
                               type="text"
                                name="fieldName"/>
                        </div>
                    </div>
                    <div class="row form-group required">
                               <label class="col-sm-4 text-right">
                                    Default Value:
                                </label>
                                <div class="col-sm-8">
                                    <input name="defaultVal" class="form-control"
                                           id="defaultVal"
                                           type="text"/>
                               </div>
                    </div>
            </div>
            <button class="button" id="addNewField">Add field</button>
        <div>
    `
}
