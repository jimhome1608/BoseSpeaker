import axios from 'axios';

export default {
  name: 'hello',
  data () {
    return {
      BoseSpeakerIP: "10.0.0.49",
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
        localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes));
      };
      this.get_now_playing(false);
  },
  methods: {
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
      localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes));

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
            this.contentItmes.splice(i, 1);
            localStorage.setItem("contentItmesStore",JSON.stringify(this.contentItmes));
            break;
        };
        for(var i in this.contentItmes){
            this.play(this.contentItmes[i]);
            break;
        }
    },
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
      if (this.bass == 10) return "Bass ";
      var range = 9;
      var percent = (this.bass - -9) / range      
      percent =  percent * 100;
      percent = percent.toFixed(0);
      return "Bass "+percent+"%";

    },
    get_volume() {
      if (this.volume == -10) return "Volume";
      return "Volume "+this.volume+"%";

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
    get_now_playing(showWarning) {      
            this.now_playing_status = "Connecting";
             // var _url = "http://10.0.0.49:8090/trackInfo";
            var instance = this;
            var _url =  instance.get_ip()+":8090/now_playing"; 
              axios.get(_url)
               .then(response => {
                  instance.boseObject =  response.data;
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
                  instance.now_playing.image =  xmlDoc.getElementsByTagName("containerArt") [0].childNodes[0].nodeValue; 
                  instance.now_playing_status = instance.now_playing.name;                                 
                })
                .catch(function (response) {
                    instance.now_playing_status = 'No Connection';
                    if (showWarning == true) {
                        instance.now_playing_status = "Failed to connect on "+instance.BoseSpeakerIP+".  Click Cogs to change settings";
                        alertify.warning("Failed to connect on "+instance.BoseSpeakerIP+"<br />Click Cogs to change settings");
                    }
                });
                
      },
      play(ContentItem) {
        this.now_playing_info = "Changing Station";
        this.selected_play.image = ContentItem.image;
        this.selected_play.item = ContentItem.name;
        this.selected_play.name = ContentItem.name;
        var instance = this;
        var _url =  instance.get_ip()+":8090/select"; 
        var _body =  ContentItem.item;                  
          axios.post(_url, _body)
          .then(response => {
            instance.boseObject =  response.data;  
            setTimeout(function(){ instance.get_now_playing(true)}, 5000);
          })
          .catch(function (response) {
                instance.now_playing_status = "Failed to connect on "+instance.BoseSpeakerIP+".  Click Cogs to change settings";
                alertify.warning("Failed to connect on "+instance.BoseSpeakerIP+"<br />Click Cogs to change settings");
            });

      },      
  }
}
