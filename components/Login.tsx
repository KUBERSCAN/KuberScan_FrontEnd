import ErrorBoxIsland from "../islands/ErrorBoxIsland.tsx";


type LoginFormProps = {
  error: string | null;
};

const Login = ({error}: LoginFormProps) => {
  let errorMessage = "";

  if (error === "invalid_credentials") {
    errorMessage = "Invalid email or password. Please try again.";
  } else if (error === "empty_fields") {
    errorMessage = "You must fill in all fields.";
  } else if (error === "unauthorized") {
    errorMessage = "You must be logged in to access that page.";
  }
  return (
    <>
      <section class="main">
        <h1>
          <span>LOGIN</span>
        </h1>

        <form class="login-form" action="/api/login" method="POST">
          <h3 style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #FFFFFF;">
            Welcome Back
          </h3>

          <ErrorBoxIsland message={errorMessage} />

          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            value="admin@kubernetes.com"
            required
          />

          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value="k8sadmin"
            required
          />

          <button type="submit" class="login-btn">Login</button>
        </form>
      </section>
    </>
  );
};

export default Login;
