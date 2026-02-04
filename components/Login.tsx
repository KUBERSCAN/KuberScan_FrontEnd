const Login = () => {
  return (
    <>
      <section class="main">
        <h1>
          <span>LOGIN</span>
        </h1>

              <form class="login-form">
                <h3 style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #FFFFFF;">
                  Welcome Back
                </h3>

                <label for="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />

                <label for="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />

                <button type="submit" class="login-btn">Login</button>
              </form>
      </section>
    </>
  );
};

export default Login;
