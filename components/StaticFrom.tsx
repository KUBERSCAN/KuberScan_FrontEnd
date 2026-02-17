import ErrorBoxIsland from "../islands/ErrorBoxIsland.tsx";


type StaticFromProps = {
  error: string | null;
};

const StaticForm = ({error}: StaticFromProps) => {
  let errorMessage = "";

  if (error === "scan_failed") {
    errorMessage = "Invalid imagem.";
  } else if (error === "empty_fields") {
    errorMessage = "You must fill in all fields.";
  } else if (error === "server") {
    errorMessage = "You must be logged in to access that page.";
  }
  return (
    <>
      <section class="main">
        <h1>
          <span>SCAN A IMAGE</span>
        </h1>

        <form class="login-form" action="/api/static/scan" method="POST">
          <h3 style="text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: 700; color: #FFFFFF;">
            Check your Image !
          </h3>

          <ErrorBoxIsland message={errorMessage} />

          <label for="image"></label>
          <input
            type="text"
            id="image"
            name="image"
            placeholder="alpine@latest"
            required
          />
          <button type="submit" class="login-btn">Scan Image</button>
        </form>
      </section>
    </>
  );
};

export default StaticForm;
