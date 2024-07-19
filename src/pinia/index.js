import { defineStore } from "pinia"
const store = {
    state:() => {
        return {
            properties:{
                albumArtist:'',
                albumTitle:'',
                artist:'',
                contentType:'music',
                genres:'',
                subTitle:'',
                title:'',
            },
            thumbs:{
                thumbnail:'',
                primaryColor:'',
                secondaryColor:'',
                tertiaryColor:'',
                textColor:'',
                highContrastColor:'',
            },
            state:'', //1 playing, 2 paused, 3 stopped
        }
    },
    actions:{
        
    },
    getters:{

    }
}
export const useStore = defineStore('store',store);