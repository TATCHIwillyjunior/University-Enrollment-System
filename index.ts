import { v4 as uuidv4 } from "uuid"
import { runAllScenarios } from "./src/cli/scenarios";

const id = uuidv4()
console.log("running the application ... ", id)

try {
  runAllScenarios();
} catch (err) {
  console.error("❌ Fatal error in application:", err);
}

