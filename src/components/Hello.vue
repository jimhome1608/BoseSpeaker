<template>
  <div class="container">     
    <div class="row"> 
        <ul class="nav nav-pills top_butts">          
          
          <li role="presentation">&nbsp;{{now_playing_info}}&nbsp;</i></li>   
          <li v-if="now_playing_info!=''" role="presentation" class="liStarButton"><i v-on:click="add_item()" class="fa fa-star fa-2x" aria-hidden="true"></i></li> 
          <li role="presentation" class="liButton"><i v-on:click="now_playing" class="fa fa-music fa-2x" aria-hidden="true"></i></li>
          <li role="presentation">&nbsp;{{get_volume()}}&nbsp;</i></li>             
          <li role="presentation" class="liButton"><i v-on:click="volume_up_down(-1)" class="fa fa-volume-down fa-2x" aria-hidden="true"></i></li>          
          
          <li role="presentation" class="liButton"><i v-on:click="volume_up_down(1)" class="fa fa-volume-up fa-2x" aria-hidden="true"></i></li>
          <li role="presentation">&nbsp;{{get_bass()}}</i></li>   
          <li role="presentation" class="liButton"><i v-on:click="bass_up_down(-1)" class="fa fa-minus fa-2x" aria-hidden="true"></i></li> 
          <li role="presentation" class="liButton"><i v-on:click="bass_up_down(1)" class="fa fa-plus fa-2x" aria-hidden="true"></i></li> 
          <li role="presentation" class="liButton"><i v-on:click="open_register_screen" class="fa fa-cogs fa-2x" aria-hidden="true"></i></li> 
        </ul>           
        <ul class="nav nav-pills">          
           <li role="presentation"class="liItem"  v-for="c in contentItmes" ><a v-on:click="play(c)">{{c.name}}</a></li>
        </ul>           
        <br />                
        <img v-bind:src="playing.image">
        <img v-if="about_show" class="boseimg" src="../assets/BoseSpeaker.jpg">
        <br /> 
        <br />  
        <i v-on:click="toggleAbout" class="fa fa-info fa-2x" aria-hidden="true"></i>  
    </div>
    
  </div>

</template>

<script>

import axios from 'axios';

