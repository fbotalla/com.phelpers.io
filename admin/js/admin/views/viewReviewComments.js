function generateHtmlForReviewingComments(){
    return `
       <table id="reviewCommentsTable" class="table" style="width: 100%">
    <thead>
        <tr>
            <th>userId</th>
            <th>Username</th>
            <th>Collection</th>
            <th>Question</th>
            <th>Comment to Review</th>
            <th>Action</th>
        </tr>
    </thead>
</table>
    `
}
