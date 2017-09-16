<template>
  <div class="container">     
    <div class="row"> 
      <div>
          <h3 align="left">&nbsp;Bose Speaker 
            <i v-on:click="post_key('POWER')" class="fa fa-power-off" aria-hidden="true"></i>         
            <i v-on:click="open_register_screen" class="fa fa-cogs" aria-hidden="true"></i>              
          </h3>
      </div>   
      <hr>   
  
        <div align="left">   
          <h3 align="left">&nbsp;{{now_playing_status}}&nbsp;
          <i  v-on:click="get_now_playing(true)" class="fa fa-music faButt" aria-hidden="true"></i>          
          <i v-on:click="add_content(now_playing)" v-if="now_playing.name!=''"  class="fa fa-star faButt" aria-hidden="true"></i>
          <i v-if="!ViewList" v-on:click="setViewList(true)" class="fa fa-bars faButt" aria-hidden="true"></i>
          <i v-if="ViewList" v-on:click="setViewList(false)" class="fa fa-id-card-o faButt" aria-hidden="true"></i>
          <i v-if="!openChangeInput" v-on:click="toggle_openChangeInput" class="fa fa-folder-o faButt" aria-hidden="true">..</i>     
           <div class="blockButtons">                                             
              <i v-if="openChangeInput" v-on:click="toggle_openChangeInput" class="fa fa-folder-open-o faButt" aria-hidden="true">..</i>   
              <i v-if="openChangeInput" v-on:click="email_contents" class="fa fa-share-alt faButt" aria-hidden="true"></i>   
              <i v-if="openChangeInput" v-on:click="post_key('AUX_INPUT')" class="fa fa-microphone faButt" aria-hidden="true"></i>   
              <i v-if="openChangeInput" v-on:click="open_random_content" class="fa fa-exclamation faButt" aria-hidden="true"></i>                 
           </div> 
          </h3>                                                                                                     
        </div>   
        <div class="view">
             <i v-on:click="sortPlayList" class="fa fa-refresh fa-2x faButt" aria-hidden="true"></i>                         
             <i v-if="currentlyPausible" v-on:click="post_key('PAUSE')" class="fa fa-pause fa-2x faButt" aria-hidden="true"></i>
             <i v-if="currentlyPausible" v-on:click="post_key('PLAY')" class="fa fa-play fa-2x faButt" aria-hidden="true"></i>             
             <div class="blockButtons">   
                <i v-on:click="volume_up_down(-1)" class="fa fa-volume-down fa-2x faButt" aria-hidden="true"></i>
                {{get_volume()}}               
                <i v-on:click="volume_up_down(1)" class="fa fa-volume-up fa-2x faButt" aria-hidden="true"></i>             
             </div>
             <div class="blockButtons">           
                <i v-on:click="bass_up_down(-1)" class="fa fa-sort-desc fa-2x faButt" aria-hidden="true"></i>             
                {{get_bass()}}
                <i v-on:click="bass_up_down(1)" class="fa fa-sort-asc fa-2x faButt" aria-hidden="true"></i>              
             </div>
         </div>                  
         <br /> 
         <br /> 
         <br /> 
         <div v-if="sortOrder!=''" align="left">  
             Sorted: <mark>{{sortOrder}} </mark>
         </div> 
         <div  align="left">                      
           
          <input class="viewOptions" v-model="rbViewOptions"  type="radio" name="gender" value="0"> All
          <input class="viewOptions" v-model="rbViewOptions" type="radio" name="gender" value="1"> Internet Radio
          <input class="viewOptions" v-model="rbViewOptions" type="radio" name="gender" value="2"> Local Files
        </div>  
        <ul v-if="ViewList" class="nav nav-pills">          
           <li v-if="currentlyPlaying(c)" role="presentation"class="liItem2 current_selection"  v-for="c in contentItmes"  >
            <i v-if="canDoNextTrack(c)" v-on:click="post_key('PREV_TRACK')" class="fa fa-backward fa-2x faButt" aria-hidden="true"></i>
            <i v-if="canDoNextTrack(c)" v-on:click="post_key('NEXT_TRACK')" class="fa fa-forward fa-2x faButt" aria-hidden="true"></i>
            <h4  v-on:click="play(c)"> {{c.name}}</h4>
           </li>
        </ul>     
        <ul v-if="ViewList" class="nav nav-pills">          
           <li v-if="notCurrentlyPlayAndNotFiltered(c)" role="presentation"class="liItem2"  v-for="c in contentItmes"  >
            <h4  v-on:click="play(c)"> {{c.name}}</h4>
           </li>
        </ul>         
        <ul v-if="!ViewList" class="nav nav-pills">          
           <li role="presentation"class="liItem"  v-for="c in contentItmes" v-on:click="play(c)" >
            <div style="color:white;white-space: nowrap;"> {{c.name}}</div>
             <img v-bind:src=c.image height="170" width="170">
           </li>
        </ul>           
        <br />   
        <div v-if="selected_play.item!=''">          
          <hr style="height:1px;border:none;color:#333;background-color:#333;" />         
          <img v-if="selected_play.image!=''" v-bind:src="selected_play.image"  height="90" width="90">          
           <br /> 
           <div class="input-group editname">             
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" v-on:click="saveEditName(selected_play, edtName)" >
                  Save
                </button>
              </span>
              <input type="text" class="form-control" placeholder="" v-model="edtName">
            </div><!-- /input-group -->
            <br />
          <button v-on:click="remove_content(selected_play)" type="button" class="btn btn-danger">Remove </button>
        </div>    
    </div>
    
  </div>

