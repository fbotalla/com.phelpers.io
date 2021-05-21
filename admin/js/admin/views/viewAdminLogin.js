function generateHtmlForAdmin(){
    return `
            <nav class="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
            <div class="container">
                <a class="navbar-brand js-scroll-trigger" href="#page-top">Admin Page</a>
                <button class="navbar-toggler navbar-toggler-right text-uppercase font-weight-bold bg-primary text-white rounded" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    Menu
                    <i class="fas fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" id="reviewComments" href="#">Review comments</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" id="addField" href="#">Add field</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" id="blockUser" href="#">Block user</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" id="reports" href="#">Reports</a></li>
                        <li class="nav-item mx-0 mx-lg-1"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" id="signOut" href="#">SignOut</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <header class="masthead">
            <div id="container"></div>
        </header>

    `
}

function generateHtmlForLogin(){
    return `
            <h1 class="text-center">Admin Login</h1>     
            <div>                                        
                <div class="text-center">                
                    <div class="col-sm-12">              
                        <label>Email:</label>            
                        <input                           
                            type="text"                  
                            id="email"/>                 
                    </div>                               
                    <div class="col-sm-12">              
                        <label>Password:</label>         
                        <input                           
                                type="text"              
                                id="password"/>          
                    </div>                               
                    <button id="login">Login</button>    
                </div>                                   
            </div>                                       
    `
}


