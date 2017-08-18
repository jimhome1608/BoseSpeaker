<template>
    <div>
        <h3>Bose Speaker IP Address:</h3>
        <div class="container" align="left">
            <div class="input-group">
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" v-on:click="saveKeys" >Save</button>
              </span>
              <input type="text" class="form-control" placeholder="Enter IP of Bose Speaker" v-model="BoseSpeakerIP">
            </div><!-- /input-group -->
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
    export default {
        name: 'Register',
        data () {
            return {
                BoseSpeakerIP: "",
            }    
        },
        created: function () {
           if (localStorage.getItem("BoseSpeakerIP") != null) {
              this.BoseSpeakerIP = localStorage.getItem('BoseSpeakerIP');
           }
        },
        methods: {
            saveKeys() {
                localStorage.setItem("BoseSpeakerIP",this.BoseSpeakerIP);
                this.$router.push('/');
            },
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

</style>