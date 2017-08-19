<template>
  <div class="container">     
    <div class="row"> 
        <ul class="nav nav-pills top_butts">          
          <li role="presentation" class="liButton"><i v-on:click="get_now_playing(true)" class="fa fa-music fa-2x" aria-hidden="true"></i></li>
          <li v-on:click="add_content(now_playing)" v-if="now_playing.name!=''" role="presentation" class="liStarButton"><i  class="fa fa-star fa-2x" aria-hidden="true"></i></li>        
          <li role="presentation" class="liText">&nbsp;{{now_playing_status}}&nbsp;</i></li>                       
          <li role="presentation" class="liInfo">&nbsp;{{get_volume()}}</i><br />
              <i v-on:click="volume_up_down(-1)" class="fa fa-volume-down fa-2x faButt" aria-hidden="true"></i>
              <i v-on:click="volume_up_down(1)" class="fa fa-volume-up fa-2x faButt" aria-hidden="true"></i>
          </li>             
          <li role="presentation" class="liInfo">&nbsp;{{get_bass()}}</i><br />
              <i v-on:click="bass_up_down(-1)" class="fa fa-sort-desc fa-2x faButt" aria-hidden="true"></i>
              <i v-on:click="bass_up_down(1)" class="fa fa-sort-asc fa-2x faButt" aria-hidden="true"></i>
          </li>   
          <li role="presentation">&nbsp;&nbsp;</i></li>             
          <li role="presentation" class="liButton"><i v-on:click="open_register_screen" class="fa fa-cogs fa-2x" aria-hidden="true"></i></li> 
        </ul>           
        <ul class="nav nav-pills">          
           <li role="presentation"class="liItem"  v-for="c in contentItmes" ><a v-on:click="play(c)">{{c.name}}</a></li>
        </ul>           
        <br />   
        <div v-if="selected_play.item!=''">
          <img v-bind:src="selected_play.image">
          <br />  
          <br />        
          <button v-on:click="remove_content(selected_play)" type="button" class="btn btn-danger"> <i class="fa fa-times" aria-hidden="true"></i>&nbsp;Remove  {{selected_play.name}} List</button>
        </div>    
    </div>
    
  </div>

</template>

<script src="./Hello.js" type="text/ecmascript-6" />

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
.faButt {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
}
.fa {
   cursor: pointer;
   width: 50px;
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
}
.boseimg {
  border-radius: 25px;
}
a {
  color: skyblue;
}
</style>
