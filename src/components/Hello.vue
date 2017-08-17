<template>
  <div class="container">     
    <div class="row"> 
        <ul class="nav nav-pills top_butts">          
          <li role="presentation" class="liButton"><i v-on:click="now_playing" class="fa fa-music fa-2x" aria-hidden="true"></i></li>
          <li role="presentation">&nbsp;{{now_playing_info}}&nbsp;</i></li>   
          <li role="presentation" class="liButton"><i v-on:click="volume_up_down(-1)" class="fa fa-volume-down fa-2x" aria-hidden="true"></i></li>          
          <li role="presentation">&nbsp;{{volume}}%&nbsp;</i></li>             
          <li role="presentation" class="liButton"><i v-on:click="volume_up_down(1)" class="fa fa-volume-up fa-2x" aria-hidden="true"></i></li>
        </ul>           
        <ul class="nav nav-pills">          
           <li role="presentation"class="liItem"  v-for="c in contentItmes" ><a v-on:click="play(c)">{{c.name}}</a></li>
        </ul>           
        <br />                
        <img v-bind:src="playing.image">
        <img v-if="about_show" class="boseimg" src="../assets/BoseSpeaker.jpg">
        <br /> 
        <br />  
        {{volume}}
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
      about_show: false,
      playing: {
        image: ""
      },
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
      volume: 0,
      ContentItem: '',
      now_playing_info: '',
    }
  },
  watch: {

  },
  methods: {
    toggleAbout () {
        this.about_show = !this.about_show;
    },
    volume_up_down(up_value) {
      /*
      <volume deviceID="9884E39A8AB2">
      <targetvolume>18</targetvolume>
      <actualvolume>18</actualvolume>
      <muteenabled>false</muteenabled>
      </volume>
      */
       var instance = this;
       var _url = "http://10.0.0.49:8090/volume";
       if (this.volume == 0) {        
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
        var _url = "http://10.0.0.49:8090/volume";
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
            var _url = "http://10.0.0.49:8090/now_playing";
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
        var _url = "http://10.0.0.49:8090/select";
                var _body =  ContentItem.item;                  
                 axios.post(_url, _body)
                 .then(response => {
                   instance.boseObject =  response.data;  
                   setTimeout(function(){ instance.now_playing()}, 5000);
                  });

      },
      jazz() {
                this.play(this.jazzContent);  
            },  
      reggae() {
                this.play(this.reggaeContent);                
            }, 
      classical() {
                this.play(this.classicContent);                
            },                        
      test() {
                this.play(this.contentItmes[2].item);
                alert(this.contentItmes[2].name);
            },  
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.liButton {
  border: 1px solid black;
  padding-left: 10px;
  padding-right: 10px;
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
