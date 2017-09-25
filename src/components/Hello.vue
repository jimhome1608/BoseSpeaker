

<template>
  <div class="wrapper">
  <div class="container">      
    <div class="row"> 
      <div>
          <h3 align="left">Bose Speaker
             <i class="fa fa-info" aria-hidden="true" v-on:click="open_video"></i>            
            <i v-on:click="post_key('POWER')" class="fa fa-power-off" aria-hidden="true"></i>         
            <i v-on:click="open_register_screen" class="fa fa-cogs" aria-hidden="true"></i>              
          </h3>
      </div>   
  
        <div align="left">   
          <h3 align="left">&nbsp;{{now_playing_status}}&nbsp;
          <i  v-on:click="get_now_playing(true)" class="fa fa-music faButt" aria-hidden="true"></i>          
          <i v-on:click="add_content(now_playing)" v-if="now_playing.name!=''"  class="fa fa-star faButt" aria-hidden="true"></i>
          <i v-if="!openChangeInput" v-on:click="toggle_openChangeInput" class="fa fa-folder-o faButt" aria-hidden="true">..</i>     
           <div class="blockButtons">                                             
              <i v-if="openChangeInput" v-on:click="toggle_openChangeInput" class="fa fa-folder-open-o faButt" aria-hidden="true">..</i>   
              <i v-if="openChangeInput" v-on:click="email_contents" class="fa fa-share-alt faButt" aria-hidden="true"></i>   
              <i v-if="openChangeInput" v-on:click="post_key('AUX_INPUT')" class="fa fa-microphone faButt" aria-hidden="true"></i>   
              <i v-if="openChangeInput" v-on:click="open_random_content" class="fa fa-exclamation faButt" aria-hidden="true"></i>                 
           </div> 
          </h3>                                                                                                     
        </div>   
        <div class="view"  align="left">
             <i v-on:click="sortPlayList" class="fa fa-refresh fa-2x faButt" aria-hidden="true"></i>     
             {{sortOrder}}                                     
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
        
        <div class="displaytable"  align="left">          
            <div class="current_selection filterdiv" align="left" v-on:click="onFilterClick" > 
                {{filterCaption}}
           </div> 
           <div v-if="currentlyPlaying(c)" role="presentation"class="liItem2 current_selection"  v-for="c in contentItmes"  >
             <h4  class = "blockButtons" v-on:click="play(c)"> {{c.name}}</h4><br />
             <i v-if="currentlyPausible" v-on:click="post_key('PAUSE')" class="fa fa-pause fa-2x faButt" aria-hidden="true"></i>
             <i v-if="currentlyPausible" v-on:click="post_key('PLAY')" class="fa fa-play fa-2x faButt" aria-hidden="true"></i>         
            <i v-if="canDoNextTrack(c)" v-on:click="post_key('PREV_TRACK')" class="fa fa-backward fa-2x faButt" aria-hidden="true"></i>
            <i v-if="canDoNextTrack(c)" v-on:click="post_key('NEXT_TRACK')" class="fa fa-forward fa-2x faButt"  aria-hidden="true"></i>             
            <div v-if="now_playing_track!=''">              
              <mark v-if="now_playing_track.indexOf('Changing to') >=0">{{now_playing_track}}</mark>
              <div v-else>{{now_playing_track}}</div>
             </div>                        
           </div>                      
        </div>        
        

        <br />
        <ul v-if="filterMode!=3" class="nav nav-pills">  
           <li v-if="notCurrentlyPlayAndNotFiltered(c)" role="presentation"class="liItem2"  v-for="c in contentItmes"  >
            <h4  v-on:click="play(c)"> {{c.name}}</h4>
           </li>
        </ul>         
        <ul v-if="filterMode==3 " class="nav nav-pills"> 
           <li  role="presentation"class="liItem2"  v-for="p in presetItems"  >
            <h4  v-on:click="play(p)"> {{p.name}}</h4>
           </li>
        </ul>     
        <br />   
        <div v-if="selected_play.item!=''">          
          <hr style="height:1px;border:none;color:#333;background-color:#333;" />         
           <div v-if="filterMode!=3"> 
           <div  class="input-group editname">             
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
             <div class="editPresets h4" v-if="filterMode==3" align="left"> 
               Edit and Remove functions not available for your current view of <mark><strong>Device Presets</strong></mark>.  <br />
               These items are set on the BOSE Device itself<br />
               Ability to add/remove presets on device from this app are planned for future updates
            </div>             
        </div>    
    </div>    
  </div>
  </div>

