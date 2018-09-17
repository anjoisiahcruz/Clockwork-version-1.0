import { timeTable } from "./components/TimeTables.js";
import { changeTimeZone } from "./components/ChangeTimeZone.js";

const vueApp = new Vue({
    el: "#app",
    data: {
        baseData: []
    },
    components: {
        'timeTable': timeTable,
        'timeZone': changeTimeZone
    },
    methods: {
        addBaseData: function (value) {
            if (value) {
                this.baseData.push(value);
            }
        }
    },
    mounted:
        function () {
            get("http://127.0.0.1:55145/api/currenttime", (responseText) => {
                this.baseData = JSON.parse(responseText);
            });
    },
    template: `
            <div id="app" class="row">
                <div class="col-lg-6 col-sm-12 mt-3">
                    <timeTable :tableData="baseData" :addData="addBaseData" />
                </div>
                <div class="col-lg-6 col-sm-12 mt-3">
                    <timeZone :addData="addBaseData" />
                </div>
            </div>`,

});