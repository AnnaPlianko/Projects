import { errorExtractor } from "error-extractor/dist/error-extractor";
import iziToast, { type IziToastSettings } from "iziToast";

// UI notification wrapper for consistent success/error toasts.
class Notify {
    
    private settings: IziToastSettings = {
        position: "topLeft",
        timeout: 3000,
        transitionIn: "fadeInRight",
        transitionOut: "fadeOutLeft"
    };

    
public success(message:string):void{
    this.settings.message=message;
    iziToast.success(this.settings);


}
public error(err:any):void{
    this.settings.message = errorExtractor.getMessage(err);
    iziToast.error(this.settings);
}

}

	


export const notify = new Notify();
