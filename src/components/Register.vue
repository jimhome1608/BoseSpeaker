<template>
    <div>
        <h2>Bose Speaker IP Address: </h2>
        <div class="container">
            <div class="input-group">
              <span class="input-group-btn">
                <button class="btn btn-primary" type="button" v-on:click="saveKeys" >Save</button>
              </span>
              <input type="text" class="form-control" placeholder="Enter IP of Bose Speaker" v-model="BoseSpeakerIP">
            </div><!-- /input-group -->
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

<style>

</style>