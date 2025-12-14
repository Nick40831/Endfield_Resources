import { insertComponent } from "../js/components.js";
import { loadMine } from "../js/mine.js"
import { loadUserButton } from "../js/title.js"

insertComponent("#load-title", "../components/title.html", loadUserButton);
insertComponent("#load-footer", "../components/footer.html");

loadMine();
