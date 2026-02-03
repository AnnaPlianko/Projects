import iziToast, { IziToastSettings } from "izitoast";

class Notify {
    private settings: IziToastSettings = {
        position: "topLeft",
        timeout: 3000,
        transitionIn: "fadeInRight",
        transitionOut: "fadeOutLeft"
    };

    public error(massage: string): void {
        this.settings.message = massage;
        iziToast.error(this.settings);
    }
}

export const notify = new Notify();