</template>

<script>

import axios from 'axios';
import moment from 'moment';
// https://www.npmjs.com/package/jxon
import JXON from 'jxon';

export default {
  name: 'hello',
  data () {
    return {
      deviceInfo: {},
      sortOrder: "",
      edtName: "",      
      filterMode: 0,
      filterCaption: "All Sources",
      currentPlayingContent: {},
      currentlyPausible: false,
      openChangeInput: false,
      BoseSpeakerIP: "10.0.0.49",
      about_show: false,
      selected_play: {
        item: "",
        name: "",
      },
      now_playing: {
        item: "",
        name: "",
      },
      ContentItem: '',
      contentItmesStore: "",
      presetsFromXML: {},
      presetItems: [],
      contentItmes: [
        {                                  
	    	item: "<ContentItem source=\"INTERNET_RADIO\" location=\"77625\" sourceAccount=\"\" isPresetable=\"true\"><itemName>JAZZfm 106.5</itemName><containerArt>http://item.radio456.com/007452/logo/logo-77625.jpg</containerArt></ContentItem>",
		    name: "JAZZfm 106.5",
	      },
        {
	    	item: "<ContentItem source=\"INTERNET_RADIO\" location=\"64030\" sourceAccount=\"\" isPresetable=\"true\"><itemName>ABC Classic 2</itemName><containerArt>http://item.radio456.com/007452/logo/logo-64030.jpg</containerArt></ContentItem>",
		    name: "ABC Classic",
	      }
      ],
      boseObject: '' ,
      volumeObject: '',
      volume: -10,
      bassObject: '',
      bass: 10,      
      now_playing_status: '',
      now_playing_track: '',
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
      this.get_presets();
      this.get_now_playing(false);
  },
  computed: {
  },
  methods: {
    open_video() {
        alertify.confirm("This video will take a moment or 2 to load so you will need to be patient...", 
          function(){
            var win = window.open('http://bosespeaker.jimclark.net.au/video/bosespeaker.mp4', '_blank');
            win.focus();
           });
    },
    saveToLocalStorage() {
        localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes)); 
    }, 
    onFilterClick() {
      
      switch (this.filterMode) {
          case 0:
              var _count = this.countContentItmes("STORED_MUSIC"); 
              _count = _count + this.countContentItmes("LOCAL_MUSIC"); 
              if (_count > 0) {
                this.filterMode = 1;
                this.filterCaption = "Local Library..";
                break;
              }
          case 1:
              var _count = this.countContentItmes("INTERNET_RADIO"); 
              if (_count > 0) {
                  this.filterMode = 2;
                  this.filterCaption = "Internet Radio..";
                  break;
              }
          case 2:
              var _count = this.presetItems.length; 
              if (_count  > 0) {
                  this.filterMode = 3;
                  this.filterCaption = "Device Presets..";
                  break;
              }
          case 3:
              var _count = this.countContentItmes("TUNEIN");
              if (_count  > 0) {
                   this.filterMode = 4;
                  this.filterCaption = "Tune In..";
                  break;              
              }
          case 4:
              this.filterMode = 0;
              this.filterCaption = "All Sources..";
              break;
          default:
              this.filterMode = 0;
              this.filterCaption = "All Sources..";
              break;
      } 
    },
    countContentItmes(ContainsThisString) {
      var _result = 0;
      if (ContainsThisString.trim() == '' )
        return this.contentItmes.length;
      ContainsThisString = ContainsThisString.toUpperCase();  
      var parser = new DOMParser();
      for(var i in this.contentItmes){           
          var xmlDocFromList = parser.parseFromString(this.contentItmes[i].item, "text/xml");  
          var _item = this.contentItmes[i].item; 
          _item = _item.toUpperCase();
          if (_item.indexOf(ContainsThisString) > 0)                    
            _result++;
      };
      return _result;
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
    isNotFiltered(c) {
      if (this.filterMode == 0)
        return true;
      if (this.filterMode == 2)   {
        if (c.item.indexOf("INTERNET_RADIO") > 0)
          return true;
      }
      if (this.filterMode == 1)   {
        if ((c.item.indexOf("STORED_MUSIC") > 0) || (c.item.indexOf("LOCAL_MUSIC") > 0))
          return true;
      }
      if (this.filterMode == 3)   {
        if  (typeof c.item.preset != "undefined") 
          return true;
      }
      if (this.filterMode == 4)   {
        if (c.item.indexOf("TUNEIN") > 0)
          return true;
      }
      // TUNEIN
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
    check_inlist_source_location(c) {
      //return "";
      //need to remove <itemName> element to allow for name change from original
      //<ContentItem source="STORED_MUSIC" location="22$99" sourceAccount="0011327a-94ee-0011-ee94-ee947a321100/0" isPresetable="true"><itemName>Toumastin _ Adagh</itemName></ContentItem>

       console.log("check_inlist_source_location");       
      // console.log(c.item);       
       var parser = new DOMParser();
       var xmlDoc = parser.parseFromString(c.item,"text/xml"); 
       var inSource = xmlDoc.getElementsByTagName("ContentItem")[0].getAttribute("source"); 
       var inLocation = xmlDoc.getElementsByTagName("ContentItem")[0].getAttribute("location"); 
       var source = "";
       var location = "";  
       var _item = ""; 
       var _name = "";    
       for(var i in this.contentItmes){           
            var xmlDocFromList = parser.parseFromString(this.contentItmes[i].item, "text/xml");  
            _item = this.contentItmes[i].item;                     
            source = xmlDocFromList.getElementsByTagName("ContentItem")[0].getAttribute("source"); 
            location = xmlDocFromList.getElementsByTagName("ContentItem")[0].getAttribute("location"); 
            _name =   this.contentItmes[i].name; 
            if (inSource != source) continue;
            if (inLocation != location) continue;            
            return {found:true,name:_name,item:_item};
            break;
        };
      return {found:false,name:''};
    },
    add_content(ContentItem) {
      if (this.check_inlist_source_location(ContentItem).found) {
        alertify.warning(ContentItem.name+" is already in your list");
        return;
      };
      var newConent = {item:"",name:""};
      newConent.item = ContentItem.item;
      newConent.name = ContentItem.name;
      this.contentItmes.push(newConent);
      this.saveToLocalStorage();

    }, 
    get_presets(){
      var instance = this;
      var _url =  instance.get_ip()+":8090/presets"; 
       axios.get(_url)
        .then(response => {                    
          //{{presetsFromXML.presets.preset[0].ContentItem.itemName}}   
          instance.presetsFromXML = JXON.stringToJs(response.data);
          var _makeContent = "";
          var c = {};
          if (instance.presetsFromXML.hasOwnProperty('presets')) {
              for (var p in instance.presetsFromXML.presets.preset) {
                c = instance.presetsFromXML.presets.preset[p].ContentItem;
                console.log(c.$location);   
                _makeContent = 
                  '<ContentItem source="'+c.$source+'" location="'+c.$location+'" sourceAccount="'+c.$sourceAccount+'"><itemName>'+c.itemName+'</itemName><containerArt/></ContentItem>';             
                console.log(_makeContent);   
                var _content = {item:"",name:""};
                _content.item = _makeContent;
                _content.name = c.itemName;
                _content.preset = true;
                instance.presetItems.push(_content)   
              };
          };
        });           
    },
    saveEditName(ContentItem, edtName) {
      console.log('saveEditName start ' +edtName);
      for(var i in this.contentItmes){            
            if (this.contentItmes[i].name != ContentItem.name)
              continue;
            console.log(this.contentItmes[i].name);  
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

       function capitalize_Words(str)
       {
           return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
       }

       var _msg = _key.replace("_", " ");
       _msg = _msg.toLowerCase();
       _msg = capitalize_Words(_msg);
       if (_key == "PREV_TRACK" || _key == "NEXT_TRACK" )
          this.now_playing_track = "Changing to .. "+_msg;
       else
         alertify.warning(_msg);
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
              setTimeout(function(){ instance.get_now_playing(false)}, 5000);                                  
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
    /*

    http://10.0.0.49:8090/presets

    lots more info returned in now_play such as current track
    This XML file does not appear to have any style information associated with it. The document tree is shown below.
      <nowPlaying deviceID="9884E39A8AB2" source="STORED_MUSIC" sourceAccount="0011327a-94ee-0011-ee94-ee947a321100/0">
       <ContentItem source="STORED_MUSIC" location="22$110" sourceAccount="0011327a-94ee-0011-ee94-ee947a321100/0" isPresetable="true">
       <itemName>Grieg_ Peer Gynt, From Holberg's Time</itemName></ContentItem><track>Grieg: Peer Gynt, Op. 23 - Solveig's Song</track>
       <artist>Elly Ameling; Edo De Waart: San Francisco Symphony Orchestra & Chorus</artist>
       <album>Grieg: Peer Gynt, From Holberg's Time</album><offsetoffset>8</offsetoffset>
       <art artImageStatus="SHOW_DEFAULT_IMAGE"/><time total="326">98</time><skipEnabled/><playStatus>PLAY_STATE</playStatus><shuffleSetting>SHUFFLE_OFF</shuffleSetting><repeatSetting>REPEAT_OFF</repeatSetting><skipPreviousEnabled/></nowPlaying>
     */  
    get_now_playing(showWarning) {                                   
            //this.now_playing_status = "Connecting";
             // var _url = "http://10.0.0.49:8090/trackInfo";
            var instance = this;
            var _url =  instance.get_ip()+":8090/now_playing"; 
            var _hasTrackInfo = true;
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
                  if (_content.indexOf("STORED_MUSIC") < 0)
                    _hasTrackInfo = false;
                  if (_hasTrackInfo) {
                      var _offset = "";
                      var _track = xmlDoc.getElementsByTagName("track")[0].childNodes[0].nodeValue; 
                      _offset = xmlDoc.getElementsByTagName("offset")[0].childNodes[0].nodeValue; 
                      //instance.now_playing.track = 
                      startpos = _track.indexOf(",");
                     // console.log("length");
                     // console.log(xmlDoc.getElementsByTagName("track").NodeList.getLength());
                      if (startpos > 0)
                        _track = _track.substring(startpos+1, 255); 
                      _track = _track.trim(); 
                      if (_track != '')
                        _track = _offset+") "+_track;
                      instance.now_playing_track =  _track; 
                                          
                  }      
                  else 
                    instance.now_playing_track = "";            
                  var _inlist = this.check_inlist_source_location(instance.now_playing)   ;
                  console.log("_inlist");
                  console.log(_inlist);
                  if (_inlist.found == true) {  
                    if ( this.selected_play.item != _inlist.item) {
                       instance.now_playing_status = _inlist.name;
                       instance.play(_inlist);
                       return;
                    }
                  }  
                  else
                    instance.now_playing_status = instance.now_playing.name; 
                  setTimeout(function(){ instance.get_now_playing(false)}, 5000);                                              
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
	      };
        this.play(random_content);

      },
      play(ContentItem) {
        // can save <offset>3</offset> in content to save and replay a particular track
        
        //console.log(ContentItem.item);
        this.currentlyPausible = false;
        if (this.isPausable(ContentItem))
          this.currentlyPausible = true;
        alertify.message("Opening ["+ContentItem.name+"]");
        this.edtName = ContentItem.name;
        this.now_playing_info = "Changing Station";
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
           // setTimeoutsetTimeout(function(){ instance.get_now_playing(false)}, 5000);                                             
          })
          .catch(function (response) {
              console.log(response);  
              instance.now_playing_status = "Failed to connect on "+instance.BoseSpeakerIP+".  Click Cogs to change settings";
              alertify.warning("Failed to connect on "+instance.BoseSpeakerIP+"<br />Click Cogs to change settings");
            });

      },      
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .container {
    margin-left: 10px;
    color: white;
  }
  .blockButtons {
    display: inline-block;
  }
  .displaytable {
    display: table;
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
  .fa-power-off, .fa-cogs, .fa-info {
    float: right;  
    margin-right: 10px;
    width: 50px;
  }
  .fa-times, .fa-pencil-square-o  {
    float: right; 
  }
  .fa-star {
    color:#337ab7;
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
    font-weight: lighter;  
  }
  .current_selection {
    float: right; 
    border: 1px solid grey;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 15px;
    margin-right: 15px;
  }
  .editname {
    padding-left: 50px;
    padding-right: 50px;
  }
  .filterdiv {
    width: 120px;
    height: 52px;
    cursor: pointer;
    margin-left: 10px; 
  }
  mark {
    border-radius: 25px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .editPresets {
    background-color: transparent;
    color: white;
    border-radius: 25px;
    line-height: 1.5;
  }
</style>
