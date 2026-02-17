import { App, staticFiles } from "fresh";
import { createJWT } from "./utils.ts";
import { checkAuth } from "./utils.ts";
import dotenv from "dotenv";

export const app = new App();

dotenv.config();
const EMAIL = Deno.env.get("EMAIL");
const PASSWORD = Deno.env.get("PASSWORD");

app.use(staticFiles());

app.post("/api/login", async (ctx) => {
  try {
    const form = await ctx.req.formData();

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/login?error=empty_fields",
        },
      });
    }

    const success = EMAIL === email && PASSWORD === password;

    if (!success) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/login?error=invalid_credentials",
        },
      });
    }

    const auth = createJWT({ email });

    return new Response("", {
      status: 303,
      headers: {
        "Set-Cookie":
          `auth=${auth}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
        Location: "/dashboard",
      },
    });
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/login?error=server_error",
      },
    });
  }
});

app.post("/api/logout", (ctx) => {
  try {
    return new Response("", {
      status: 303,
      headers: {
        "Set-Cookie":
          `auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
        Location: "/login",
      },
    });
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/dashboard",
      },
    });
  }
});

app.post("/api/static/scan", async (ctx) => {
  try {
    const form = await ctx.req.formData();

    const image = form.get("image") as string;
    if (!image) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/static/scan?error=empty_fields",
        },
      });
    }

    const res = await fetch("https://scannerhubv2.online/static/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    });
    const data = await res.json();
    const scanID = data.scanId;
    if (!scanID) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/static/scan?error=server_error",
        },
      });
    }

    return new Response("", {
      status: 303,
      headers: {
        Location: `/static/check?scanID=${scanID}`,
      },
    });
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/static/scan?error=server_error",
      },
    });
  }
});

app.post("/api/static/check", async (ctx) => {
  try {
    const form = await ctx.req.json();
    const scanID = form.scanID
    if (!scanID) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/static/check?error=empty_fields",
        },
      });
    }
    const res = await fetch(`https://scannerhubv2.online/static/${scanID}`);
    const data = await res.json();
    if (!data) {
      return new Response("", {
        status: 303,
        headers: {
          Location: "/static/check?error=server_error",
        },
      });
    }

    return new Response(
      JSON.stringify({ success: true, data}),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: {
        Location: "/static/check?error=server_error",
      },
    });
  }
});
//app.use("/(me)", checkAuth);
//app.use("/(main)", alreadylogged);

app.fsRoutes();
