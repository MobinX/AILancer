import "./style.css"
import { coverLetter, generationState } from "./utils/storage";
export default defineContentScript({
  matches: ['*://*.freelancer.com/*'],
  runAt: 'document_idle',
  async main() {
    console.log('Hello from content script!');

    async function exec(descElm: any, textarea: HTMLTextAreaElement) {
      let desc = descElm.querySelector("span")?.textContent;

      browser.runtime.sendMessage({type:"generate",projDesc:desc}).then((response) => {console.log(response)}); 
      // console.log("first cover letter", await coverLetter.getValue());
      // let unwatchCoverLetter = coverLetter.watch(async (newValue) => { console.log("value changed ",newValue) });   
      let unwatch = generationState.watch(async (newValue) => {
        if(newValue == "generated"){
          let letter = await coverLetter.getValue();
          console.log(letter);
          textarea.value = letter;
          showMsg("Cover Letter Generated", "Close", () => {
            const toastElement = document.querySelector(".toast");
            if (toastElement) {
              document.body.removeChild(toastElement);
            }
          });


        
        
        }
        if(newValue == "generating"){
          showMsg("Generating Cover Letter...");
        }
      })

 
    }

    function showMsg(Msg: string, btn: string = "", onclick: Function = () => { }) {
      let toast = document.createElement("div");
      //add tailwind classes
      toast.setAttribute("class", "toast toast-end bottom-[80px] transition ease-in-out delay-150 durantion-300")

      let msg = document.createElement("div");
      //add tailwind classes
      msg.setAttribute("class", "alert")
      msg.textContent = Msg;
      let btnElm = document.createElement("button");
      btnElm.setAttribute("class", "btn btn-primary btn-sm   ml-2")
      btnElm.textContent = btn;
      btnElm.onclick = onclick as (this: GlobalEventHandlers, ev: MouseEvent) => any;

      msg.appendChild(btnElm);
      toast.appendChild(msg);

      document.body.appendChild(toast);

      setTimeout(() => {
        // document.body.removeChild(toast);
        document.body.removeChild(toast);
      }, 5000)

    }

    document.addEventListener("readystatechange", async (event) => {
      if (document.readyState === "complete") {


        let executed = false;
        let oldHref = document.location.href;
        const bodyElement = document.querySelector("body");
        if (bodyElement) {
          console.log("adding observer")
          const observer = new MutationObserver( async () => {
            if (oldHref !== document.location.href && executed) { executed = false; oldHref = document.location.href; }
            let descElm = document.querySelector("fl-bit.ProjectDescription")
            const textarea = document.querySelector("textarea");
            if (descElm !== null && descElm !== undefined && textarea !== null && !executed) {
              await exec(descElm, textarea);
              console.log("callback that runs when observer is triggered");
              executed = true;
            }
          });

          observer.observe(bodyElement, {
            subtree: true,
            childList: true,
          });
        }


      }
    });


  },
});
