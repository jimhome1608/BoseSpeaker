<template>
    <div align="left">
        <h3>Back Up</h3> <br />
        <input type="text" class="form-control" v-model="contentItems" height="300">
        <br /><br />
         <br />
    </div>
</template>

<script>
export default {
        name: 'Backup',
        data () {
            return {
                contentItems: {},
            }    
        },
        created: function () {
            if (localStorage.getItem("contentItmesStore") != null) {
              this.contentItems = localStorage.getItem('contentItmesStore');
           }
        },
        computed: {
        },
        methods: {
        }                  
}    
</script>

<style  scoped>

</style>