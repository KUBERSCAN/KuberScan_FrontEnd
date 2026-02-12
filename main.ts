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
          Location: "/login?error=empty_fields" 
        },
      });
    }

    const success = EMAIL === email && PASSWORD === password;
    
    if (!success) {
      return new Response("", {
        status: 303,
        headers: { 
          Location: "/login?error=invalid_credentials" 
        },
      });
    }

    const auth = createJWT({ email });
    
    return new Response("", {
      status: 303,
      headers: { 
        "Set-Cookie": `auth=${auth}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`,
        Location: "/dashboard" 
      },
    });
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: { 
        Location: "/login?error=server_error" 
      },
    });
  }
});

app.post("/api/logout", (ctx) => {
  try {
    return new Response("", {
      status: 303,
      headers: { 
        "Set-Cookie": `auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
        Location: "/login" 
      },
    });
  } catch (error) {
    return new Response("", {
      status: 303,
      headers: { 
        Location: "/dashboard" 
      },
    });
  }
});

//app.use("/(me)", checkAuth);
//app.use("/(main)", alreadylogged);

app.fsRoutes();