import { QueryStringDeserializer, hasAadProps } from './query.string.deserializer';
import { Constants } from './constants';
import { AadRedirectUrl } from './aad.redirect.url';
import { UserDecoder } from './user.decoder';
import { Storage } from './storage';
export class AadRedirectProcessor {

    constructor(private queryStringDeserializer: QueryStringDeserializer, private userDecoder: UserDecoder, private storage: Storage, private window: Window) {
    }

    public process(redirectUri?: string): boolean {

        let deserializedHash = this.queryStringDeserializer.deserialize(this.window.location.hash);
        let aadRedirect = new AadRedirectUrl(deserializedHash);
        if (aadRedirect.isAadRedirect()) {
            let userProfile = this.userDecoder.decode(aadRedirect.idToken || aadRedirect.accesToken);
            this.storage.setItem(Constants.STORAGE.IDTOKEN, aadRedirect.idToken || '');
            this.storage.setItem(Constants.STORAGE.ACCESSTOKEN, aadRedirect.accesToken || '');
            //this.window.location.assign(this.storage.getItem(Constants.STORAGE.LOGIN_REQUEST));  //Removed, this is a bad assumption
            if (redirectUri){
                this.window.location.assign(redirectUri);
            }
        }

        return aadRedirect.isAadRedirect();
    }
}