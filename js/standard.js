import { insertComponent } from "../js/components.js";
import { loadMine } from "../js/mine.js"
import { loadLoginButton } from "../js/login.js"


insertComponent("#load-title", "../components/title.html", loadLoginButton);
insertComponent("#load-footer", "../components/footer.html");