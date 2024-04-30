import { coverLetter, generationState, } from "./utils/storage";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type == "generate") {
      const projDesc = message.projDesc;
      console.log(projDesc)
      await generationState.setValue("generating");
      console.log("Generating content...");
      setTimeout(async () => {
        
        await coverLetter.setValue(projDesc)
        console.log("Generated content");
        await generationState.setValue("generated");
      
    }, 3000);
  return true;

}

    return false;
  });





});
