<template>
    <div align="left">
         <!--  
        {{event_log.length}}
         {{event_log}}
         <div  v-for="r in event_log">
             {{getDate(r.time_stamp)}}&nbsp;&nbsp; {{getTime(r.time_stamp)}}&nbsp;&nbsp; {{r.event_data}}
        </div>
        -->
        Whats been playing...
        </table>
        <table class="table highlighted">
            <thead>
            <tr>
               <!--  <th class="nighttime">{{events.records.length}} Events</th> -->
                <th>Date</th>
                <th>Time</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
                <tr  v-for="r in event_log">
                  <td align="left"> {{getDate(r.time_stamp)}}</td>
                  <td align="left"> {{getTime(r.time_stamp)}}</td>
                  <td align="left"> {{r.action_tag1}}</td>
               </tr>
             </tbody>
         </table>
    </div>
</template>

<script>

import moment from 'moment';
import axios from 'axios';

export default {
        name: 'Backup',
        components: {
        },
        data () {
            return {
                event_log: [],
            }    
        },
        created: function () {
            this.load_from_backend();
        },
        computed: {
        },
        methods: {
            getDate: function(dt) {
                 var result = moment(dt);
                 result = result.format('ddd. DD-MMM');
                 return result;
             },
             getTime: function(dt) {
                 var result = moment(dt);
                 result = result.format('hh:mm a');
                 return result;
             },
            load_from_backend() {
                console.log("load_from_backend");                
                //http://localhost:51935/
                // var _url = "http://localhost:51935/api/EventLog";   
                //  {"action":"insert","api_key":"iamyumikowatanabe24121970","data":{"source":"bosespeaker","user":"","action":"play","action_data":""},"items":[]}
                var _url = "http://api.jimclark.net.au/api/EventLog";        
                var _body = '{"action":"select","api_key":"iamyumikowatanabe24121970","data":{"source":"bosespeaker","user":"","action":"","action_data":""},"items":[]}';
                var _bodyObject = JSON.parse(_body);
                 console.log(_bodyObject);
                 var instance = this;
                axios.post(_url,_bodyObject)
                .then(function (response) {
                  var _reply = JSON.stringify(response.data.items);
                   console.log(_reply);
                  var _replyObject = response.data;
                 // alertify.warning(_replyObject.items);
                   // console.log(_replyObject);
                  instance.event_log = JSON.parse(_reply);
                })
                .catch(function (response) {
                   console.log(response);
                });
            },
        }                  
}    
</script>

<style  scoped>
.highlighted {
    color:navy;
    background: white;
}

</style>