export default {
  name: 'hello',
  data () {
    return {
      BoseSpeakerIP: "10.0.0.49",
      about_show: false,
      playing: {
        image: ""
      },
      contentItmesStore: "",
      contentItmes: [
        {
	    	item: "<ContentItem source=\"INTERNET_RADIO\" location=\"77625\" sourceAccount=\"\" isPresetable=\"true\"><itemName>JAZZfm 106.5</itemName><containerArt>http://item.radio456.com/007452/logo/logo-77625.jpg</containerArt></ContentItem>",
		    name: "JAZZfm 106.5",
        image: "http://item.radio456.com/007452/logo/logo-77625.jpg"
	      },
        {
	    	item: "<ContentItem source=\"INTERNET_RADIO\" location=\"64030\" sourceAccount=\"\" isPresetable=\"true\"><itemName>ABC Classic 2</itemName><containerArt>http://item.radio456.com/007452/logo/logo-64030.jpg</containerArt></ContentItem>",
		    name: "ABC Classic",
        image: "http://item.radio456.com/007452/logo/logo-64030.jpg"
	      },
        {
        item: "<ContentItem source=\"INTERNET_RADIO\" location=\"49358\" sourceAccount=\"\" isPresetable=\"true\"><itemName>Ambiance Reggae</itemName><containerArt>http://item.radio456.com/007452/logo/logo-49358.jpg</containerArt></ContentItem>",
        name: "Ambiance Reggae",
        image: "http://item.radio456.com/007452/logo/logo-49358.jpg"
        },
        {
        item: "<ContentItem source=\"INTERNET_RADIO\" location=\"6701\" sourceAccount=\"\" isPresetable=\"true\"><itemName>3MBS 103.5 FM</itemName><containerArt>http://item.radio456.com/007452/logo/logo-6701.jpg</containerArt></ContentItem>",
        name: "3MBS 103.5 FM",
        image: "http://item.radio456.com/007452/logo/logo-6701.jpg"
        },
        {
        item: "<ContentItem source=\"INTERNET_RADIO\" location=\"33453\" sourceAccount=\"\" isPresetable=\"true\"><itemName>Radio Eigekai</itemName><containerArt>http://item.radio456.com/007452/logo/logo-33453.jpg</containerArt></ContentItem>",
        name: "Radio Eigekai",
        image: "http://item.radio456.com/007452/logo/logo-33453.jpg"
        },
        {
        item: "<ContentItem source=\"INTERNET_RADIO\" location=\"80921\" sourceAccount=\"\" isPresetable=\"true\"><itemName>Boost Tapes</itemName><containerArt>http://item.radio456.com/007452/logo/logo-80921.jpg</containerArt></ContentItem>",
        name: "Boost Tapes",
        image: "http://item.radio456.com/007452/logo/logo-80921.jpg"
        }
      ],
      boseObject: '' ,
      volumeObject: '',
      volume: -10,
      bassObject: '',
      bass: 10,
      ContentItem: '',
      now_playing_info: '',
    }
  },
  created: function () {
      if (localStorage.getItem("BoseSpeakerIP") != null) 
        this.BoseSpeakerIP = localStorage.getItem('BoseSpeakerIP');
      else 
        localStorage.setItem('BoseSpeakerIP',this.BoseSpeakerIP );      

      if(localStorage.getItem("contentItmesStore") != null) {
          this.contentItmes = JSON.parse(localStorage.getItem('contentItmesStore'));
          console.log("loaded from local storage");
      }
      else {
        localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes));
      }
  },
  methods: {
    add_item() {
        alertify.warning("Add new item. Not implemented yet");
    },
    get_ip() {
        if (this.BoseSpeakerIP == "") {
            this.$router.push('/register');
            return "";
        };
        return "http://"+this.BoseSpeakerIP;
    },
    open_register_screen() {
         this.$router.push('/register');
     },
    toggleAbout () {
        this.about_show = !this.about_show;
    },
    get_bass() {
      if (this.bass == 10) return "";
      var range = 9;
      var percent = (this.bass - -9) / range      
      percent =  percent * 100;
      percent = percent.toFixed(0);
      return "Bass: "+percent+"%";

    },
    get_volume() {
      if (this.volume == -10) return "";
      return "Volume: "+this.volume+"%";

    },
     bass_up_down(up_value) {
       var instance = this;
       var _url = this.get_ip()+":8090/bass";
       console.log(_url);
       if (this.bass == 10) {        
          axios.get(_url)
          .then(response => {
            instance.bassObject =  response.data; 
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(instance.bassObject,"text/xml");
            var s =  xmlDoc.getElementsByTagName("actualbass") [0].childNodes[0].nodeValue;   
            instance.bass = parseInt(s);                 
          });
          return;
        };
        var _url = this.get_ip()+":8090/bass";
        if (up_value < 0)
          instance.bass = instance.bass - 1;
        else
          instance.bass = instance.bass + 1;
        if (instance.bass > 0) instance.bass = 0;
        if (instance.bass < -9) instance.bass = -9;
        var _body =  "<bass>"+instance.bass+"</bass>"
        axios.post(_url, _body)
        .then(response => {
          instance.boseObject =  response.data;  
        });

    },
    volume_up_down(up_value) {
       var instance = this;
       var _url = this.get_ip()+":8090/volume";
       //alertify.warning(_url);
       if (this.volume == -10) {        
          axios.get(_url)
          .then(response => {
            instance.volumeObject =  response.data; 
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(instance.volumeObject,"text/xml");
            var s =  xmlDoc.getElementsByTagName("actualvolume") [0].childNodes[0].nodeValue;   
            instance.volume = parseInt(s);                 
          });
          return;
        };
        var _url = this.get_ip()+":8090/volume";
        if (up_value < 0)
          instance.volume = instance.volume - 2;
        else
          instance.volume = instance.volume + 2;
        if (instance.volume > 100)
          instance.volume = 100;
        var _body =  "<volume>"+instance.volume+"</volume>"
        axios.post(_url, _body)
        .then(response => {
          instance.boseObject =  response.data;  
        });

    },
    now_playing() {
            this.now_playing_info = "Changing Station";
             // var _url = "http://10.0.0.49:8090/trackInfo";
            var _url =  this.get_ip()+":8090/now_playing"; 
              axios.get(_url)
               .then(response => {
                  this.boseObject =  response.data;
                  console.log(this.boseObject);
                  var startpos = this.boseObject.indexOf("<ContentItem");
                  var endpos = this.boseObject.indexOf("</ContentItem>") + 14;
                  console.log(startpos);
                  this.ContentItem = this.boseObject.substring(startpos, endpos); 
                  this.ContentItem = this.ContentItem.replace(/\"/g,'\\"');
                   console.log(this.ContentItem);
                  var parser = new DOMParser();
                  var xmlDoc = parser.parseFromString(this.boseObject,"text/xml");
                  this.now_playing_info =  xmlDoc.getElementsByTagName("itemName") [0].childNodes[0].nodeValue;                  
                });
                
      },
      play(ContentItem) {
        this.now_playing_info = "Changing Station";
        this.playing.image = ContentItem.image;
        var instance = this;
        var _url =  this.get_ip()+":8090/select"; 
                var _body =  ContentItem.item;                  
                 axios.post(_url, _body)
                 .then(response => {
                   instance.boseObject =  response.data;  
                   setTimeout(function(){ instance.now_playing()}, 5000);
                  });

      },      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-left: 10px;
}
.top_butts {
  font-weight: bold;
  font-size: large;
}
h1, h2 {
  font-weight: normal;
}
.fa {
   cursor: pointer;
}
.liStarButton {
  color: skyblue;
}
.liButton {
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
}
.liAbout {
  cursor: pointer;
  background-color: navy;
  color: white
}
.liItem {
  cursor: pointer;
  background-color: black;
  margin-top: 10px;
}
.boseimg {
  border-radius: 25px;
}
a {
  color: skyblue;
}
</style>
