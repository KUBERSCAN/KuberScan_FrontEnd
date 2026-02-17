

const LoginHeader = () => { 
    return (
        <header class="dashboard-header">
        <a href="/dashboard"><h1>Welcome</h1></a>
        <div class="header-right">
        <nav>
        <a href="/pod/search">Search Pod</a>
        <a href="/static/check">Check Scan</a>
        <a href="/static/scan">Scan Image</a>
        </nav>
        <form action="/api/logout" method="POST">
          <button type="submit" class="logout-btn">Logout</button>
        </form>
         </div>
      </header>
    );
}

export default LoginHeader;