<template>
    <div>
        <h3>Bose Speaker IP Address:</h3>
        <div class="container" align="left">
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
             
             <br />
            <div class="author well">
            <strong>Author:</strong> <br />
            Jim Clark<br />
            <a href="http://www.jimclark.net.au/" target="_blank">www.jimclark.net.au/</a><br />
            <i class="fa fa-envelope-o" aria-hidden="true"></i>
            <a href="mailto:jim@jimclark.com.au?Subject=Bose Speaker" target="_top">jim@jimclark.com.au</a><br />
            </div>
        </div>
        
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'Register',
        data () {
            return {
                BoseSpeakerIP: "",
                searchIP:"",
                stopSearch: false,
                statusline: "",
            }    
        },
        created: function () {
           if (localStorage.getItem("BoseSpeakerIP") != null) {
              this.BoseSpeakerIP = localStorage.getItem('BoseSpeakerIP');
           }
        },
        computed: {
        },
        methods: {
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
.author {
    padding-right: 10px;
    background-color: silver;  
    font-size: large;  
    line-height: 1.5;
}
a {
    font-size: x-large
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