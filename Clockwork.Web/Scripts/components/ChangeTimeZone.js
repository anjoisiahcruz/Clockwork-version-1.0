export var changeTimeZone = Vue.component('changeTimeZone', {
    data() {
        return {
            selectedTimeZone: '',
            convertedTimeZone: {},
            errorMessage: '',
            timeZones: []
        };
    },
    props: {
        addData: {
            type: Function,
            required: true
        }
    },
    filters: {
        formatDateTime: function (value) {
            if (value) {
                return moment(String(value)).format('dddd, MMMM Do, YYYY hh:mm:ss a');
            }
        }
    },
    methods: {
        getServerTimeZone: function () {
            var uri = encodeURI(this.selectedTimeZone);
            post({
                url: "http://127.0.0.1:55145/api/timezone",
                data: "id=" + uri,
                callBackFunction: (responseText) => {
                    var result = JSON.parse(responseText);
                    if (result.errorMessage) {
                        this.errorMessage = result.errorMessage;
                    }
                    else {
                        this.errorMessage = "";
                        this.convertedTimeZone = result;
                        this.addData(result);
                    }
                }
            });
        },
    },
    computed: {
        hasErrorMessage() {
            return this.errorMessage !== "";
        }
    },
    mounted:
        function () {
            get("http://127.0.0.1:55145/api/timezone", (responseText) => {
                this.timeZones = JSON.parse(responseText);
            });
        },
    template:
        `
        <div>
            <div class="form-group">
                <div class="input-group">
                    <select id="timeZoneList" class="custom-select" v-model="selectedTimeZone">
                        <option value="" disabled hidden>Select a Time Zone</option>
                        <option v-for="timeZone in timeZones" v-bind:value="timeZone.id">
                            {{timeZone.displayName}}
                        </option>
                    </select>
                    <div class="input-group-append">
                        <button class="btn btn-primary" v-on:click="getServerTimeZone">Get Server Time</button>
                    </div>
                </div>
            </div>
            <div id="result">
                <div class="alert alert-success" role="alert">
                  <p class="alert-heading">Converted Server Time</p>
                  <h4 class="display-4">{{ convertedTimeZone.time | formatDateTime}}</h4>
                  <hr>
                
                   <dl class="row">
                        <dt class="col-sm-3">UTC Time</dt>
                        <dd class="col-sm-9 font-weight-light">{{ convertedTimeZone.utcTime | formatDateTime}}</dd>

                        <dt class="col-sm-3">Client IP</dt>
                        <dd class="col-sm-9 font-weight-light">{{ convertedTimeZone.clientIp }}</dd>
                   </dl>
                </div>
                <div id="timezone-error" v-bind:class="['alert', 'alert-danger', hasErrorMessage ? 'showError' : 'hideError']" role="alert">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close" @click="errorMessage = ''">&times;</a>
                    Error Message: {{ errorMessage }}
                </div>
            </div>
        </div>`
});