</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'hello',
  data () {
    return {
      sortOrder: "",
      edtName: "",      
      rbViewOptions: 0,
      currentPlayingContent: {},
      currentlyPausible: false,
      openChangeInput: false,
      BoseSpeakerIP: "10.0.0.49",
      ViewList: true,
      about_show: false,
      selected_play: {
        item: "",
        name: "",
        image: "",                
      },
      now_playing: {
        item: "",
        name: "",
        image: "",                
      },
      ContentItem: '',
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
      now_playing_status: '',
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
        this.saveToLocalStorage();
      };
      this.get_now_playing(false);
  },
  computed: {
  },
  methods: {
    saveToLocalStorage() {
        localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes)); 
    }, 
    sortPlayList() {
      function compareAscName(a,b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      }
      function compareDescName(a,b) {
        if (a.name > b.name)
          return -1;
        if (a.name < b.name)
          return 1;
        return 0;
      }

      function compareLastPlayed(a,b) {  
        if (a.lastPlayed == undefined)  a.lastPlayed = 0;
        if (b.lastPlayed == undefined)  b.lastPlayed = 0;
        return b.lastPlayed - a.lastPlayed;
      }

      if (this.sortOrder == "by Name") {
        this.sortOrder = "by Last Play";
        this.contentItmes.sort(compareLastPlayed);
      }
      else {
        this.sortOrder = "by Name";
        this.contentItmes.sort(compareAscName);
      }
      this.saveToLocalStorage();

    },
    goodbye() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    isNotFiltered(c) {
      if (this.rbViewOptions == 0)
        return true;
      if (this.rbViewOptions == 1)   {
        if (c.item.indexOf("INTERNET_RADIO") > 0)
          return true;
      }
       if (this.rbViewOptions == 2)   {
        if (c.item.indexOf("STORED_MUSIC") > 0)
          return true;
      }
      return false;
    },
    canDoNextTrack(c) {
      if (c.item.indexOf("STORED_MUSIC") > 0)
          return true;
      return false;
    },
    currentlyPlaying(c) {
        if (c.item == this.currentPlayingContent.item) 
          return true;
        return false;
    },
    notCurrentlyPlayAndNotFiltered(c) {
      if (!this.currentlyPlaying(c)) {
        if (this.isNotFiltered(c))
          return true;
      };
      return false;  
    },
    isSameContent(a,b) {
        if (a.item == b.item)
          return true;
        return false;
    },
    setViewList(state) {
      this.ViewList = state;
    },
    check_inlist(ContentItem){
      for(var i in this.contentItmes){
            if (this.contentItmes[i].name != ContentItem.name)
              continue;
            if (this.contentItmes[i].image != ContentItem.image)
              continue; 
            return true;            
            break;
        };
        return false;
    },
    add_content(ContentItem) {
      if (this.check_inlist(ContentItem)) {
        alertify.warning(ContentItem.name+" is already in your list");
        return;
      };
      var newConent = {item:"",name:"",image:""};
      newConent.item = ContentItem.item;
      newConent.name = ContentItem.name;
      newConent.image = ContentItem.image;
      this.contentItmes.push(newConent);
      this.saveToLocalStorage();

    }, 
    saveEditName(ContentItem, edtName) {
      console.log('saveEditName start ' +edtName);
      for(var i in this.contentItmes){            
            if (this.contentItmes[i].name != ContentItem.name)
              continue;
            console.log(this.contentItmes[i].name);  
            if (this.contentItmes[i].image != ContentItem.image)
              continue; 
            console.log('saveEditName');
            this.contentItmes[i].name =  this.edtName;  
            this.saveToLocalStorage();
            break;
        };
      this.saveToLocalStorage();
    }, 
    remove_content(ContentItem) {
        if (this.contentItmes.length == 1) {
            alertify.warning("You must keep at least one item in the list");
            return;
        };
        for(var i in this.contentItmes){
            if (this.contentItmes[i].name != ContentItem.name)
              continue;
            if (this.contentItmes[i].image != ContentItem.image)
              continue; 
            if (this.contentItmes[i].item != ContentItem.item)
              continue;   
            this.contentItmes.splice(i, 1);
            this.saveToLocalStorage();
            break;
        };
        for(var i in this.contentItmes){
            this.play(this.contentItmes[i]);
            break;
        }
    },
    add_item() {
        alertify.warning("Share item. Not implemented yet");
    },
    get_ip() {
        if (this.BoseSpeakerIP == "") {
            this.$router.push('/register');
            return "";
        };
        return "http://"+this.BoseSpeakerIP;
    },
    do_open_register_screen() {
         this.$router.push('/register');
     },
    open_register_screen() {
         var instance = this;
         instance.$router.push('/register');
         //alertify.confirm('Open Settings?', function(){ instance.$router.push('/register');  }, function(){ return;}).setHeader('<em> Bose Speaker </em> '); ;
        //this.do_open_register_screen();
     },
    toggleAbout () {
        this.about_show = !this.about_show;
    },
    toggle_openChangeInput () {
      this.openChangeInput = ! this.openChangeInput;
    },
    get_bass() {
      if (this.bass == 10) return "";
      var range = 9;
      var percent = (this.bass - -9) / range      
      percent =  percent * 100;
      percent = percent.toFixed(0);
      return ""+percent+"%";

    },
    get_volume() {
      if (this.volume == -10) return "";
      return ""+this.volume+"%";

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
     post_key(_key) {
       alertify.warning(_key);
       var instance = this;
       var _url = this.get_ip()+":8090/key";
       var _body =  '<key state="press" sender="Gabbo">'+_key+'</key>';
       console.log(_url);
       console.log(_body);
        axios.post(_url, _body)
        .then(response => {
            console.log(response.data);
            _body =  '<key state="release" sender="Gabbo">'+_key+'</key>';
            axios.post(_url, _body).then(response => {
              console.log(response.data);
              if (_key == 'POWER')
                instance.get_now_playing(false);
            })
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
    get_now_playing(showWarning) {      
            this.now_playing_status = "Connecting";
             // var _url = "http://10.0.0.49:8090/trackInfo";
            var instance = this;
            var _url =  instance.get_ip()+":8090/now_playing"; 
            console.log(_url);
              axios.get(_url)
               .then(response => {
                  instance.boseObject =  response.data;
                  var s = response.data;
                  if (s.indexOf('STANDBY') > 0) {
                    instance.now_playing_status = 'STANDBY';
                    return;
                  }
                  console.log(instance.boseObject);
                  var startpos = instance.boseObject.indexOf("<ContentItem");
                  var endpos = instance.boseObject.indexOf("</ContentItem>") + 14;
                  var _content = "";
                  console.log(startpos);
                  _content = instance.boseObject.substring(startpos, endpos); 
                  //_content = _content.replace(/\"/g,'\\"');
                  instance.now_playing.item = _content;
                  console.log(instance.now_playing.item);
                  var parser = new DOMParser();
                  var xmlDoc = parser.parseFromString(instance.boseObject,"text/xml");                  
                  instance.now_playing.name =  xmlDoc.getElementsByTagName("itemName") [0].childNodes[0].nodeValue; 
                  if (xmlDoc.getElementsByTagName("containerArt").length)
                     instance.now_playing.image =  xmlDoc.getElementsByTagName("containerArt") [0].childNodes[0].nodeValue; 
                  instance.now_playing_status = instance.now_playing.name;                                 
                })
                .catch(function (response) {
                    console.log('get_now_playing');
                    console.log(response);
                    instance.now_playing_status = 'No Connection';
                    if (showWarning == true) {
                        instance.now_playing_status = "Failed to connect on "+instance.BoseSpeakerIP+".  Click Cogs to change settings";
                        alertify.warning("Failed to connect on "+instance.BoseSpeakerIP+"<br />Click Cogs to change settings");
                    }
                });
                
      },
      isPausable(ContentItem) {
        var s = ContentItem.item;
        if (s.indexOf('TUNEIN') > 0) {
          if (s.indexOf('tracklisturl') > 0)
            return true;
        } 
        // if (s.indexOf('LOCAL_MUSIC') > 0) return true;          
        return false;
      },
      email_contents() {
        alertify.warning("share item not done yet");
      },
      open_random_content() {
        var random_location = Math.floor(Math.random() * 100000)+1;
        var random_content = 
         {                                  
	    	item: "<ContentItem source=\"INTERNET_RADIO\" location=\""+random_location+"\" sourceAccount=\"\" isPresetable=\"true\"><itemName>JAZZfm 106.5</itemName><containerArt>http://item.radio456.com/007452/logo/logo-77625.jpg</containerArt></ContentItem>",
		    name: "Random -> "+random_location,
        image: ""
	      };
        this.play(random_content);

      },
      play(ContentItem) {
        this.currentlyPausible = false;
        if (this.isPausable(ContentItem))
          this.currentlyPausible = true;
        alertify.message("Opening ["+ContentItem.name+"]");
        this.edtName = ContentItem.name;
        this.now_playing_info = "Changing Station";
        this.selected_play.image = ContentItem.image;
        this.selected_play.item = ContentItem.item;
        this.selected_play.name = ContentItem.name;
        this.now_playing_status = ContentItem.name;
        ContentItem.lastPlayed = moment().unix();
        this.saveToLocalStorage();
        console.log(ContentItem.lastPlayed);
        var instance = this;
        var _url =  instance.get_ip()+":8090/select"; 
        var _body =  ContentItem.item;                  
          axios.post(_url, _body)
          .then(response => {
            instance.boseObject =  response.data; 
            instance.currentPlayingContent = ContentItem;
            //setTimeout(function(){ instance.get_now_playing(true)}, 5000);
          })
          .catch(function (response) {
                instance.now_playing_status = "Failed to connect on "+instance.BoseSpeakerIP+".  Click Cogs to change settings";
                alertify.warning("Failed to connect on "+instance.BoseSpeakerIP+"<br />Click Cogs to change settings");
            });

      },      
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blockButtons {
  display: inline-block;
}
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
.faButt {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.fa {
   cursor: pointer;   
   width: 50px;
}
.fa-power-off, .fa-cogs {
  float: right;  
  margin-right: 20px;
  width: 80px;
}
.fa-times, .fa-pencil-square-o  {
  float: right; 
}
.fa-star {
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
.liInfo {
  background-color: gray;
  color: white;
}
.liText {
  background-color: navy;
  color: white;
}
.liItem {
  cursor: pointer;
  background-color: black;  
  margin-top: 10px;
  height: 190px;
  width: 190px;
}
.viewOptions {
  margin-top: 10px;
  margin-left: 20px;
}
.liItem2 {
  cursor: pointer;  
  border: 1px solid black;
  background-color:darkgray;
  color: black;
  margin-top: 10px;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.ViewList{
  cursor: pointer;
  background-color: black;
  margin-top: 10px;
  height: 190px;
  width: 190px;
}
.boseimg {
  border-radius: 25px;
}
a {
  color: skyblue;
}
.view {
  float: left;
  background-color: white;
  font-weight: lighter;
}
.current_selection {
  background-color: rebeccapurple;
  color: white;
}
.editname {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
