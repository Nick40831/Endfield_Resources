import { insertComponent } from "../js/components.js";
import { loadMine } from "../js/mine.js"

insertComponent("#load-title", "../components/title.html");
insertComponent("#load-footer", "../components/footer.html");
loadMine()