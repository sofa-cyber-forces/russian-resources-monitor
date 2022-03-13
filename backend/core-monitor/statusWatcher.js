import { cooldown } from './config';
import { urlController } from './controllers/urlController'

function statusWatcher(){
    let urls = urlController.getAll();
    urls.forEach(el => {
        if(el.Date && Date.now()-el.Date>cooldown){
            async 
        }
    });
}