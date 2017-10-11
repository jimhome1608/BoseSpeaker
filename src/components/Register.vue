<template>
    <div>
        <h3>Bose Speaker IP Address:</h3>
        <div class="container">
            <div class="input-group">
              <span class="input-group-btn">
                <button class="btn btn-danger" type="button" v-on:click="close_settings" >
                  Close                
                </button>  
                <button class="btn btn-primary" type="button" v-on:click="saveKeys" >Save</button>
                <button class="btn btn-info" type="button" v-on:click="start_search" >
                    Search
                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                </button>                
              </span>
              <input type="text" class="form-control" placeholder="Enter IP of Bose Speaker" v-model="BoseSpeakerIP">
            </div><!-- /input-group -->
            <h4 v-bind:class="get_class()">{{statusline}}</h4>             
            <div class="deviceInfo h4" v-if="deviceInfo.hasOwnProperty('info')">
                <hr>
                Name: <strong>{{deviceInfo.info.name}}<br /></strong>
                Type: <strong>{{deviceInfo.info.type}}<br /></strong>
                IP Address: <strong>{{deviceInfo.info.networkInfo[0].ipAddress}}<br /></strong>
                Software Version: <strong>{{get_device_software_version()}}<br /></strong>
                Serial Number: <strong>{{get_device_serialnumber()}}<br /></strong>                
                <div v-if="deviceInfo.info.type=='SoundTouch 30'">
                <img src="../assets/Bose04.gif" height="320" width="360"/>
                </div>
             </div>
             <div v-if="!deviceInfo.hasOwnProperty('info')">
                 <br>
                 <img src="../assets/Bose04.gif" height="320" width="360"/>
             </div>
            <div class="aboutme">               
                <a href="http://www.jimclark.net.au" target="_blank">www.jimclark.net.au/</a><br />
            </div>             
        </div> 
    </div>
</template>

<script>
    import axios from 'axios';
    // https://www.npmjs.com/package/jxon
    import JXON from 'jxon';
    export default {
        name: 'Register',
        data () {
            return {
                deviceInfo:{},
                BoseSpeakerIP: "",
                searchIP:"",
                stopSearch: false,
                statusline: "",
            }    
        },
        created: function () {
           if (localStorage.getItem("BoseSpeakerIP") != null) {
              this.BoseSpeakerIP = localStorage.getItem('BoseSpeakerIP');
              this.get_info();
           }
        },
        computed: {
        },
        methods: {
            get_device_serialnumber() {
                if (!this.deviceInfo.hasOwnProperty('info'))
                    return ""; //serialNumber
                var _swv =  this.deviceInfo.info.components.component[1].serialNumber;
                return (_swv);
            },
            get_device_software_version() {
                if (!this.deviceInfo.hasOwnProperty('info'))
                    return ""; //serialNumber
                var _swv =  this.deviceInfo.info.components.component[0].softwareVersion 
               var  _pos = _swv.indexOf(' ');
                if (_pos > 0)
                   _swv = _swv.substring(0,_pos-1);
                return (_swv);

            },
            get_class() {
              if (this.statusline.indexOf("Found") >=0)
                return"found";
              else
                return"searching";
            },
            close_settings() {
                this.$router.push('/');
            },
            saveKeys() {
                localStorage.setItem("BoseSpeakerIP",this.BoseSpeakerIP);
                this.$router.push('/');
            },
            start_search() {
                this.statusline = "Searching for speaker.."
                var newipa = '';
                var _url = '';
                var ip = this.BoseSpeakerIP;//'10.0.0.50';
                var ipasplit = ip.split(".")
                ipasplit[3] = 0;
                newipa = ipasplit.join(".");
                this.stopSearch = false;
                this.search_next(newipa);

            },
            get_info() {
            this.deviceInfo = {};
            var instance = this;
            //http://10.0.0.49:8090/info
            var _url =  "http://"+this.BoseSpeakerIP+":8090/info"; 
            axios.get(_url)
                .then(response => {                    
                    //{{presetsFromXML.presets.preset[0].ContentItem.itemName}}   
                    instance.deviceInfo = JXON.stringToJs(response.data);
                    console.log(instance.deviceInfo.info.name);
                });           
            },
            search_next(testip) {
                if (this.stopSearch) {
                    return;
                }
                console.log(testip);
                // var _url = "http://10.0.0.49:8090/trackInfo";
                //setTimeout(function(){ instance.get_now_playing(true)}, 5000);
                var newipa = '';
                var _url = '';
                var ipasplit = testip.split(".");
                ipasplit[3]++;
                if (ipasplit[3] > 255) {
                    this.stopSearch = true;
                    return;             
                }   
                newipa = ipasplit.join(".");
                _url =  "http://"+newipa+":8090/now_playing";
                console.log(_url);
                var instance = this;
                instance.statusline = "Searching for speaker "+newipa;
                axios.timeout = 1000;
                axios.get(_url)
                    .then (response => {
                        console.log(newipa);
                        console.log("success");                        
                        instance.stopSearch = true;
                        instance.statusline = "Found speaker - "+newipa+".  You should click the Save button now";
                        instance.BoseSpeakerIP =newipa; 
                        alertify.warning ("Found spearker: "+newipa)+".  You should click the Save button now";
                        return;
                    })
                    .catch(function (response) {
                        console.log(response);
                        return;
                    });
                        // alertify.warning(newipa);
                if (!this.stopSearch)
                    setTimeout(function(){ instance.search_next(newipa)}, 2000);        
                }                
            }            
        }

</script>

<style  scoped>
.deviceInfo {
    background-color: white;
    color: black;
    width: 380px;
    padding-left: 10px;
    padding-right: 10px;
     border-radius: 15px;
     line-height: 1.5;
     text-align: left;
}
a {
    background-color: white;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 15px;

}
.aboutme {
    
    margin-top: 20px;
    color: white;
    padding-right: 10px;
    line-height: 2;    
}
.searching {
    background-color: darkgreen;
    color: white;
    border: 1px solid black;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 350px;
    border-radius: 8px;
}    
  
.found {
    background-color: navy;
    color: white;
    border: 1px solid black;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 350px;
    border-radius: 8px;
}

</style>